# backend/CRUD/routes/area_routes.py
from flask import Flask, jsonify, request, Blueprint
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from CRUD.database import SessionLocal, engine, get_db
from CRUD.models import Base, Area, Metricas
from sqlalchemy.exc import SQLAlchemyError
from datetime import date, timedelta

# import do manager para gerar métricas (usa o mesmo que metricas_routes / services)
from CRUD.services.metrics_manager import fill_missing_periodic_metrics

area_bp = Blueprint('area_bp', __name__, url_prefix='/api/area')

# ====================================================
# ROTAS DE ÁREA 
# ====================================================

@area_bp.route("/", methods=["GET"])
def listar_areas():
    """
    Lista todas as áreas
    ---
    tags:
      - Área
    responses:
      200:
        description: Lista de áreas retornada com sucesso.
    """
    with SessionLocal() as db:
        areas = db.scalars(select(Area)).all()
        return jsonify([a.to_dict() for a in areas]), 200

@area_bp.route("/<int:id_area>", methods=["GET"])
def get_area(id_area):
    """
    Retorna uma área pelo ID
    ---
    tags:
      - Área
    parameters:
      - name: id_area
        in: path
        required: true
    """
    with SessionLocal() as db:
        area = db.get(Area, id_area)
        if not area:
            return jsonify({"erro": "Área não encontrada"}), 404
        return jsonify(area.to_dict()), 200


@area_bp.route("/", methods=["POST"])
def criar_area():
    """
    Cria uma nova área
    ---
    tags:
      - Área
    """
    data = request.get_json()
    with SessionLocal() as db:
        try:
            nova = Area(
                propriedade_id=data.get("propriedade_id"),
                coordenada=data.get("coordenada"),
                municipio=data.get("municipio"),
                estado=data.get("estado"),
                nome_area=data.get("nome_area"),
                cultura_principal=data.get("cultura_principal"),
                imagens=data.get("imagens"),
                observacoes=data.get("observacoes"),
            )
            db.add(nova)
            db.commit()
            db.refresh(nova)
            return jsonify(nova.to_dict()), 201
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400

@area_bp.route("/<int:id_area>", methods=["PUT"])
def atualizar_area(id_area):
    """
    Atualiza uma área
    ---
    tags:
      - Área
    """
    data = request.get_json()
    with SessionLocal() as db:
        area = db.get(Area, id_area)
        if not area:
            return jsonify({"erro": "Área não encontrada"}), 404

        area.propriedade_id = data.get("propriedade_id", area.propriedade_id)
        area.coordenada = data.get("coordenada", area.coordenada)
        area.municipio = data.get("municipio", area.municipio)
        area.estado = data.get("estado", area.estado)
        area.nome_area = data.get("nome_area", area.nome_area)
        area.cultura_principal = data.get("cultura_principal", area.cultura_principal)
        area.imagens = data.get("imagens", area.imagens)
        area.observacoes = data.get("observacoes", area.observacoes)

        try:
            db.commit()
            db.refresh(area)
            return jsonify(area.to_dict()), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400


@area_bp.route("/<int:id_area>", methods=["DELETE"])
def deletar_area(id_area):
    """
    Deleta uma área pelo ID
    ---
    tags:
      - Área
    """
    with SessionLocal() as db:
        area = db.get(Area, id_area)
        if not area:
            return jsonify({"erro": "Área não encontrada"}), 404
        try:
            db.delete(area)
            db.commit()
            return jsonify({"mensagem": "Área removida"}), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400


# ---------------------------
# Endpoint novo: métricas por área
# ---------------------------
@area_bp.route("/<int:area_id>/metrics", methods=["GET"])
def area_metrics(area_id: int):
    """
    Retorna métricas agregadas (timeseries) para a área.
    Query params:
      - days (int, opcional, default 30): intervalo a partir de hoje (days dias)
      - generate (bool, opcional, default false): se true chama fill_missing_periodic_metrics antes de retornar
      - period_days (int, opcional, default 10): janela usada pelo generator
    ---
    tags:
      - Área
    """
    # parse params
    try:
        days = int(request.args.get("days", "30"))
    except Exception:
        days = 30
    generate = request.args.get("generate", "false").lower() in ("1", "true", "t", "yes")
    try:
        period_days = int(request.args.get("period_days", "10"))
    except Exception:
        period_days = 10

    end_dt = date.today()
    start_dt = end_dt - timedelta(days=max(0, days - 1))

    # if generate requested, call the manager (synchronously)
    if generate:
        try:
            # note: may take long — in production prefer async job queue
            fill_missing_periodic_metrics(
                area_id=area_id,
                start_date_str=start_dt.isoformat(),
                end_date_str=end_dt.isoformat(),
                period_days=period_days
            )
        except Exception as exc:
            return jsonify({"erro": "Erro ao gerar métricas: " + str(exc)}), 500

    # now query Metricas for the given range and return timeseries
    try:
        with SessionLocal() as db:
            q = db.query(Metricas).filter(
                and_(
                    Metricas.area_id == area_id,
                    Metricas.periodo_inicio >= start_dt,
                    Metricas.periodo_fim <= end_dt,
                )
            ).order_by(Metricas.periodo_inicio)
            rows = q.all()

            def _safe(v):
                try:
                    return float(v) if v is not None else None
                except Exception:
                    return None

            out = {
                "ndvi": [],
                "evi": [],
                "ndwi": [],
                "ndmi": [],
                "gndvi": [],
                "ndre": [],
                "rendvi": [],
                "biomassa": [],
                "cobertura_vegetal": []
            }

            for r in rows:
                ts = r.periodo_inicio.isoformat()
                out["ndvi"].append({"date": ts, "value": _safe(r.ndvi_mean)})
                out["evi"].append({"date": ts, "value": _safe(r.evi_mean)})
                out["ndwi"].append({"date": ts, "value": _safe(r.ndwi_mean)})
                out["ndmi"].append({"date": ts, "value": _safe(r.ndmi_mean)})
                out["gndvi"].append({"date": ts, "value": _safe(r.gndvi_mean)})
                out["ndre"].append({"date": ts, "value": _safe(r.ndre_mean)})
                out["rendvi"].append({"date": ts, "value": _safe(r.rendvi_mean)})
                out["biomassa"].append({"date": ts, "value": _safe(r.biomassa)})
                out["cobertura_vegetal"].append({"date": ts, "value": _safe(r.cobertura_vegetal)})

            return jsonify(out), 200
    except SQLAlchemyError as exc:
        return jsonify({"erro": str(exc)}), 500
