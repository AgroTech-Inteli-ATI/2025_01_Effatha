# app.py
from flask import Flask, request, jsonify, make_response
from typing import Optional, Any, Dict
import ee
import os
import re
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False  # preservar ordem (opcional)

# carrega .env que está na mesma pasta de app.py
basedir = os.path.dirname(__file__)
env_path = os.path.join(basedir, ".env")
load_dotenv(env_path)

# ---------- Earth Engine init (mesma lógica) ----------
def init_ee():
    service_account = os.getenv("SERVICE_ACCOUNT_EMAIL")
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
    project = os.getenv("GEE_PROJECT")

    # tenta extrair project_id/client_email do JSON se não fornecido
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

    # tenta inicializar com service account
    if service_account and key_path and os.path.exists(key_path):
        try:
            creds = ee.ServiceAccountCredentials(service_account, key_path)
            if project:
                ee.Initialize(creds, project=project)
            else:
                ee.Initialize(creds)
            print("EE initialized with Service Account:", service_account, "project:", project)
            return
        except Exception as e:
            print("Falha ao inicializar EE com service account:", e)

    # fallback: credenciais aplicáveis localmente / interativas
    try:
        ee.Initialize()
        print("EE initialized with existing application-default/interactive credentials.")
    except Exception:
        print("Attempting interactive ee.Authenticate() - only for local dev.")
        ee.Authenticate()
        ee.Initialize()

init_ee()

# ---------- Helpers (copiados/ajustados) ----------
def kml_to_polygon_coords(kml_text: str):
    m = re.search(r"<coordinates>(.*?)</coordinates>", kml_text, re.DOTALL | re.IGNORECASE)
    if not m:
        raise ValueError("KML não contém tag <coordinates> reconhecível.")
    coords_text = m.group(1).strip()
    parts = re.split(r"\s+", coords_text.strip())
    polygon = []
    for p in parts:
        if not p.strip():
            continue
        pieces = p.split(",")
        lon = float(pieces[0]); lat = float(pieces[1])
        polygon.append([lon, lat])
    return [polygon]

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

def select_sentinel_collection(collection_name: str):
    if (collection_name or "").upper() == "SENTINEL2":
        return ee.ImageCollection("COPERNICUS/S2_SR")
    raise ValueError("Collection não suportada: " + str(collection_name))

def calc_indices_from_image(img):
    scaled = img.select(["B2","B3","B4","B5","B6","B7","B8","B8A","B11","B12"]).divide(10000.0)
    B2 = scaled.select("B2"); B3 = scaled.select("B3"); B4 = scaled.select("B4")
    B5 = scaled.select("B5"); B6 = scaled.select("B6"); B7 = scaled.select("B7")
    B8 = scaled.select("B8"); B8A = scaled.select("B8A"); B11 = scaled.select("B11"); B12 = scaled.select("B12")

    ndvi = B8.subtract(B4).divide(B8.add(B4)).rename("NDVI")
    evi = B8.subtract(B4).multiply(2.5).divide(B8.add(B4.multiply(6)).subtract(B2.multiply(7.5)).add(1)).rename("EVI")
    ndwi = B3.subtract(B8).divide(B3.add(B8)).rename("NDWI")
    ndmi = B8.subtract(B11).divide(B8.add(B11)).rename("NDMI")
    gndvi = B8.subtract(B3).divide(B8.add(B3)).rename("GNDVI")
    ndre = B8.subtract(B5).divide(B8.add(B5)).rename("NDRE")
    rendvi = B8.subtract(B6).divide(B8.add(B6)).rename("RENDVI")
    biomass_proxy = ndvi.add(1).divide(2).rename("BIOMASSA_PROXY")

    out = ndvi.addBands([evi, ndwi, ndmi, gndvi, ndre, rendvi, biomass_proxy])
    return out

def reduce_image_over_region(img, geom, scale=10):
    reducer = ee.Reducer.mean().combine(ee.Reducer.median(), "", True).combine(ee.Reducer.stdDev(), "", True)
    stats = img.reduceRegion(reducer=reducer, geometry=geom, scale=scale, maxPixels=1e13, tileScale=4)
    return stats

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
        stats_dict = stats.getInfo()
        entry = {"date": date, "metrics": stats_dict}
        result.append(entry)
    note = None
    if size > max_images:
        note = f"Limited to {max_images} images out of {size} available. Increase max_images to include mais."
    return {"count_available": size, "returned_count": len(result), "note": note, "series": result}

def period_timeseries(collection, geom, start_date, end_date, period_days=10):
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    current = start
    result = []
    while current <= end:
        period_start = ee.Date(current.strftime("%Y-%m-%d"))
        next_dt = current + timedelta(days=period_days)
        period_end_py = next_dt - timedelta(days=1)
        # filter até next_dt (exclusive)
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

# ---------- Endpoint (Flask) ----------
@app.route("/compute", methods=["POST"])
def compute_metrics():
    try:
        req = request.get_json(force=True)
    except Exception:
        return make_response(jsonify({"detail": "JSON inválido no corpo da requisição."}), 400)

    # Extract fields with defaults similar ao Pydantic model original
    geometry = req.get("geometry")
    kml = req.get("kml")
    start_date = req.get("start_date")
    end_date = req.get("end_date")
    collection = req.get("collection", "SENTINEL2")
    max_biomass = req.get("max_biomass")
    timeseries = req.get("timeseries", False)
    timeseries_unit = req.get("timeseries_unit", "per_image")
    timeseries_period_days = req.get("timeseries_period_days", 10)
    max_images = req.get("max_images", 100)

    # Validate required dates
    if not start_date or not end_date:
        return make_response(jsonify({"detail": "Forneça 'start_date' e 'end_date' no formato YYYY-MM-DD."}), 400)
    try:
        datetime.fromisoformat(start_date)
        datetime.fromisoformat(end_date)
    except Exception:
        return make_response(jsonify({"detail": "Formato de data inválido. Use YYYY-MM-DD."}), 400)

    # Geometry handling
    ee_geom = None
    if geometry:
        try:
            ee_geom = geojson_to_ee_geometry(geometry)
        except ValueError as e:
            return make_response(jsonify({"detail": str(e)}), 400)
    elif kml:
        try:
            coords = kml_to_polygon_coords(kml)
            ee_geom = ee.Geometry.Polygon(coords)
        except ValueError as e:
            return make_response(jsonify({"detail": str(e)}), 400)
    else:
        return make_response(jsonify({"detail": "Forneça 'geometry' (GeoJSON) ou 'kml' (string)."}), 400)

    # pick collection
    try:
        col = select_sentinel_collection(collection)
    except ValueError as e:
        return make_response(jsonify({"detail": str(e)}), 400)

    # filter by date and bounds
    col = col.filterDate(start_date, end_date).filterBounds(ee_geom)

    # timeseries handling
    if timeseries:
        if timeseries_unit == "per_image":
            ts = per_image_timeseries(col, ee_geom, max_images=max_images or 100)
            resp = {"timeseries_mode": "per_image", **ts}
            return make_response(jsonify(resp), 200)
        else:
            days = timeseries_period_days or 10
            ts = period_timeseries(col, ee_geom, start_date, end_date, period_days=days)
            resp = {"timeseries_mode": f"{days}d_periods", "series": ts}
            return make_response(jsonify(resp), 200)

    # single composite summarizing whole period
    col = col.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
    size = col.size().getInfo()
    if size == 0:
        return make_response(jsonify({"detail": "Nenhuma imagem disponível para o período/área com filtro atual (verificar nuvens)."}), 404)

    comp = col.median()
    indices_img = calc_indices_from_image(comp)
    stats = reduce_image_over_region(indices_img, ee_geom, scale=10)
    stats_dict = stats.getInfo()

    response = {
        "image_count": size,
        "requested_period": {"start": start_date, "end": end_date},
        "metrics": stats_dict
    }

    if max_biomass is not None:
        proxy_key = "BIOMASSA_PROXY_mean"
        if proxy_key in stats_dict and stats_dict[proxy_key] is not None:
            response["BIOMASSA_EST_mean"] = stats_dict[proxy_key] * max_biomass
        else:
            response["BIOMASSA_EST_mean"] = None

    return make_response(jsonify(response), 200)

if __name__ == "__main__":
    # Em produção prefira gunicorn; aqui para dev rápido:
    app.run(host="0.0.0.0", port=8000, debug=True)
