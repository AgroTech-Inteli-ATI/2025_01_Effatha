# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
import ee
import os
import re
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
import json
from fastapi.encoders import jsonable_encoder

app = FastAPI(title="Agro Metrics API - Earth Engine (local)")

# Pydantic model for request (semi-DTO)
class ComputeRequest(BaseModel):
    geometry: Optional[Dict[str, Any]] = None  # GeoJSON
    kml: Optional[str] = None                 # KML string
    start_date: str
    end_date: str
    collection: Optional[str] = Field("SENTINEL2", description="SENTINEL2 = Sentinel-2 L2A")
    max_biomass: Optional[float] = None
    timeseries: Optional[bool] = Field(False, description="If true, returns timeseries")
    # timeseries mode: per_image = each acquisition; period = aggregate every N days
    timeseries_unit: Optional[str] = Field("per_image", description="Options: 'per_image' or 'period'")
    timeseries_period_days: Optional[int] = Field(10, description="Period in days when timeseries_unit='period'")
    max_images: Optional[int] = Field(100, description="Cap on number of images to process in per_image mode (safety)")

# carrega .env que está na mesma pasta de app.py
basedir = os.path.dirname(__file__)
env_path = os.path.join(basedir, ".env")
load_dotenv(env_path)

# Earth Engine init
def init_ee():
    """
    Inicializa Earth Engine de forma robusta:
    - tenta usar SERVICE_ACCOUNT_EMAIL + GOOGLE_APPLICATION_CREDENTIALS_PATH + GEE_PROJECT
    - se GEE_PROJECT não informado, tenta ler project_id do JSON da chave
    - fallback: autenticação interativa (dev)
    """
    service_account = os.getenv("SERVICE_ACCOUNT_EMAIL")
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
    project = os.getenv("GEE_PROJECT")

    # se chave JSON existe mas project not set, tente extrair project_id do JSON
    if (not project) and key_path and os.path.exists(key_path):
        try:
            with open(key_path, "r") as f:
                jd = json.load(f)
                if not service_account:
                    service_account = jd.get("client_email")
                if not project:
                    project = jd.get("project_id")
        except Exception as e:
            print("Erro lendo JSON da chave:", e)

    # se temos service account e key_path e arquivo existe -> use service account
    if service_account and key_path and os.path.exists(key_path):
        try:
            creds = ee.ServiceAccountCredentials(service_account, key_path)
            if project:
                ee.Initialize(creds, project=project)
            else:
                # se ainda não temos project, inicialize mesmo assim (pode falhar)
                ee.Initialize(creds)
            print("EE initialized with Service Account:", service_account, "project:", project)
            return
        except Exception as e:
            print("Falha ao inicializar EE com service account:", e)

    # fallback para dev local (interativo) - apenas se correr localmente com usuário autenticado
    try:
        ee.Initialize()
        print("EE initialized with existing application-default/interactive credentials.")
    except Exception:
        print("Attempting interactive ee.Authenticate() - only for local dev.")
        ee.Authenticate()
        ee.Initialize()

init_ee()

# Helpers
def kml_to_polygon_coords(kml_text: str):
    """
    Extract the first collection of coordinates found in a simple KML
    and return a list-of-lon-lat pairs suitable for ee.Geometry.Polygon.
    Assume struct: <coordinates>lon,lat,alt lon,lat,alt ...</coordinates>
    """
    
    m = re.search(r"<coordinates>(.*?)</coordinates>", kml_text, re.DOTALL | re.IGNORECASE)
    if not m:
        raise ValueError("KML não contém tag <coordinates> reconhecível.")
    coords_text = m.group(1).strip()

    # coords can be separated by whitespace/newline
    parts = re.split(r"\s+", coords_text.strip())
    
    polygon = []
    for p in parts:
        if not p.strip():
            continue
        pieces = p.split(",")
        lon = float(pieces[0]); lat = float(pieces[1])
        polygon.append([lon, lat])
    return [polygon] # return as single polygon ring (GeoJSON-like)

# Converts geoJSON to ee geometry
def geojson_to_ee_geometry(geojson):
    geom_type = geojson.get("type")
    if geom_type == "Feature":
        geojson = geojson.get("geometry")
        geom_type = geojson.get("type")
    if geom_type == "Polygon":
        coords = geojson.get("coordinates")
        return ee.Geometry.Polygon(coords)
    if geom_type == "MultiPolygon":
        coords = geojson.get("coordinates")
        return ee.Geometry.MultiPolygon(coords)
    raise ValueError("GeoJSON não é Polygon/MultiPolygon.")

# Selects the satellite 
def select_sentinel_collection(collection_name: str):
    if collection_name.upper() == "SENTINEL2":
        return ee.ImageCollection("COPERNICUS/S2_SR")
    raise ValueError("Collection não suportada: " + collection_name)

# Calculate the target metrics from the image
def calc_indices_from_image(img):
    """
    Input: single ee.Image (com bandas Sentinel-2 nominais)
    Output: image with metrics NDVI, EVI, NDWI, NDMI, GNDVI, NDRE, RENDVI, BIOMASSA_PROXY
    """

    # ensure bands exist - Sentinel2 SR typical bands: B2,B3,B4,B5,B6,B7,B8,B8A,B11,B12
    # scale reflectance values (S2_SR are scaled by 10000)
    scaled = img.select(["B2","B3","B4","B5","B6","B7","B8","B8A","B11","B12"]).divide(10000.0)
    B2 = scaled.select("B2")   # blue
    B3 = scaled.select("B3")   # green
    B4 = scaled.select("B4")   # red
    B5 = scaled.select("B5")   # red-edge 1
    B6 = scaled.select("B6")   # red-edge 2
    B7 = scaled.select("B7")   # red-edge 3
    B8 = scaled.select("B8")   # nir (10m)
    B8A = scaled.select("B8A") # nir narrow (20m)
    B11 = scaled.select("B11") # swir1
    B12 = scaled.select("B12") # swir2


    ndvi = B8.subtract(B4).divide(B8.add(B4)).rename("NDVI")

    evi = B8.subtract(B4).multiply(2.5).divide(B8.add(B4.multiply(6)).subtract(B2.multiply(7.5)).add(1)).rename("EVI")

    ndwi = B3.subtract(B8).divide(B3.add(B8)).rename("NDWI")

    ndmi = B8.subtract(B11).divide(B8.add(B11)).rename("NDMI")

    gndvi = B8.subtract(B3).divide(B8.add(B3)).rename("GNDVI")

    ndre = B8.subtract(B5).divide(B8.add(B5)).rename("NDRE")

    rendvi = B8.subtract(B6).divide(B8.add(B6)).rename("RENDVI")

    # Estimate value >>VALIDATE<<
    biomass_proxy = ndvi.add(1).divide(2).rename("BIOMASSA_PROXY")

    # Assemble
    out = ndvi.addBands([evi, ndwi, ndmi, gndvi, ndre, rendvi, biomass_proxy])
    return out

def reduce_image_over_region(img, geom, scale=10):
    # compute mean, median and std for each band
    
    reducer = ee.Reducer.mean().combine(ee.Reducer.median(), "", True).combine(ee.Reducer.stdDev(), "", True)
    stats = img.reduceRegion(reducer=reducer, geometry=geom, scale=scale, maxPixels=1e13, tileScale=4)
    return stats

# per-image timeseries (smallest unit: each acquisition)
def per_image_timeseries(collection, geom, max_images=100):
    size = collection.size().getInfo()
    if size == 0:
        return []
    limit = min(size, max_images)
    imgs = collection.sort('system:time_start').toList(limit)
    result = []
    for i in range(limit):
        img = ee.Image(imgs.get(i))
        date = img.date().format('YYYY-MM-dd').getInfo()
        indices_img = calc_indices_from_image(img)
        stats = reduce_image_over_region(indices_img, geom)
        # stats.getInfo() returns dict with numeric values or None
        stats_dict = stats.getInfo()
        entry = {"date": date, "metrics": stats_dict}
        result.append(entry)
    # if size > max_images, include a note
    note = None
    if size > max_images:
        note = f"Limited to {max_images} images out of {size} available. Increase max_images to include more."
    return {"count_available": size, "returned_count": len(result), "note": note, "series": result}

# period timeseries (sliding fixed windows of N days)
def period_timeseries(collection, geom, start_date, end_date, period_days=10):
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    current = start
    result = []
    while current <= end:
        period_start = ee.Date(current.strftime("%Y-%m-%d"))
        next_dt = current + timedelta(days=period_days)
        period_end_py = next_dt - timedelta(days=1)
        period_end = ee.Date(next_dt.strftime("%Y-%m-%d")).advance(-1, "day")
        col = collection.filterDate(period_start, ee.Date(next_dt.strftime("%Y-%m-%d"))).filterBounds(geom).filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
        count = col.size().getInfo()
        if count == 0:
            result.append({"period_start": current.strftime("%Y-%m-%d"), "period_end": period_end_py.strftime("%Y-%m-%d"), "count": 0})
        else:
            comp = col.median()
            indices_img = calc_indices_from_image(comp)
            stats = reduce_image_over_region(indices_img, geom)
            stats_dict = stats.getInfo()
            result.append({"period_start": current.strftime("%Y-%m-%d"), "period_end": period_end_py.strftime("%Y-%m-%d"), "count": count, "metrics": stats_dict})
        current = next_dt
    return result

# ---------- Endpoint ----------
@app.post("/compute")
def compute_metrics(req: ComputeRequest):
    # validate dates
    try:
        datetime.fromisoformat(req.start_date)
        datetime.fromisoformat(req.end_date)
    except Exception:
        raise HTTPException(status_code=400, detail="Formato de data inválido. Use YYYY-MM-DD.")

    if req.geometry:
        try:
            ee_geom = geojson_to_ee_geometry(req.geometry)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif req.kml:
        try:
            coords = kml_to_polygon_coords(req.kml)
            ee_geom = ee.Geometry.Polygon(coords)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail="Forneça 'geometry' (GeoJSON) ou 'kml' (string).")

    # pick collection
    try:
        col = select_sentinel_collection(req.collection)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # filter
    col = col.filterDate(req.start_date, req.end_date).filterBounds(ee_geom)

    # timeseries handling
    if req.timeseries:
        if req.timeseries_unit == "per_image":
            # smallest available unit: each acquisition (scene)
            ts = per_image_timeseries(col, ee_geom, max_images=req.max_images or 100)
            return {"timeseries_mode": "per_image", **ts}
        else:
            # period mode: use period_days
            days = req.timeseries_period_days or 10
            ts = period_timeseries(col, ee_geom, req.start_date, req.end_date, period_days=days)
            return {"timeseries_mode": f"{days}d_periods", "series": ts}

    # otherwise single composite summarizing whole period
    col = col.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
    size = col.size().getInfo()
    if size == 0:
        raise HTTPException(status_code=404, detail="Nenhuma imagem disponível para o período/área com filtro atual (verificar nuvens).")

    comp = col.median()
    indices_img = calc_indices_from_image(comp)
    stats = reduce_image_over_region(indices_img, ee_geom, scale=10)
    stats_dict = stats.getInfo()

    response = {"image_count": size, "requested_period": {"start": req.start_date, "end": req.end_date}, "metrics": stats_dict}
    if req.max_biomass is not None:
        proxy_key = "BIOMASSA_PROXY_mean"
        if proxy_key in stats_dict and stats_dict[proxy_key] is not None:
            response["BIOMASSA_EST_mean"] = stats_dict[proxy_key] * req.max_biomass
        else:
            response["BIOMASSA_EST_mean"] = None
    return jsonable_encoder(response)

# python -m uvicorn app:app --reload --port 8000
