from flask import Flask, jsonify, request, Blueprint
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select
from CRUD.database import SessionLocal, engine, get_db
from CRUD.models import Base, Area  
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

area_bp = Blueprint('area_bp', __name__, url_prefix='/api/area')

# ====================================================
# ROTAS DE ÁREA 
# ====================================================

@area_bp.route("/", methods=["GET"])
def listar_areas():
    """
    Lista todas as áreas
    Retorna uma lista de todas as áreas cadastradas.
    ---
    tags:
      - Área
    responses:
      200:
        description: Lista de áreas retornada com sucesso.
        schema:
          type: array
          items:
            $ref: '#/definitions/Area'
    """
    with SessionLocal() as db:
        areas = db.scalars(select(Area)).all()
        return jsonify([a.to_dict() for a in areas]), 200

@area_bp.route("/<int:id_area>", methods=["GET"])
def get_area(id_area):
    """
    Retorna uma área pelo ID
    Busca e retorna os detalhes de uma área específica.
    ---
    tags:
      - Área
    parameters:
      - name: id_area
        in: path
        required: true
        type: integer
        description: ID da área a ser buscada.
    responses:
      200:
        description: Área encontrada.
        schema:
          $ref: '#/definitions/Area'
      404:
        description: Área não encontrada.
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
    Cadastra uma nova área no sistema, associada a uma propriedade.
    ---
    tags:
      - Área
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - propriedade_id
            - coordenada
            - municipio
            - estado
            - nome_area
          properties:
            propriedade_id:
              type: integer
              description: ID da propriedade à qual a área pertence.
            coordenada:
              type: object
              description: Coordenadas geográficas da área.
            municipio:
              type: string
              description: Município onde a área está localizada.
            estado:
              type: string
              description: Estado onde a área está localizada.
            nome_area:
              type: string
              description: Nome da área.
            cultura_principal:
              type: string
              description: Cultura principal cultivada na área.
            imagens:
              type: string
              description: URL ou caminho para imagens da área.
            observacoes:
              type: string
              description: Observações adicionais sobre a área.
    responses:
      201:
        description: Área criada com sucesso.
        schema:
          $ref: '#/definitions/Area'
      400:
        description: Erro na requisição ou no banco de dados.
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
    Atualiza os dados de uma área existente.
    ---
    tags:
      - Área
    parameters:
      - name: id_area
        in: path
        required: true
        type: integer
        description: ID da área a ser atualizada.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            propriedade_id:
              type: integer
              description: Novo ID da propriedade à qual a área pertence.
            coordenada:
              type: object
              description: Novas coordenadas geográficas da área.
            municipio:
              type: string
              description: Novo município.
            estado:
              type: string
              description: Novo estado.
            nome_area:
              type: string
              description: Novo nome da área.
            cultura_principal:
              type: string
              description: Nova cultura principal.
            imagens:
              type: string
              description: Nova URL ou caminho para imagens.
            observacoes:
              type: string
              description: Novas observações.
    responses:
      200:
        description: Área atualizada com sucesso.
        schema:
          $ref: '#/definitions/Area'
      404:
        description: Área não encontrada.
      400:
        description: Erro na requisição ou no banco de dados.
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
    Remove uma área do sistema.
    ---
    tags:
      - Área
    parameters:
      - name: id_area
        in: path
        required: true
        type: integer
        description: ID da área a ser deletada.
    responses:
      200:
        description: Área removida com sucesso.
      404:
        description: Área não encontrada.
      400:
        description: Erro no banco de dados.
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