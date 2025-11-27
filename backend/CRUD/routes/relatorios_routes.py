# backend/CRUD/routes/relatorio_routes.py
from flask import Blueprint, jsonify, request
from sqlalchemy import select
from CRUD.database import SessionLocal
from CRUD.models import Relatorio, Area
from CRUD.services.metrics_manager import fill_missing_periodic_metrics
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

relatorios_bp = Blueprint("relatorio_bp", __name__, url_prefix="/api/relatorios")


@relatorios_bp.route("/", methods=["GET"])
def listar_relatorios():
    with SessionLocal() as db:
        rels = db.scalars(select(Relatorio)).all()
        return jsonify([r.to_dict() for r in rels]), 200


@relatorios_bp.route("/<int:id_relatorio>", methods=["GET"])
def get_relatorio(id_relatorio):
    with SessionLocal() as db:
        r = db.get(Relatorio, id_relatorio)
        if not r:
            return jsonify({"erro": "Relatório não encontrado"}), 404
        return jsonify(r.to_dict()), 200


@relatorios_bp.route("/", methods=["POST"])
def criar_relatorio():
    """
    Cria um Relatório e, síncronamente, executa a coleta de métricas (incluindo todas as faixas de solo).
    Espera no body:
      - area_id (int) - obrigatório
      - periodo_inicio (YYYY-MM-DD) - obrigatório
      - periodo_fim (YYYY-MM-DD) - obrigatório
      - period_days (int) opcional (default 10)
      - collection (str) opcional
      - soil_scale (int) opcional
      - soil_url (str) opcional
    Observação: include_soil_metrics será FORÇADO para True (coleta todas as faixas).
    """
    data = request.get_json() or {}
    try:
        area_id = int(data.get("area_id"))
        periodo_inicio = data.get("periodo_inicio")
        periodo_fim = data.get("periodo_fim")
        if not (periodo_inicio and periodo_fim):
            return jsonify({"erro": "periodo_inicio e periodo_fim são obrigatórios (YYYY-MM-DD)"}), 400

        period_days = int(data.get("period_days", 10))
        collection = data.get("collection", "SENTINEL2")
        soil_scale = int(data.get("soil_scale", 250)) if data.get("soil_scale") is not None else None
        soil_url = data.get("soil_url") if data.get("soil_url") else None
        nome = data.get("nome")

    except (ValueError, TypeError) as e:
        return jsonify({"erro": f"Parâmetros inválidos: {e}"}), 400

    with SessionLocal() as db:
        # valida área
        area = db.get(Area, area_id)
        if not area:
            return jsonify({"erro": "Area não encontrada"}), 404

        # cria registro de relatório com status initial 'running'
        try:
            rel = Relatorio(
                area_id=area_id,
                nome=nome,
                periodo_inicio=periodo_inicio,
                periodo_fim=periodo_fim,
                period_days=period_days,
                collection=collection,
                include_soil_metrics=True,  # FORÇADO: coletemos todas as faixas de solo
                soil_depth=None,
                soil_scale=soil_scale,
                soil_url=soil_url,
                status="running",
                started_at=datetime.utcnow(),
            )
            db.add(rel)
            db.commit()
            db.refresh(rel)
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": f"Erro ao criar relatório: {str(e)}"}), 500

        # ---------- execução síncrona: coleta/insere métricas ----------
        try:
            summary = fill_missing_periodic_metrics(
                area_id=area_id,
                start_date_str=str(periodo_inicio),
                end_date_str=str(periodo_fim),
                period_days=period_days,
                collection=collection,
                include_soil_metrics=True,
                soil_depth=None,
                soil_scale=soil_scale if soil_scale is not None else 250,
                soil_url=soil_url,
            )
            # atualiza relatorio com resultado
            rel.status = "done" if not summary.get("errors") else "done_with_errors"
            rel.results = summary
            rel.finished_at = datetime.utcnow()
            db.add(rel)
            db.commit()
            db.refresh(rel)
            return jsonify({"relatorio": rel.to_dict(), "summary": summary}), 201

        except Exception as exc:
            # marca como failed e grava o erro no campo results
            db.rollback()
            try:
                rel.status = "failed"
                rel.results = {"error": str(exc)}
                rel.finished_at = datetime.utcnow()
                db.add(rel)
                db.commit()
            except Exception:
                db.rollback()
            return jsonify({"erro": f"Erro durante coleta de métricas: {str(exc)}"}), 500
