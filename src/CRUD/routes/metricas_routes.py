from flask import Flask, jsonify, request, Blueprint
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select
from CRUD.database import SessionLocal, engine, get_db
from CRUD.models import Base, Metricas  
from CRUD.services.metrics_manager import fill_missing_periodic_metrics
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

metricas_bp = Blueprint('metricas_bp', __name__, url_prefix='/api/metricas')

# ====================================================
# ROTAS DE MÉTRICAS 
# ====================================================

@metricas_bp.route("/", methods=["GET"])
def listar_metricas():
    """
    Lista todas as métricas
    Retorna uma lista de todas as métricas cadastradas.
    ---
    tags:
      - Métricas
    responses:
      200:
        description: Lista de métricas retornada com sucesso.
        schema:
          type: array
          items:
            $ref: '#/definitions/Metricas'
    """
    with SessionLocal() as db:
        metricas = db.scalars(select(Metricas)).all()
        return jsonify([m.to_dict() for m in metricas]), 200

@metricas_bp.route("/<int:id_metricas>", methods=["GET"])
def get_metricas(id_metricas):
    """
    Retorna uma métrica pelo ID
    Busca e retorna os detalhes de uma métrica específica.
    ---
    tags:
      - Métricas
    parameters:
      - name: id_metricas
        in: path
        required: true
        type: integer
        description: ID da métrica a ser buscada.
    responses:
      200:
        description: Métrica encontrada.
        schema:
          $ref: '#/definitions/Metricas'
      404:
        description: Métrica não encontrada.
    """
    with SessionLocal() as db:
        metrica = db.get(Metricas, id_metricas)
        if not metrica:
            return jsonify({"erro": "Métrica não encontrada"}), 404
        return jsonify(metrica.to_dict()), 200

@metricas_bp.route("/", methods=["POST"])
def criar_metricas():
    """
    Cria uma nova métrica
    Cadastra uma nova métrica no sistema, associada a uma área.
    ---
    tags:
      - Métricas
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - area_id
            - data_coleta
          properties:
            area_id:
              type: integer
              description: ID da área à qual a métrica pertence.
            data_coleta:
              type: string
              format: date
              description: Data da coleta da métrica (formato YYYY-MM-DD).
            ndvi_mean:
              type: number
              format: float
              description: Média do NDVI.
            ndvi_median:
              type: number
              format: float
              description: Mediana do NDVI.
            ndvi_std:
              type: number
              format: float
              description: Desvio padrão do NDVI.
            evi_mean:
              type: number
              format: float
              description: Média do EVI.
            evi_median:
              type: number
              format: float
              description: Mediana do EVI.
            evi_std:
              type: number
              format: float
              description: Desvio padrão do EVI.
            ndwi_mean:
              type: number
              format: float
              description: Média do NDWI.
            ndwi_median:
              type: number
              format: float
              description: Mediana do NDWI.
            ndwi_std:
              type: number
              format: float
              description: Desvio padrão do NDWI.
            ndmi_mean:
              type: number
              format: float
              description: Média do NDMI.
            ndmi_median:
              type: number
              format: float
              description: Mediana do NDMI.
            ndmi_std:
              type: number
              format: float
              description: Desvio padrão do NDMI.
            gndvi_mean:
              type: number
              format: float
              description: Média do GNDVI.
            gndvi_median:
              type: number
              format: float
              description: Mediana do GNDVI.
            gndvi_std:
              type: number
              format: float
              description: Desvio padrão do GNDVI.
            ndre_mean:
              type: number
              format: float
              description: Média do NDRE.
            ndre_median:
              type: number
              format: float
              description: Mediana do NDRE.
            ndre_std:
              type: number
              format: float
              description: Desvio padrão do NDRE.
            rendvi_mean:
              type: number
              format: float
              description: Média do RENDVI.
            rendvi_median:
              type: number
              format: float
              description: Mediana do RENDVI.
            rendvi_std:
              type: number
              format: float
              description: Desvio padrão do RENDVI.
            biomassa:
              type: number
              format: float
              description: Valor da biomassa.
            cobertura_vegetal:
              type: number
              format: float
              description: Porcentagem de cobertura vegetal.
            observacoes:
              type: string
              description: Observações adicionais.
    responses:
      201:
        description: Métrica criada com sucesso.
        schema:
          $ref: '#/definitions/Metricas'
      400:
        description: Erro na requisição, formato de data inválido ou no banco de dados.
    """
    data = request.get_json()
    with SessionLocal() as db:
        try:
            nova = Metricas(
                area_id=data.get("area_id"),
                periodo_inicio=date.fromisoformat(data.get("periodo_inicio")),
                periodo_fim=date.fromisoformat(data.get("periodo_fim")),
                ndvi_mean=data.get("ndvi_mean"),
                ndvi_median=data.get("ndvi_median"),
                ndvi_std=data.get("ndvi_std"),
                evi_mean=data.get("evi_mean"),
                evi_median=data.get("evi_median"),
                evi_std=data.get("evi_std"),
                ndwi_mean=data.get("ndwi_mean"),
                ndwi_median=data.get("ndwi_median"),
                ndwi_std=data.get("ndwi_std"),
                ndmi_mean=data.get("ndmi_mean"),
                ndmi_median=data.get("ndmi_median"),
                ndmi_std=data.get("ndmi_std"),
                gndvi_mean=data.get("gndvi_mean"),
                gndvi_median=data.get("gndvi_median"),
                gndvi_std=data.get("gndvi_std"),
                ndre_mean=data.get("ndre_mean"),
                ndre_median=data.get("ndre_median"),
                ndre_std=data.get("ndre_std"),
                rendvi_mean=data.get("rendvi_mean"),
                rendvi_median=data.get("rendvi_median"),
                rendvi_std=data.get("rendvi_std"),
                biomassa=data.get("biomassa"),
                cobertura_vegetal=data.get("cobertura_vegetal"),
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

@metricas_bp.route("/<int:id_metricas>", methods=["PUT"])
def atualizar_metricas(id_metricas):
    """
    Atualiza uma métrica
    Atualiza os dados de uma métrica existente.
    ---
    tags:
      - Métricas
    parameters:
      - name: id_metricas
        in: path
        required: true
        type: integer
        description: ID da métrica a ser atualizada.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            area_id:
              type: integer
              description: Novo ID da área.
            data_coleta:
              type: string
              format: date
              description: Nova data da coleta da métrica (formato YYYY-MM-DD).
            ndvi_mean:
              type: number
              format: float
              description: Nova média do NDVI.
            # ... (outras propriedades de métricas)
    responses:
      200:
        description: Métrica atualizada com sucesso.
        schema:
          $ref: '#/definitions/Metricas'
      404:
        description: Métrica não encontrada.
      400:
        description: Erro na requisição, formato de data inválido ou no banco de dados.
    """
    data = request.get_json()
    with SessionLocal() as db:
        metrica = db.get(Metricas, id_metricas)
        if not metrica:
            return jsonify({"erro": "Métrica não encontrada"}), 404

        try:
            metrica.area_id = data.get("area_id", metrica.area_id)
            metrica.periodo_inicio = date.fromisoformat(data.get("periodo_inicio")) if data.get("periodo_inicio") else metrica.periodo_inicio
            metrica.periodo_fim = date.fromisoformat(data.get("periodo_fim")) if data.get("periodo_fim") else metrica.periodo_fim
            metrica.ndvi_mean = data.get("ndvi_mean", metrica.ndvi_mean)
            metrica.ndvi_median = data.get("ndvi_median", metrica.ndvi_median)
            metrica.ndvi_std = data.get("ndvi_std", metrica.ndvi_std)
            metrica.evi_mean = data.get("evi_mean", metrica.evi_mean)
            metrica.evi_median = data.get("evi_median", metrica.evi_median)
            metrica.evi_std = data.get("evi_std", metrica.evi_std)
            metrica.ndwi_mean = data.get("ndwi_mean", metrica.ndwi_mean)
            metrica.ndwi_median = data.get("ndwi_median", metrica.ndwi_median)
            metrica.ndwi_std = data.get("ndwi_std", metrica.ndwi_std)
            metrica.ndmi_mean = data.get("ndmi_mean", metrica.ndmi_mean)
            metrica.ndmi_median = data.get("ndmi_median", metrica.ndmi_median)
            metrica.ndmi_std = data.get("ndmi_std", metrica.ndmi_std)
            metrica.gndvi_mean = data.get("gndvi_mean", metrica.gndvi_mean)
            metrica.gndvi_median = data.get("gndvi_median", metrica.gndvi_median)
            metrica.gndvi_std = data.get("gndvi_std", metrica.gndvi_std)
            metrica.ndre_mean = data.get("ndre_mean", metrica.ndre_mean)
            metrica.ndre_median = data.get("ndre_median", metrica.ndre_median)
            metrica.ndre_std = data.get("ndre_std", metrica.ndre_std)
            metrica.rendvi_mean = data.get("rendvi_mean", metrica.rendvi_mean)
            metrica.rendvi_median = data.get("rendvi_median", metrica.rendvi_median)
            metrica.rendvi_std = data.get("rendvi_std", metrica.rendvi_std)
            metrica.biomassa = data.get("biomassa", metrica.biomassa)
            metrica.cobertura_vegetal = data.get("cobertura_vegetal", metrica.cobertura_vegetal)

            db.commit()
            db.refresh(metrica)
            return jsonify(metrica.to_dict()), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400
        except ValueError as e:
            return jsonify({"erro": f"Erro de formato de data: {e}"}), 400


@metricas_bp.route("/<int:id_metricas>", methods=["DELETE"])
def deletar_metricas(id_metricas):
    """
    Deleta uma métrica pelo ID
    Remove uma métrica do sistema.
    ---
    tags:
      - Métricas
    parameters:
      - name: id_metricas
        in: path
        required: true
        type: integer
        description: ID da métrica a ser deletada.
    responses:
      200:
        description: Métrica removida com sucesso.
      404:
        description: Métrica não encontrada.
      400:
        description: Erro no banco de dados.
    """
    with SessionLocal() as db:
        metrica = db.get(Metricas, id_metricas)
        if not metrica:
            return jsonify({"erro": "Métrica não encontrada"}), 404
        try:
            db.delete(metrica)
            db.commit()
            return jsonify({"mensagem": "Métrica removida"}), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400
        

@metricas_bp.route("/fill_missing", methods=["POST"])
def fill_missing_metrics():
    """
    Endpoint que recebe:
      - area_id (int)
      - start_date (YYYY-MM-DD)
      - end_date (YYYY-MM-DD)
      - period_days (int, opcional, default=10)
      - collection (str, opcional, default='SENTINEL2')
    Ele verifica quais janelas periódicas estão faltando para a área e insere somente os períodos faltantes.
    """
    data = request.get_json()
    if not data:
        return jsonify({"erro": "JSON no corpo obrigatório"}), 400

    try:
        area_id = int(data.get("area_id"))
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        if not (start_date and end_date):
            return jsonify({"erro": "start_date e end_date são obrigatórios (YYYY-MM-DD)"}), 400
        period_days = int(data.get("period_days", 10))
        collection = data.get("collection", "SENTINEL2")

        summary = fill_missing_periodic_metrics(
            area_id=area_id,
            start_date_str=start_date,
            end_date_str=end_date,
            period_days=period_days,
            collection=collection
        )
        return jsonify(summary), 200
    except ValueError as ve:
        return jsonify({"erro": str(ve)}), 400
    except Exception as e:
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500