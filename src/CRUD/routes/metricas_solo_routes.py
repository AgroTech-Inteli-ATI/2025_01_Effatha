from flask import Flask, jsonify, request, Blueprint
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select
from CRUD.database import SessionLocal, engine, get_db
from CRUD.models import Base, MetricasSolo
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

metricas_solo_bp = Blueprint('metricas_solo_bp', __name__, url_prefix='/api/metricas_solo')

# ====================================================
# ROTAS DE MÉTRICAS DO SOLO
# ====================================================


@metricas_solo_bp.route("/", methods=["GET"])
def listar_metricas_solo():
    """
    Lista todas as métricas de solo
    Retorna uma lista de todas as métricas de solo cadastradas.
    ---
    tags:
      - Métricas Solo
    responses:
      200:
        description: Lista de métricas de solo retornada com sucesso.
        schema:
          type: array
          items:
            $ref: '#/definitions/MetricasSolo'
    """
    with SessionLocal() as db:
        metricas = db.scalars(select(MetricasSolo)).all()
        return jsonify([m.to_dict() for m in metricas]), 200


@metricas_solo_bp.route("/<int:id_ms>", methods=["GET"])
def get_metricas_solo(id_ms):
    """
    Retorna uma métrica de solo pelo ID
    Busca e retorna os detalhes de uma métrica de solo específica.
    ---
    tags:
      - Métricas Solo
    parameters:
      - name: id_ms
        in: path
        required: true
        type: integer
        description: ID da métrica de solo a ser buscada.
    responses:
      200:
        description: Métrica de solo encontrada.
        schema:
          $ref: '#/definitions/MetricasSolo'
      404:
        description: Métrica de solo não encontrada.
    """
    with SessionLocal() as db:
        metrica = db.get(MetricasSolo, id_ms)
        if not metrica:
            return jsonify({"erro": "Métrica de solo não encontrada"}), 404
        return jsonify(metrica.to_dict()), 200


@metricas_solo_bp.route("/", methods=["POST"])
def criar_metricas_solo():
    """
    Cria uma nova métrica de solo
    Cadastra uma nova métrica do solo no sistema, associada a uma área.
    ---
    tags:
      - Métricas Solo
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - area_id
            - periodo_inicio
            - periodo_fim
          properties:
            area_id:
              type: integer
              description: ID da área à qual a métrica pertence.
            periodo_inicio:
              type: string
              format: date
              description: Data de início do período (formato YYYY-MM-DD).
            periodo_fim:
              type: string
              format: date
              description: Data de fim do período (formato YYYY-MM-DD).
            clay_mean:
              type: number
              format: float
              description: Média de teor de argila.
            clay_min:
              type: number
              format: float
              description: Mínimo do teor de argila.
            clay_max:
              type: number
              format: float
              description: Máximo do teor de argila.
    responses:
      201:
        description: Métrica de solo criada com sucesso.
        schema:
          $ref: '#/definitions/MetricasSolo'
      400:
        description: Erro na requisição, formato de data inválido ou no banco de dados.
    """
    data = request.get_json()
    with SessionLocal() as db:
        try:
            nova = MetricasSolo(
                area_id=data.get("area_id"),
                periodo_inicio=date.fromisoformat(data.get("periodo_inicio")),
                periodo_fim=date.fromisoformat(data.get("periodo_fim")),
                clay_mean=data.get("clay_mean"),
                clay_min=data.get("clay_min"),
                clay_max=data.get("clay_max"),
            )
            db.add(nova)
            db.commit()
            db.refresh(nova)
            return jsonify(nova.to_dict()), 201
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400
        except ValueError as e:
            return jsonify({"erro": f"Erro de formato de data: {e}"}), 400


@metricas_solo_bp.route("/<int:id_ms>", methods=["PUT"])
def atualizar_metricas_solo(id_ms):
    """
    Atualiza uma métrica de solo
    Atualiza os dados de uma métrica de solo existente.
    ---
    tags:
      - Métricas Solo
    parameters:
      - name: id_ms
        in: path
        required: true
        type: integer
        description: ID da métrica de solo a ser atualizada.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            area_id:
              type: integer
            periodo_inicio:
              type: string
              format: date
            periodo_fim:
              type: string
              format: date
            clay_mean:
              type: number
              format: float
            clay_min:
              type: number
              format: float
            clay_max:
              type: number
              format: float
    responses:
      200:
        description: Métrica de solo atualizada com sucesso.
        schema:
          $ref: '#/definitions/MetricasSolo'
      404:
        description: Métrica de solo não encontrada.
      400:
        description: Erro na requisição, formato de data inválido ou no banco de dados.
    """
    data = request.get_json()
    with SessionLocal() as db:
        metrica = db.get(MetricasSolo, id_ms)
        if not metrica:
            return jsonify({"erro": "Métrica de solo não encontrada"}), 404

        try:
            metrica.area_id = data.get("area_id", metrica.area_id)
            metrica.periodo_inicio = date.fromisoformat(data.get("periodo_inicio")) if data.get("periodo_inicio") else metrica.periodo_inicio
            metrica.periodo_fim = date.fromisoformat(data.get("periodo_fim")) if data.get("periodo_fim") else metrica.periodo_fim
            metrica.clay_mean = data.get("clay_mean", metrica.clay_mean)
            metrica.clay_min = data.get("clay_min", metrica.clay_min)
            metrica.clay_max = data.get("clay_max", metrica.clay_max)

            db.commit()
            db.refresh(metrica)
            return jsonify(metrica.to_dict()), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400
        except ValueError as e:
            return jsonify({"erro": f"Erro de formato de data: {e}"}), 400


@metricas_solo_bp.route("/<int:id_ms>", methods=["DELETE"])
def deletar_metricas_solo(id_ms):
    """
    Deleta uma métrica de solo pelo ID
    Remove uma métrica de solo do sistema.
    ---
    tags:
      - Métricas Solo
    parameters:
      - name: id_ms
        in: path
        required: true
        type: integer
        description: ID da métrica de solo a ser deletada.
    responses:
      200:
        description: Métrica de solo removida com sucesso.
      404:
        description: Métrica de solo não encontrada.
      400:
        description: Erro no banco de dados.
    """
    with SessionLocal() as db:
        metrica = db.get(MetricasSolo, id_ms)
        if not metrica:
            return jsonify({"erro": "Métrica de solo não encontrada"}), 404
        try:
            db.delete(metrica)
            db.commit()
            return jsonify({"mensagem": "Métrica de solo removida"}), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400
