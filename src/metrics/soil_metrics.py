from flask import Flask, request, jsonify, make_response
import ee
import os
import re
import json
from datetime import datetime
from dotenv import load_dotenv

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False

# --------------------------------------------------------
# Mesmas funções auxiliares da sua API original
# --------------------------------------------------------
def kml_to_polygon_coords(kml_text: str):
    m = re.search(r"<coordinates>(.*?)</coordinates>", kml_text, re.DOTALL | re.IGNORECASE)
    if not m:
        raise ValueError("KML não contém tag <coordinates>")
    coords_text = m.group(1).strip()
    parts = re.split(r"\s+", coords_text)
    polygon = []
    for p in parts:
        if not p.strip():
            continue
        lon, lat, *_ = p.split(",")
        polygon.append([float(lon), float(lat)])
    return [polygon]

def geojson_to_ee_geometry(geojson):
    geom_type = geojson.get("type")
    if geom_type == "Feature":
        geojson = geojson.get("geometry")
        geom_type = geojson.get("type")
    if geom_type == "Polygon":
        return ee.Geometry.Polygon(geojson["coordinates"])
    if geom_type == "MultiPolygon":
        return ee.Geometry.MultiPolygon(geojson["coordinates"])
    raise ValueError("GeoJSON deve ser Polygon/MultiPolygon.")

# --------------------------------------------------------
# OpenLandMap ARGILA – configurações
# --------------------------------------------------------
DEPTH_TO_BAND = {
    '0-5cm':     'b0',
    '5-15cm':    'b10',
    '15-30cm':   'b30',
    '30-60cm':   'b60',
    '60-100cm':  'b100',
    '100-200cm': 'b200',
}

def get_clay_image(depth_label: str) -> ee.Image:
    """Retorna imagem (%) de argila para a profundidade desejada."""
    band = DEPTH_TO_BAND[depth_label]
    return (ee.Image('OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02')
            .select(band)
            .rename('clay_pct'))

def clay_stats(image: ee.Image, region: ee.Geometry, scale: int = 250) -> dict:
    """Calcula mean/min/max de argila."""
    reducer = ee.Reducer.mean() \
              .combine(ee.Reducer.min(), sharedInputs=True) \
              .combine(ee.Reducer.max(), sharedInputs=True)

    result = image.reduceRegion(
        reducer=reducer,
        geometry=region,
        scale=scale,
        maxPixels=1e13,
        bestEffort=True
    ).getInfo()

    return {
        "CLAY_mean_%": result.get("clay_pct_mean"),
        "CLAY_min_%":  result.get("clay_pct_min"),
        "CLAY_max_%":  result.get("clay_pct_max"),
    }

# --------------------------------------------------------
# Endpoint para cálculo de argila
# --------------------------------------------------------
@app.route("/clay", methods=["POST"])
def compute_clay():
    try:
        req = request.get_json(force=True)
    except Exception:
        return make_response(jsonify({"detail": "JSON inválido no corpo da requisição."}), 400)

    geometry = req.get("geometry")
    kml = req.get("kml")

    depth = req.get("depth", "0-5cm")
    scale = req.get("scale", 250)

    # valida profundidade
    if depth not in DEPTH_TO_BAND:
        return make_response(jsonify({"detail": f"Profundidade inválida. Use uma de: {list(DEPTH_TO_BAND)}"}), 400)

    # cria geometria
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
        return make_response(jsonify({"detail": "Forneça geometry (GeoJSON) ou kml (string)."}), 400)

    # imagem alvo
    try:
        clay_img = get_clay_image(depth)
    except Exception as e:
        return make_response(jsonify({"detail": f"Erro ao selecionar banda: {e}"}), 400)

    # cálculo
    try:
        stats = clay_stats(clay_img, ee_geom, scale)
    except Exception as e:
        return make_response(jsonify({"detail": f"Erro ao calcular estatísticas: {e}"}), 500)

    response = {
        "depth": depth,
        "scale_m": scale,
        "metrics": stats,
    }

    return make_response(jsonify(response), 200)


if __name__ == "__main__":
    ee.Initialize()  # opcional se estiver separado
    app.run(host="0.0.0.0", port=8001, debug=True)
