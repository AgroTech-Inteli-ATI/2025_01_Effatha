# src/CRUD/services/metrics_manager.py
from datetime import datetime, timedelta, date
from typing import List, Dict, Any, Optional
import requests

from CRUD.database import SessionLocal
from CRUD.models import Area, Metricas, MetricasSolo
from sqlalchemy import and_

# URL do endpoint local que implementa o cálculo (ajuste se necessário)
COMPUTE_URL = "http://127.0.0.1:8000/compute"
# URL do endpoint de métricas de solo (clay)
CLAY_URL = "http://127.0.0.1:8001/clay"
# timeout para requests (segundos) — ajuste de acordo com sua infra
REQUEST_TIMEOUT = 120

# profundidades que o serviço clay suporta — ordem fixa
SOIL_DEPTHS = ["0-5cm", "5-15cm", "15-30cm", "30-60cm", "60-100cm", "100-200cm"]

# mapeamento depth -> prefix de coluna no DB (prefix usado nas colunas do modelo)
DEPTH_TO_COL_PREFIX = {
    "0-5cm": "clay_0_5",
    "5-15cm": "clay_5_15",
    "15-30cm": "clay_15_30",
    "30-60cm": "clay_30_60",
    "60-100cm": "clay_60_100",
    "100-200cm": "clay_100_200",
}

def _chunks_from_range(start_date: date, end_date: date, period_days: int) -> List[Dict[str, date]]:
    chunks = []
    cur = start_date
    while cur <= end_date:
        next_dt = cur + timedelta(days=period_days)
        period_end = min(end_date, next_dt - timedelta(days=1))
        chunks.append({"start": cur, "end": period_end})
        cur = next_dt
    return chunks

def _metrics_from_compute_response(resp_json: Dict[str, Any]) -> Dict[str, Any]:
    stats = resp_json.get("metrics") or {}
    def _safe_float(v):
        try:
            return float(v) if v is not None else None
        except Exception:
            return None

    mapping = {
        "ndvi_mean": ["NDVI_mean"],
        "ndvi_median": ["NDVI_median"],
        "ndvi_std": ["NDVI_stdDev"],
        "evi_mean": ["EVI_mean"],
        "evi_median": ["EVI_median"],
        "evi_std": ["EVI_stdDev"],
        "ndwi_mean": ["NDWI_mean"],
        "ndwi_median": ["NDWI_median"],
        "ndwi_std": ["NDWI_stdDev"],
        "ndmi_mean": ["NDMI_mean"],
        "ndmi_median": ["NDMI_median"],
        "ndmi_std": ["NDMI_stdDev"],
        "gndvi_mean": ["GNDVI_mean"],
        "gndvi_median": ["GNDVI_median"],
        "gndvi_std": ["GNDVI_stdDev"],
        "ndre_mean": ["NDRE_mean"],
        "ndre_median": ["NDRE_median"],
        "ndre_std": ["NDRE_stdDev"],
        "rendvi_mean": ["RENDVI_mean"],
        "rendvi_median": ["RENDVI_median"],
        "rendvi_std": ["RENDVI_stdDev"],
        "biomassa": ["BIOMASSA_PROXY_mean", "BIOMASSA_PROXY"],
        "cobertura_vegetal": []
    }

    out = {}
    for dest, possible_keys in mapping.items():
        val = None
        for k in possible_keys:
            if k in stats and stats[k] is not None:
                val = _safe_float(stats[k])
                break
        out[dest] = val
    return out

def _call_clay_api(geometry: Any, depth: str = "0-5cm", scale: int = 250, soil_url: str = CLAY_URL, timeout: int = REQUEST_TIMEOUT) -> Dict[str, Optional[float]]:
    """
    Chama o endpoint /clay para obter métricas de argila para UMA profundidade.
    Retorna dicionário com keys: clay_mean, clay_min, clay_max (float ou None)
    """

    if not soil_url:
        soil_url = CLAY_URL

    payload = {
        "geometry": geometry,
        "depth": depth,
        "scale": scale
    }
    r = requests.post(soil_url, json=payload, timeout=timeout)
    if r.status_code != 200:
        raise RuntimeError(f"Clay API retornou status {r.status_code}: {r.text}")
    resp_json = r.json()
    metrics = resp_json.get("metrics", {})

    def _safe_float(v):
        try:
            return float(v) if v is not None else None
        except Exception:
            return None

    # suporte a chaves diferentes que o service pode retornar
    # preferimos CLAY_mean_% mas aceitamos clay_pct_mean
    clay_mean = _safe_float(metrics.get("CLAY_mean_%") if "CLAY_mean_%" in metrics else metrics.get("clay_pct_mean") or metrics.get("clay_mean"))
    clay_min  = _safe_float(metrics.get("CLAY_min_%")  if "CLAY_min_%" in metrics else metrics.get("clay_pct_min") or metrics.get("clay_min"))
    clay_max  = _safe_float(metrics.get("CLAY_max_%")  if "CLAY_max_%" in metrics else metrics.get("clay_pct_max") or metrics.get("clay_max"))

    return {
        "clay_mean": clay_mean,
        "clay_min": clay_min,
        "clay_max": clay_max
    }

def fill_missing_periodic_metrics(area_id: int, start_date_str: str, end_date_str: str, period_days: int = 10,
                                  collection: str = "SENTINEL2", cloudy_threshold: int = 70,
                                  include_soil_metrics: bool = False, soil_depth: str = "0-5cm",
                                  soil_scale: int = 250, soil_url: str = CLAY_URL) -> Dict[str, Any]:
    start_date_py = datetime.fromisoformat(start_date_str).date()
    end_date_py = datetime.fromisoformat(end_date_str).date()
    if start_date_py > end_date_py:
        raise ValueError("start_date maior que end_date")
    
    soil_url = soil_url or CLAY_URL

    chunks = _chunks_from_range(start_date_py, end_date_py, period_days)

    result = {
        "requested_chunks": len(chunks),
        "inserted_metricas": [],
        "already_exists_metricas": [],
        "inserted_solo": [],
        "already_exists_solo": [],
        "errors": []
    }

    # available columns for Metricas (existing logic)
    try:
        available_cols = set(Metricas.__table__.columns.keys())
    except Exception:
        available_cols = {
            "ndvi_mean", "ndvi_median", "ndvi_std",
            "evi_mean", "evi_median", "evi_std",
            "ndwi_mean", "ndwi_median", "ndwi_std",
            "ndmi_mean", "ndmi_median", "ndmi_std",
            "gndvi_mean", "gndvi_median", "gndvi_std",
            "ndre_mean", "ndre_median", "ndre_std",
            "rendvi_mean", "rendvi_median", "rendvi_std",
            "biomassa", "cobertura_vegetal",
        }

    # detect available columns on MetricasSolo to avoid inserting non-existent columns
    try:
        available_solo_cols = set(MetricasSolo.__table__.columns.keys())
    except Exception:
        # conservative fallback: include the new clay_* columns if you already changed the model
        available_solo_cols = set()
        for prefix in DEPTH_TO_COL_PREFIX.values():
            available_solo_cols.update({
                f"{prefix}_mean", f"{prefix}_min", f"{prefix}_max"
            })

    with SessionLocal() as db:
        area = db.get(Area, area_id)
        if not area:
            raise ValueError(f"Area id={area_id} não encontrada.")

        geometry = area.coordenada

        for ch in chunks:
            s = ch["start"]
            e = ch["end"]

            # verifica existência nas metricas de vegetação
            exists = db.query(Metricas).filter(
                and_(Metricas.area_id == area_id,
                     Metricas.periodo_inicio == s,
                     Metricas.periodo_fim == e)
            ).first()
            if exists:
                result["already_exists_metricas"].append({"start": str(s), "end": str(e), "id": exists.id})
                continue

            # chama compute para métricas de satélite
            payload = {
                "geometry": geometry,
                "start_date": s.isoformat(),
                "end_date": e.isoformat(),
                "collection": collection,
                "timeseries": False,
            }
            try:
                r = requests.post(COMPUTE_URL, json=payload, timeout=REQUEST_TIMEOUT)
                if r.status_code != 200:
                    result["errors"].append({"start": str(s), "end": str(e), "status_code": r.status_code, "body": r.text})
                    continue
                resp_json = r.json()
            except Exception as exc:
                result["errors"].append({"start": str(s), "end": str(e), "error": str(exc)})
                continue

            metric_values = _metrics_from_compute_response(resp_json)

            # prepare insert kwargs for Metricas (only columns present)
            insert_kwargs: Dict[str, Any] = {"area_id": area_id, "periodo_inicio": s, "periodo_fim": e}
            for k, v in metric_values.items():
                if k in available_cols:
                    insert_kwargs[k] = v

            # create Metricas entry
            try:
                nova = Metricas(**insert_kwargs)
                db.add(nova)
                db.commit()
                db.refresh(nova)
                result["inserted_metricas"].append({"start": str(s), "end": str(e), "id": nova.id})
            except Exception as exc:
                db.rollback()
                result["errors"].append({"start": str(s), "end": str(e), "error": str(exc), "insert_kwargs": insert_kwargs})
                continue

            # if requested, collect soil metrics for ALL depths and insert a single MetricasSolo row (if not exists)
            if include_soil_metrics:
                soil_aggregated: Dict[str, Dict[str, Optional[float]]] = {}
                for depth in SOIL_DEPTHS:
                    try:
                        v = _call_clay_api(geometry=geometry, depth=depth, scale=soil_scale, soil_url=soil_url, timeout=REQUEST_TIMEOUT)
                        soil_aggregated[depth] = v
                    except Exception as exc:
                        # register error and continue collecting other depths
                        result["errors"].append({"start": str(s), "end": str(e), "depth": depth, "soil_error": str(exc)})
                        soil_aggregated[depth] = {"clay_mean": None, "clay_min": None, "clay_max": None}

                # only create MetricasSolo if not exists
                try:
                    exists_solo = db.query(MetricasSolo).filter(
                        and_(MetricasSolo.area_id == area_id,
                             MetricasSolo.periodo_inicio == s,
                             MetricasSolo.periodo_fim == e)
                    ).first()
                    if exists_solo:
                        result["already_exists_solo"].append({"start": str(s), "end": str(e), "id": exists_solo.id})
                    else:
                        # build solo_kwargs including only columns present in the model
                        solo_kwargs: Dict[str, Any] = {"area_id": area_id, "periodo_inicio": s, "periodo_fim": e}
                        for depth, vals in soil_aggregated.items():
                            prefix = DEPTH_TO_COL_PREFIX.get(depth)
                            if not prefix:
                                continue
                            # map mean/min/max into columns like clay_0_5_mean etc.
                            column_mean = f"{prefix}_mean"
                            column_min = f"{prefix}_min"
                            column_max = f"{prefix}_max"
                            if column_mean in available_solo_cols:
                                solo_kwargs[column_mean] = vals.get("clay_mean")
                            if column_min in available_solo_cols:
                                solo_kwargs[column_min] = vals.get("clay_min")
                            if column_max in available_solo_cols:
                                solo_kwargs[column_max] = vals.get("clay_max")

                        solo = MetricasSolo(**solo_kwargs)
                        db.add(solo)
                        db.commit()
                        db.refresh(solo)
                        result["inserted_solo"].append({"start": str(s), "end": str(e), "id": solo.id})
                except Exception as exc:
                    db.rollback()
                    result["errors"].append({"start": str(s), "end": str(e), "soil_insert_error": str(exc)})
    return result
