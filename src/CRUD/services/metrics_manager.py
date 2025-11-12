# src/CRUD/services/metrics_manager.py
from datetime import datetime, timedelta, date
from typing import List, Dict, Any
import requests

from CRUD.database import SessionLocal
from CRUD.models import Area, Metricas
from sqlalchemy import and_

# URL do endpoint local que implementa o cálculo (ajuste se necessário)
COMPUTE_URL = "http://127.0.0.1:8000/compute"
# timeout para requests (segundos) — ajuste de acordo com sua infra
REQUEST_TIMEOUT = 120

def _chunks_from_range(start_date: date, end_date: date, period_days: int) -> List[Dict[str, date]]:
    """
    Gera janelas [periodo_inicio, periodo_fim] (inclusive) cobrindo o intervalo pedido.
    Cada janela tem `period_days` dias, a última janela pode ser menor.
    """
    chunks = []
    cur = start_date
    while cur <= end_date:
        next_dt = cur + timedelta(days=period_days)  # exclusive upper bound
        period_end = min(end_date, next_dt - timedelta(days=1))
        chunks.append({"start": cur, "end": period_end})
        cur = next_dt
    return chunks

def _metrics_from_compute_response(resp_json: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforma os valores do compute() (ex.: keys 'NDVI_mean') em dict
    com chaves compatíveis com o seu modelo Metricas (ex.: ndvi_mean).
    Faz conversões seguras para float ou None.
    """
    stats = resp_json.get("metrics") or {}
    def _safe_float(v):
        try:
            return float(v) if v is not None else None
        except Exception:
            return None

    mapping = {
        "ndvi_mean": ["NDVI_mean"],
        "ndvi_median": ["NDVI_median"],
        "ndvi_std": ["NDVI_stdDev"],  # observe: ee.Reducer.stdDev() -> key pode terminar com '_stdDev' or 'NDVI_stdDev'
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
        "biomassa": ["BIOMASSA_PROXY_mean", "BIOMASSA_PROXY"],  # tente keys possíveis
        "cobertura_vegetal": []  # placeholder —/ se existir um indicador, mapeie aqui
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

def fill_missing_periodic_metrics(area_id: int, start_date_str: str, end_date_str: str, period_days: int = 10,
                                  collection: str = "SENTINEL2", cloudy_threshold: int = 70) -> Dict[str, Any]:
    """
    - Checa no banco quais janelas (period_days) já existem para a area_id.
    - Para janelas faltantes, chama o endpoint /compute para obter métricas e insere
      um registro em Metricas para cada janela preenchida.
    - Retorna um resumo (inseridos, existentes, erros).
    """
    # parse dates
    start_date_py = datetime.fromisoformat(start_date_str).date()
    end_date_py = datetime.fromisoformat(end_date_str).date()
    if start_date_py > end_date_py:
        raise ValueError("start_date maior que end_date")

    chunks = _chunks_from_range(start_date_py, end_date_py, period_days)

    result = {"requested_chunks": len(chunks), "inserted": [], "already_exists": [], "errors": []}

    with SessionLocal() as db:
        area = db.get(Area, area_id)
        if not area:
            raise ValueError(f"Area id={area_id} não encontrada.")

        geometry = area.coordenada  # assume GeoJSON compatível

        for ch in chunks:
            s = ch["start"]
            e = ch["end"]

            # verifica existência: busca linha com mesmo area_id e mesmo periodo_inicio/fim
            exists = db.query(Metricas).filter(
                and_(Metricas.area_id == area_id,
                     Metricas.periodo_inicio == s,
                     Metricas.periodo_fim == e)
            ).first()
            if exists:
                result["already_exists"].append({"start": str(s), "end": str(e), "id": exists.id})
                continue

            # chama endpoint compute para essa janela (modo period)
            payload = {
                "geometry": geometry,
                "start_date": s.isoformat(),
                "end_date": e.isoformat(),
                "collection": collection,
                "timeseries": False,   # pedimos composito do período
            }
            try:
                r = requests.post(COMPUTE_URL, json=payload, timeout=REQUEST_TIMEOUT)
                if r.status_code != 200:
                    result["errors"].append({
                        "start": str(s), "end": str(e),
                        "status_code": r.status_code, "body": r.text
                    })
                    continue
                resp_json = r.json()
            except Exception as exc:
                result["errors"].append({"start": str(s), "end": str(e), "error": str(exc)})
                continue

            # extrai métricas do retorno
            metric_values = _metrics_from_compute_response(resp_json)

            # cria entrada no banco
            try:
                nova = Metricas(
                    area_id=area_id,
                    periodo_inicio=s,
                    periodo_fim=e,
                    ndvi_mean=metric_values.get("ndvi_mean"),
                    ndvi_median=metric_values.get("ndvi_median"),
                    ndvi_std=metric_values.get("ndvi_std"),
                    evi_mean=metric_values.get("evi_mean"),
                    evi_median=metric_values.get("evi_median"),
                    evi_std=metric_values.get("evi_std"),
                    ndwi_mean=metric_values.get("ndwi_mean"),
                    ndwi_median=metric_values.get("ndwi_median"),
                    ndwi_std=metric_values.get("ndwi_std"),
                    ndmi_mean=metric_values.get("ndmi_mean"),
                    ndmi_median=metric_values.get("ndmi_median"),
                    ndmi_std=metric_values.get("ndmi_std"),
                    gndvi_mean=metric_values.get("gndvi_mean"),
                    gndvi_median=metric_values.get("gndvi_median"),
                    gndvi_std=metric_values.get("gndvi_std"),
                    ndre_mean=metric_values.get("ndre_mean"),
                    ndre_median=metric_values.get("ndre_median"),
                    ndre_std=metric_values.get("ndre_std"),
                    rendvi_mean=metric_values.get("rendvi_mean"),
                    rendvi_median=metric_values.get("rendvi_median"),
                    rendvi_std=metric_values.get("rendvi_std"),
                    biomassa=metric_values.get("biomassa"),
                    cobertura_vegetal=metric_values.get("cobertura_vegetal"),
                )
                db.add(nova)
                db.commit()
                db.refresh(nova)
                result["inserted"].append({"start": str(s), "end": str(e), "id": nova.id})
            except Exception as exc:
                db.rollback()
                result["errors"].append({"start": str(s), "end": str(e), "error": str(exc)})

    return result
