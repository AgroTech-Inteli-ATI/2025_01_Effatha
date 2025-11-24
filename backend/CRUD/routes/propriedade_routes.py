from flask import Flask, jsonify, request, Blueprint
from flasgger import Swagger
from sqlalchemy.orm import Session
from sqlalchemy import select
from CRUD.database import SessionLocal, engine, get_db
from CRUD.models import Base, Propriedade  
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

propriedade_bp = Blueprint('propriedade_bp', __name__, url_prefix='/api/propriedade')

# ====================================================
# ROTAS DE PROPRIEDADE 
# ====================================================

@propriedade_bp.route("/", methods=["GET"])
def listar_propriedades():
    """
    Lista todas as propriedades
    Retorna uma lista de todas as propriedades cadastradas.
    ---
    tags:
      - Propriedade
    responses:
      200:
        description: Lista de propriedades retornada com sucesso.
        schema:
          type: array
          items:
            $ref: '#/definitions/Propriedade'
    """
    with SessionLocal() as db:
        propriedades = db.scalars(select(Propriedade)).all()
        return jsonify([p.to_dict() for p in propriedades]), 200


@propriedade_bp.route("/<int:id_propriedade>", methods=["GET"])
def get_propriedade(id_propriedade):
    """
    Retorna uma propriedade pelo ID
    Busca e retorna os detalhes de uma propriedade específica.
    ---
    tags:
      - Propriedade
    parameters:
      - name: id_propriedade
        in: path
        required: true
        type: integer
        description: ID da propriedade a ser buscada.
    responses:
      200:
        description: Propriedade encontrada.
        schema:
          $ref: '#/definitions/Propriedade'
      404:
        description: Propriedade não encontrada.
    """
    with SessionLocal() as db:
        propriedade = db.get(Propriedade, id_propriedade)
        if not propriedade:
            return jsonify({"erro": "Propriedade não encontrada"}), 404
        return jsonify(propriedade.to_dict()), 200


@propriedade_bp.route("/", methods=["POST"])
def criar_propriedade():
    """
    Cria uma nova propriedade
    Cadastra uma nova propriedade no sistema.
    ---
    tags:
      - Propriedade
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - responsavel
            - nome
          properties:
            responsavel:
              type: string
              description: Nome do responsável pela propriedade.
            nome:
              type: string
              description: Nome da propriedade.
    responses:
      201:
        description: Propriedade criada com sucesso.
        schema:
          $ref: '#/definitions/Propriedade'
      400:
        description: Erro na requisição ou no banco de dados.
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


@propriedade_bp.route("/<int:id_propriedade>", methods=["PUT"])
def atualizar_propriedade(id_propriedade):
    """
    Atualiza uma propriedade
    Atualiza os dados de uma propriedade existente.
    ---
    tags:
      - Propriedade
    parameters:
      - name: id_propriedade
        in: path
        required: true
        type: integer
        description: ID da propriedade a ser atualizada.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            responsavel:
              type: string
              description: Novo nome do responsável pela propriedade.
            nome:
              type: string
              description: Novo nome da propriedade.
    responses:
      200:
        description: Propriedade atualizada com sucesso.
        schema:
          $ref: '#/definitions/Propriedade'
      404:
        description: Propriedade não encontrada.
      400:
        description: Erro na requisição ou no banco de dados.
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


@propriedade_bp.route("/<int:id_propriedade>", methods=["DELETE"])
def deletar_propriedade(id_propriedade):
    """
    Deleta uma propriedade pelo ID
    Remove uma propriedade do sistema.
    ---
    tags:
      - Propriedade
    parameters:
      - name: id_propriedade
        in: path
        required: true
        type: integer
        description: ID da propriedade a ser deletada.
    responses:
      200:
        description: Propriedade removida com sucesso.
      404:
        description: Propriedade não encontrada.
      400:
        description: Erro no banco de dados.
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