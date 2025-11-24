from flask import Flask, jsonify, request, Blueprint
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select
from CRUD.database import SessionLocal, engine, get_db
from CRUD.models import Base, MetricasPreditivas  
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

metricas_preditivas_bp = Blueprint('metricas_preditivas_bp', __name__, url_prefix='/api/metricas_preditivas')

# ====================================================
# ROTAS DE MÉTRICAS PREDITIVAS 
# ====================================================

@metricas_preditivas_bp.route("/", methods=["GET"])
def listar_metricas_preditivas():
    """
    Lista todas as métricas preditivas
    Retorna uma lista de todas as métricas preditivas cadastradas.
    ---
    tags:
      - Métricas Preditivas
    responses:
      200:
        description: Lista de métricas preditivas retornada com sucesso.
        schema:
          type: array
          items:
            $ref: '#/definitions/MetricasPreditivas'
    """
    with SessionLocal() as db:
        metricas = db.scalars(select(MetricasPreditivas)).all()
        return jsonify([m.to_dict() for m in metricas]), 200

@metricas_preditivas_bp.route("/<int:id_pred>", methods=["GET"])
def get_metricas_preditivas(id_pred):
    """
    Retorna uma métrica preditiva pelo ID
    Busca e retorna os detalhes de uma métrica preditiva específica.
    ---
    tags:
      - Métricas Preditivas
    parameters:
      - name: id_pred
        in: path
        required: true
        type: integer
        description: ID da métrica preditiva a ser buscada.
    responses:
      200:
        description: Métrica Preditiva encontrada.
        schema:
          $ref: '#/definitions/MetricasPreditivas'
      404:
        description: Métrica Preditiva não encontrada.
    """
    with SessionLocal() as db:
        metrica = db.get(MetricasPreditivas, id_pred)
        if not metrica:
            return jsonify({"erro": "Métrica Preditiva não encontrada"}), 404
        return jsonify(metrica.to_dict()), 200

@metricas_preditivas_bp.route("/", methods=["POST"])
def criar_metricas_preditivas():
    """
    Cria uma nova métrica preditiva
    Cadastra uma nova métrica preditiva no sistema.
    ---
    tags:
      - Métricas Preditivas
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - area_id
            - modelo_utilizado
            - periodo_previsto_inicio
            - periodo_previsto_fim
          properties:
            area_id:
              type: integer
              description: ID da área à qual a métrica pertence.
            modelo_utilizado:
              type: string
              description: Nome ou identificador do modelo de predição utilizado.
            periodo_previsto_inicio:
              type: string
              format: date
              description: Data de início do período previsto (formato YYYY-MM-DD).
            periodo_previsto_fim:
              type: string
              format: date
              description: Data de fim do período previsto (formato YYYY-MM-DD).
            ndvi_mean_pred:
              type: number
              format: float
              description: Média predita do NDVI.
            # ... (outras propriedades preditivas)
    responses:
      201:
        description: Métrica Preditiva criada com sucesso.
        schema:
          $ref: '#/definitions/MetricasPreditivas'
      400:
        description: Erro na requisição, formato de data inválido ou no banco de dados.
    """
    data = request.get_json()
    with SessionLocal() as db:
        try:
            nova = MetricasPreditivas(
                area_id=data.get("area_id"),
                modelo_utilizado=data.get("modelo_utilizado"),
                periodo_previsto_inicio=date.fromisoformat(data.get("periodo_previsto_inicio")),
                periodo_previsto_fim=date.fromisoformat(data.get("periodo_previsto_fim")),
                ndvi_mean_pred=data.get("ndvi_mean_pred"),
                ndvi_median_pred=data.get("ndvi_median_pred"),
                ndvi_std_pred=data.get("ndvi_std_pred"),
                evi_mean_pred=data.get("evi_mean_pred"),
                evi_median_pred=data.get("evi_median_pred"),
                evi_std_pred=data.get("evi_std_pred"),
                ndwi_mean_pred=data.get("ndwi_mean_pred"),
                ndwi_median_pred=data.get("ndwi_median_pred"),
                ndwi_std_pred=data.get("ndwi_std_pred"),
                ndmi_mean_pred=data.get("ndmi_mean_pred"),
                ndmi_median_pred=data.get("ndmi_median_pred"),
                ndmi_std_pred=data.get("ndmi_std_pred"),
                gndvi_mean_pred=data.get("gndvi_mean_pred"),
                gndvi_median_pred=data.get("gndvi_median_pred"),
                gndvi_std_pred=data.get("gndvi_std_pred"),
                ndre_mean_pred=data.get("ndre_mean_pred"),
                ndre_median_pred=data.get("ndre_median_pred"),
                ndre_std_pred=data.get("ndre_std_pred"),
                rendvi_mean_pred=data.get("rendvi_mean_pred"),
                rendvi_median_pred=data.get("rendvi_median_pred"),
                rendvi_std_pred=data.get("rendvi_std_pred"),
                biomassa_pred=data.get("biomassa_pred"),
                cobertura_vegetal_pred=data.get("cobertura_vegetal_pred"),
                observacoes=data.get("observacoes"),
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

@metricas_preditivas_bp.route("/<int:id_pred>", methods=["PUT"])
def atualizar_metricas_preditivas(id_pred):
    """
    Atualiza uma métrica preditiva
    Atualiza os dados de uma métrica preditiva existente.
    ---
    tags:
      - Métricas Preditivas
    parameters:
      - name: id_pred
        in: path
        required: true
        type: integer
        description: ID da métrica preditiva a ser atualizada.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            area_id:
              type: integer
              description: Novo ID da área.
            modelo_utilizado:
              type: string
              description: Novo nome ou identificador do modelo de predição.
            periodo_previsto_inicio:
              type: string
              format: date
              description: Nova data de início do período previsto (formato YYYY-MM-DD).
            periodo_previsto_fim:
              type: string
              format: date
              description: Nova data de fim do período previsto (formato YYYY-MM-DD).
            ndvi_mean_pred:
              type: number
              format: float
              description: Nova média predita do NDVI.
            # ... (outras propriedades preditivas)
    responses:
      200:
        description: Métrica Preditiva atualizada com sucesso.
        schema:
          $ref: '#/definitions/MetricasPreditivas'
      404:
        description: Métrica Preditiva não encontrada.
      400:
        description: Erro na requisição, formato de data inválido ou no banco de dados.
    """
    data = request.get_json()
    with SessionLocal() as db:
        metrica = db.get(MetricasPreditivas, id_pred)
        if not metrica:
            return jsonify({"erro": "Métrica Preditiva não encontrada"}), 404

        try:
            metrica.area_id = data.get("area_id", metrica.area_id)
            metrica.modelo_utilizado = data.get("modelo_utilizado", metrica.modelo_utilizado)
            metrica.periodo_previsto_inicio = date.fromisoformat(data.get("periodo_previsto_inicio")) if data.get("periodo_previsto_inicio") else metrica.periodo_previsto_inicio
            metrica.periodo_previsto_fim = date.fromisoformat(data.get("periodo_previsto_fim")) if data.get("periodo_previsto_fim") else metrica.periodo_previsto_fim
            metrica.ndvi_mean_pred = data.get("ndvi_mean_pred", metrica.ndvi_mean_pred)
            metrica.ndvi_median_pred = data.get("ndvi_median_pred", metrica.ndvi_median_pred)
            metrica.ndvi_std_pred = data.get("ndvi_std_pred", metrica.ndvi_std_pred)
            metrica.evi_mean_pred = data.get("evi_mean_pred", metrica.evi_mean_pred)
            metrica.evi_median_pred = data.get("evi_median_pred", metrica.evi_median_pred)
            metrica.evi_std_pred = data.get("evi_std_pred", metrica.evi_std_pred)
            metrica.ndwi_mean_pred = data.get("ndwi_mean_pred", metrica.ndwi_mean_pred)
            metrica.ndwi_median_pred = data.get("ndwi_median_pred", metrica.ndwi_median_pred)
            metrica.ndwi_std_pred = data.get("ndwi_std_pred", metrica.ndwi_std_pred)
            metrica.ndmi_mean_pred = data.get("ndmi_mean_pred", metrica.ndmi_mean_pred)
            metrica.ndmi_median_pred = data.get("ndmi_median_pred", metrica.ndmi_median_pred)
            metrica.ndmi_std_pred = data.get("ndmi_std_pred", metrica.ndmi_std_pred)
            metrica.gndvi_mean_pred = data.get("gndvi_mean_pred", metrica.gndvi_mean_pred)
            metrica.gndvi_median_pred = data.get("gndvi_median_pred", metrica.gndvi_median_pred)
            metrica.gndvi_std_pred = data.get("gndvi_std_pred", metrica.gndvi_std_pred)
            metrica.ndre_mean_pred = data.get("ndre_mean_pred", metrica.ndre_mean_pred)
            metrica.ndre_median_pred = data.get("ndre_median_pred", metrica.ndre_median_pred)
            metrica.ndre_std_pred = data.get("ndre_std_pred", metrica.ndre_std_pred)
            metrica.rendvi_mean_pred = data.get("rendvi_mean_pred", metrica.rendvi_mean_pred)
            metrica.rendvi_median_pred = data.get("rendvi_median_pred", metrica.rendvi_median_pred)
            metrica.rendvi_std_pred = data.get("rendvi_std_pred", metrica.rendvi_std_pred)
            metrica.biomassa_pred = data.get("biomassa_pred", metrica.biomassa_pred)
            metrica.cobertura_vegetal_pred = data.get("cobertura_vegetal_pred", metrica.cobertura_vegetal_pred)
            metrica.observacoes = data.get("observacoes", metrica.observacoes)

            db.commit()
            db.refresh(metrica)
            return jsonify(metrica.to_dict()), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400
        except ValueError as e:
            return jsonify({"erro": f"Erro de formato de data: {e}"}), 400


@metricas_preditivas_bp.route("/<int:id_pred>", methods=["DELETE"])
def deletar_metricas_preditivas(id_pred):
    """
    Deleta uma métrica preditiva pelo ID
    Remove uma métrica preditiva do sistema.
    ---
    tags:
      - Métricas Preditivas
    parameters:
      - name: id_pred
        in: path
        required: true
        type: integer
        description: ID da métrica preditiva a ser deletada.
    responses:
      200:
        description: Métrica Preditiva removida com sucesso.
      404:
        description: Métrica Preditiva não encontrada.
      400:
        description: Erro no banco de dados.
    """
    with SessionLocal() as db:
        metrica = db.get(MetricasPreditivas, id_pred)
        if not metrica:
            return jsonify({"erro": "Métrica Preditiva não encontrada"}), 404
        try:
            db.delete(metrica)
            db.commit()
            return jsonify({"mensagem": "Métrica Preditiva removida"}), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400