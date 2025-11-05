from flask import Flask, jsonify, request
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import SessionLocal, engine, get_db
from models import Base, Propriedade, Area, Metricas, MetricasPreditivas
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

# Inicialização do Flask
app = Flask(__name__)
swagger = Swagger(app)

# Cria tabelas automaticamente
Base.metadata.create_all(bind=engine)

# ====================================================
# ROTAS DE PROPRIEDADE 
# ====================================================

@app.route("/api/propriedade", methods=["GET"])
def listar_propriedades():
    """
    Lista todas as propriedades
    ---
    responses:
      200:
        description: Lista de propriedades
    """
    with SessionLocal() as db:
        propriedades = db.scalars(select(Propriedade)).all()
        return jsonify([p.to_dict() for p in propriedades]), 200


@app.route("/api/propriedade/<int:id_propriedade>", methods=["GET"])
def get_propriedade(id_propriedade):
    """
    Retorna uma propriedade pelo ID
    ---
    parameters:
      - name: id_propriedade
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Propriedade encontrada
      404:
        description: Propriedade não encontrada
    """
    with SessionLocal() as db:
        propriedade = db.get(Propriedade, id_propriedade)
        if not propriedade:
            return jsonify({"erro": "Propriedade não encontrada"}), 404
        return jsonify(propriedade.to_dict()), 200


@app.route("/api/propriedade", methods=["POST"])
def criar_propriedade():
    """
    Cria uma nova propriedade
    ---
    parameters:
      - in: body
        name: body
        required: true
        schema:
          properties:
            responsavel:
              type: string
            nome:
              type: string
    responses:
      201:
        description: Propriedade criada com sucesso
    """
    data = request.get_json()
    with SessionLocal() as db:
        try:
            nova = Propriedade(
                responsavel=data.get("responsavel"),
                nome=data.get("nome"),
            )
            db.add(nova)
            db.commit()
            db.refresh(nova)
            return jsonify(nova.to_dict()), 201
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400


@app.route("/api/propriedade/<int:id_propriedade>", methods=["PUT"])
def atualizar_propriedade(id_propriedade):
    """
    Atualiza uma propriedade
    ---
    parameters:
      - name: id_propriedade
        in: path
        required: true
        type: integer
      - in: body
        name: body
        schema:
          properties:
            responsavel:
              type: string
            nome:
              type: string
    """
    data = request.get_json()
    with SessionLocal() as db:
        propriedade = db.get(Propriedade, id_propriedade)
        if not propriedade:
            return jsonify({"erro": "Propriedade não encontrada"}), 404

        propriedade.responsavel = data.get("responsavel", propriedade.responsavel)
        propriedade.nome = data.get("nome", propriedade.nome)

        try:
            db.commit()
            db.refresh(propriedade)
            return jsonify(propriedade.to_dict()), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400


@app.route("/api/propriedade/<int:id_propriedade>", methods=["DELETE"])
def deletar_propriedade(id_propriedade):
    """
    Deleta uma propriedade pelo ID
    ---
    parameters:
      - name: id_propriedade
        in: path
        required: true
        type: integer
    """
    with SessionLocal() as db:
        propriedade = db.get(Propriedade, id_propriedade)
        if not propriedade:
            return jsonify({"erro": "Propriedade não encontrada"}), 404
        try:
            db.delete(propriedade)
            db.commit()
            return jsonify({"mensagem": "Propriedade removida"}), 200
        except SQLAlchemyError as e:
            db.rollback()
            return jsonify({"erro": str(e)}), 400

# ====================================================
# ROTAS DE ÁREA 
# ====================================================

@app.route("/api/area", methods=["GET"])
def listar_areas():
    """
    Lista todas as áreas
    ---
    responses:
      200:
        description: Lista de áreas
    """
    with SessionLocal() as db:
        areas = db.scalars(select(Area)).all()
        return jsonify([a.to_dict() for a in areas]), 200

@app.route("/api/area/<int:id_area>", methods=["GET"])
def get_area(id_area):
    """
    Retorna uma área pelo ID
    ---
    parameters:
      - name: id_area
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Área encontrada
      404:
        description: Área não encontrada
    """
    with SessionLocal() as db:
        area = db.get(Area, id_area)
        if not area:
            return jsonify({"erro": "Área não encontrada"}), 404
        return jsonify(area.to_dict()), 200


@app.route("/api/area", methods=["POST"])
def criar_area():
    """
    Cria uma nova área
    ---
    parameters:
      - in: body
        name: body
        schema:
          properties:
            propriedade_id:
              type: integer
            coordenada:
              type: object
            municipio:
              type: string
            estado:
              type: string
            nome_area:
              type: string
            cultura_principal:
              type: string
            imagens:
              type: string
            observacoes:
              type: string
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

@app.route("/api/area/<int:id_area>", methods=["PUT"])
def atualizar_area(id_area):
    """
    Atualiza uma área
    ---
    parameters:
      - name: id_area
        in: path
        required: true
        type: integer
      - in: body
        name: body
        schema:
          properties:
            propriedade_id:
              type: integer
            coordenada:
              type: object
            municipio:
              type: string
            estado:
              type: string
            nome_area:
              type: string
            cultura_principal:
              type: string
            imagens:
              type: string
            observacoes:
              type: string
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


@app.route("/api/area/<int:id_area>", methods=["DELETE"])
def deletar_area(id_area):
    """
    Deleta uma área pelo ID
    ---
    parameters:
      - name: id_area
        in: path
        required: true
        type: integer
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

# ====================================================
# ROTAS DE MÉTRICAS 
# ====================================================

@app.route("/api/metricas", methods=["GET"])
def listar_metricas():
    """Lista todas as métricas"""
    with SessionLocal() as db:
        metricas = db.scalars(select(Metricas)).all()
        return jsonify([m.to_dict() for m in metricas]), 200

@app.route("/api/metricas/<int:id_metricas>", methods=["GET"])
def get_metricas(id_metricas):
    """
    Retorna uma métrica pelo ID
    ---
    parameters:
      - name: id_metricas
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Métrica encontrada
      404:
        description: Métrica não encontrada
    """
    with SessionLocal() as db:
        metrica = db.get(Metricas, id_metricas)
        if not metrica:
            return jsonify({"erro": "Métrica não encontrada"}), 404
        return jsonify(metrica.to_dict()), 200

@app.route("/api/metricas", methods=["POST"])
def criar_metricas():
    """Cria uma nova métrica"""
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

@app.route("/api/metricas/<int:id_metricas>", methods=["PUT"])
def atualizar_metricas(id_metricas):
    """Atualiza uma métrica"""
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


@app.route("/api/metricas/<int:id_metricas>", methods=["DELETE"])
def deletar_metricas(id_metricas):
    """
    Deleta uma métrica pelo ID
    ---
    parameters:
      - name: id_metricas
        in: path
        required: true
        type: integer
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

# ====================================================
# ROTAS DE MÉTRICAS PREDITIVAS 
# ====================================================

@app.route("/api/metricas_preditivas", methods=["GET"])
def listar_metricas_preditivas():
    """Lista todas as métricas preditivas"""
    with SessionLocal() as db:
        metricas = db.scalars(select(MetricasPreditivas)).all()
        return jsonify([m.to_dict() for m in metricas]), 200

@app.route("/api/metricas_preditivas/<int:id_pred>", methods=["GET"])
def get_metricas_preditivas(id_pred):
    """
    Retorna uma métrica preditiva pelo ID
    ---
    parameters:
      - name: id_pred
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Métrica Preditiva encontrada
      404:
        description: Métrica Preditiva não encontrada
    """
    with SessionLocal() as db:
        metrica = db.get(MetricasPreditivas, id_pred)
        if not metrica:
            return jsonify({"erro": "Métrica Preditiva não encontrada"}), 404
        return jsonify(metrica.to_dict()), 200

@app.route("/api/metricas_preditivas", methods=["POST"])
def criar_metricas_preditivas():
    """Cria uma nova métrica preditiva"""
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

@app.route("/api/metricas_preditivas/<int:id_pred>", methods=["PUT"])
def atualizar_metricas_preditivas(id_pred):
    """Atualiza uma métrica preditiva"""
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


@app.route("/api/metricas_preditivas/<int:id_pred>", methods=["DELETE"])
def deletar_metricas_preditivas(id_pred):
    """
    Deleta uma métrica preditiva pelo ID
    ---
    parameters:
      - name: id_pred
        in: path
        required: true
        type: integer
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

# ====================================================
# RUN
# ====================================================

if __name__ == "__main__":
    app.run(debug=True)
