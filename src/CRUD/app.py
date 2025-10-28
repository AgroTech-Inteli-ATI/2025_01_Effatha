import os 
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
from flasgger import Swagger
from flask import Flask, request

CREATE_PROPRIEDADE_TABLE="""
CREATE TABLE IF NOT EXISTS propriedade (
    id SERIAL PRIMARY KEY,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responsavel VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL
);
"""

INSERT_PROPRIEDADE="""
INSERT INTO propriedade (responsavel, nome) VALUES (%s, %s) RETURNING id;
"""

GET_ALL_PROPRIEDADE="""
SELECT * FROM propriedade;
"""

GET_PROPRIEDADE_BY_ID="""
SELECT * FROM propriedade
WHERE id = %s
"""

DELETE_ALL_PROPRIEDADE="""
DELETE FROM propriedade;
"""

DELETE_PROPRIEDADE_BY_ID="""
DELETE FROM propriedade
WHERE id = %s
"""

UPDATE_PROPRIEDADE = """
UPDATE propriedade
SET responsavel = %s,
nome = %s
WHERE id = %s
RETURNING id;
"""


CREATE_AREA_TABLE="""
CREATE TABLE IF NOT EXISTS area (
    id SERIAL PRIMARY KEY,
    propriedade_id INTEGER,
    coordenada JSONB,
    municipio VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    nome_area VARCHAR(100) NOT NULL,
    cultura_principal VARCHAR(100),
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    imagens TEXT,
    observacoes TEXT,
    CONSTRAINT fk_area_propriedade FOREIGN KEY (propriedade_id) REFERENCES propriedade(id) ON DELETE CASCADE
);
"""

INSERT_AREA="""
INSERT INTO area (propriedade_id,coordenada,municipio,estado,nome_area,cultura_principal,imagens,observacoes) VALUES (%s, %s,%s, %s,%s, %s,%s, %s) RETURNING id;
"""

GET_ALL_AREA="""
SELECT * FROM area 
"""

GET_AREA_BY_ID="""
SELECT * FROM area
WHERE id = %s
"""

DELETE_ALL_AREA="""
DELETE FROM area;
"""

DELETE_AREA_BY_ID="""
DELETE FROM area
WHERE id = %s
"""


CREATE_METRICAS_TABLE="""
CREATE TABLE IF NOT EXISTS metricas  (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    ndvi_mean DECIMAL,
    ndvi_median DECIMAL,
    ndvi_std DECIMAL,
    evi_mean DECIMAL,
    evi_median DECIMAL,
    evi_std DECIMAL,
    ndwi_mean DECIMAL,
    ndwi_median DECIMAL,
    ndwi_std DECIMAL,
    ndmi_mean DECIMAL,
    ndmi_median DECIMAL,
    ndmi_std DECIMAL,
    gndvi_mean DECIMAL,
    gndvi_median DECIMAL,
    gndvi_std DECIMAL,
    ndre_mean DECIMAL,
    ndre_median DECIMAL,
    ndre_std DECIMAL,
    rendvi_mean DECIMAL,
    rendvi_median DECIMAL,
    rendvi_std DECIMAL,
    biomassa DECIMAL,
    cobertura_vegetal DECIMAL,
    CONSTRAINT fk_metricas_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);
"""
INSERT_METRICAS="""
INSERT INTO metricas (area_id, periodo_inicio, periodo_fim, ndvi_mean, ndvi_median, ndvi_std, evi_mean, evi_median, evi_std, ndwi_mean, ndwi_median, ndwi_std, ndmi_mean, ndmi_median, ndmi_std, gndvi_mean, gndvi_median, gndvi_std, ndre_mean, ndre_median, ndre_std, rendvi_mean, rendvi_median, rendvi_std, biomassa, cobertura_vegetal) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
"""

GET_ALL_METRICAS="""
SELECT * FROM metricas 
"""

GET_METRICAS_BY_ID="""
SELECT * FROM metricas
WHERE id = %s
"""

DELETE_ALL_METRICAS="""
DELETE FROM metricas;
"""

DELETE_METRICAS_BY_ID="""
DELETE FROM metricas
WHERE id = %s
"""

load_dotenv()

app = Flask(__name__)
swagger = Swagger(app)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

# Rotas GET ALL
@app.get("/api/propriedade")
def get_all_propriedade():
    """
    Get all propriedades
    ---
    tags:
      - Propriedade
    responses:
      200:
        description: A list of all propriedades
        schema:
          type: object
          properties:
            propriedades:
              type: array
              items:
                type: object
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_PROPRIEDADE)
            propriedades = cursor.fetchall() # Testar fechall no lugar do fetchone
            return {"propriedades": propriedades}
    
@app.get("/api/area")
def get_all_area():
    """
    Get all áreas
    ---
    tags:
      - Área
    responses:
      200:
        description: Lista de todas as áreas
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_AREA)
            propriedades = cursor.fetchone()
            return {"area": propriedades}

@app.get("/api/metricas")
def get_all_metricas():
    """
    Get all métricas
    ---
    tags:
      - Métricas
    responses:
      200:
        description: Lista de todas as métricas
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_METRICAS)
            propriedades = cursor.fetchall()
            return {"metricas": propriedades}

# Rotas POST
@app.post("/api/propriedade")
def create_propriedade():
    """
    Create a new propriedade
    ---
    tags:
      - Propriedade
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            responsavel:
              type: string
              example: "João"
            nome:
              type: string
              example: "Fazenda Primavera"
    responses:
      201:
        description: Propriedade criada com sucesso
        schema:
          type: object
          properties:
            id:
              type: integer
            message:
              type: string
    """
    data = request.get_json()
    responsavel = data["responsavel"]
    nome = data["nome"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PROPRIEDADE_TABLE)
            cursor.execute(INSERT_PROPRIEDADE, (responsavel, nome))
            propriedade_id = cursor.fetchone()[0]
    return {"id": propriedade_id, "message": f"Propriedade {nome} criada!"}, 201

@app.post("/api/area")
def create_area():
    """
    Create a new área
    ---
    tags:
      - Área
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            propriedade_id:
              type: integer
              example: 1
            coordenada:
              type: object
              example: {"lat": -23.56, "lng": -46.64}
            municipio:
              type: string
              example: "Campinas"
            estado:
              type: string
              example: "SP"
            nome_area:
              type: string
              example: "Área Norte"
            cultura_principal:
              type: string
              example: "Soja"
            imagens:
              type: string
              example: "link_to_image.jpg"
            observacoes:
              type: string
              example: "Solo fértil"
    responses:
      201:
        description: Área criada com sucesso
    """
    data = request.get_json()
    propriedade_id = data["propriedade_id"]
    coordenada = data["coordenada"]
    municipio = data["municipio"]
    estado = data["estado"]
    nome_area = data["nome_area"]
    cultura_principal = data["cultura_principal"]
    imagens = data["imagens"]
    observacoes = data["observacoes"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_AREA_TABLE)
            cursor.execute(INSERT_AREA, (propriedade_id,Json(coordenada),municipio,estado,nome_area,cultura_principal,imagens,observacoes))
            area_id = cursor.fetchone()[0]
    return {"id": area_id, "message": f"Area {nome_area} criada!"}, 201

@app.post("/api/metricas")
def create_metricas():
    """
    Create métricas for an área
    ---
    tags:
      - Métricas
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            area_id:
              type: integer
              example: 1
            periodo_inicio:
              type: string
              example: "2024-01-01"
            periodo_fim:
              type: string
              example: "2024-02-01"
            ndvi_mean:
              type: number
              example: 0.65
            ndvi_median:
              type: number
              example: 0.63
            ndvi_std:
              type: number
              example: 0.05
            biomassa:
              type: number
              example: 120.5
            cobertura_vegetal:
              type: number
              example: 80.2
    responses:
      201:
        description: Métricas criadas com sucesso
    """
    data = request.get_json()

    area_id = data["area_id"]
    periodo_inicio = data["periodo_inicio"]
    periodo_fim = data["periodo_fim"]
    ndvi_mean = data["ndvi_mean"]
    ndvi_median = data["ndvi_median"]
    ndvi_std = data["ndvi_std"]
    evi_mean = data["evi_mean"]
    evi_median = data["evi_median"]
    evi_std = data["evi_std"]
    ndwi_mean = data["ndwi_mean"]
    ndwi_median = data["ndwi_median"]
    ndwi_std = data["ndwi_std"]
    ndmi_mean = data["ndmi_mean"]
    ndmi_median = data["ndmi_median"]
    ndmi_std = data["ndmi_std"]
    gndvi_mean = data["gndvi_mean"]
    gndvi_median = data["gndvi_median"]
    gndvi_std = data["gndvi_std"]
    ndre_mean = data["ndre_mean"]
    ndre_median = data["ndre_median"]
    ndre_std = data["ndre_std"]
    rendvi_mean = data["rendvi_mean"]
    rendvi_median = data["rendvi_median"]
    rendvi_std = data["rendvi_std"]
    biomassa = data["biomassa"]
    cobertura_vegetal = data["cobertura_vegetal"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_METRICAS_TABLE)
            cursor.execute(INSERT_METRICAS,(area_id, periodo_inicio, periodo_fim, ndvi_mean, ndvi_median, ndvi_std,evi_mean, evi_median, evi_std,ndwi_mean, ndwi_median, ndwi_std,ndmi_mean, ndmi_median, ndmi_std,gndvi_mean, gndvi_median, gndvi_std, ndre_mean, ndre_median, ndre_std,rendvi_mean, rendvi_median, rendvi_std, biomassa, cobertura_vegetal))
            metrica_id = cursor.fetchone()[0]

    return {"id": metrica_id, "message": f"Métricas da área {area_id} criadas com sucesso!"}, 201

# Rotas DELETE ALL
@app.delete("/api/propriedade")
def delete_propriedade():
    """
    Delete all propriedades
    ---
    tags:
      - Propriedade
    responses:
      200:
        description: Todas as propriedades foram apagadas com sucesso
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_PROPRIEDADE)
    return {"message": "Todas as propriedades foram apagadas com sucesso!"}

@app.delete("/api/area")
def delete_area():
    """
    Delete all áreas
    ---
    tags:
      - Área
    responses:
      200:
        description: Todas as áreas foram apagadas com sucesso
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_AREA)
    return {"message": " Todas as áreas foram apagadas com sucesso!"}

@app.delete("/api/metricas")
def delete_metricas():
    """
    Delete all métricas
    ---
    tags:
      - Métricas
    responses:
      200:
        description: Todas as métricas foram apagadas
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_METRICAS)
    return {"message": f"Todas as Metricas foram apagada com sucesso!"}

# Rotas DELETE BY ID
@app.delete("/api/propriedade/<int:id_propriedade>")
def delete_propriedade_by_id(id_propriedade):
    """
    Delete propriedade by ID
    ---
    tags:
      - Propriedade
    parameters:
      - name: id_propriedade
        in: path
        type: integer
        required: true
        description: ID da propriedade a ser apagada
    responses:
      200:
        description: Propriedade deletada com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_PROPRIEDADE_BY_ID, (id_propriedade,))
    return {"message": f"Propriedade {id_propriedade} apagada com sucesso!"}

@app.delete("/api/area/<int:id_area>")
def delete_area_by_id(id_area):
    """
    Delete área by ID
    ---
    tags:
      - Área
    parameters:
      - name: id_area
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Área deletada com sucesso
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_AREA_BY_ID, (id_area,))
    return {"message": f"Area {id_area} apagada com sucesso!"}

@app.delete("/api/metricas/<int:id_metricas>")
def delete_metricas_by_id(id_metricas):
    """
    Delete métricas by ID
    ---
    tags:
      - Métricas
    parameters:
      - name: id_metricas
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Métricas apagadas com sucesso
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_METRICAS_BY_ID, (id_metricas,))
    return {"message": f"Metricas {id_metricas} apagada com sucesso!"}

# Rotas GET BY ID
@app.get("/api/propriedade/<int:id_propriedade>")
def get_propriedade_by_id(id_propriedade):
    """
    Get propriedade by ID
    ---
    tags:
      - Propriedade
    parameters:
      - name: id_propriedade
        in: path
        type: integer
        required: true
        description: ID da propriedade
    responses:
      200:
        description: Propriedade encontrada
        schema:
          type: object
          properties:
            propriedades:
              type: array
              items:
                type: object
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_PROPRIEDADE_BY_ID, (id_propriedade,))
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}

@app.get("/api/area/<int:id_area>")
def get_area_by_id(id_area):
    """
    Get área by ID
    ---
    tags:
      - Área
    parameters:
      - name: id_area
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Área encontrada
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_AREA_BY_ID, (id_area,))
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}
        
@app.get("/api/metricas/<int:id_metricas>")
def get_metricas_by_id(id_metricas):
    """
    Get métricas by ID
    ---
    tags:
      - Métricas
    parameters:
      - name: id_metricas
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Métricas encontradas
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_METRICAS_BY_ID, (id_metricas,))
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}
        
# Rotas UPDATES

@app.put("/api/propriedade/<int:id_propriedade>")
def update_propriedade(id_propriedade):
    """
    Update propriedade by ID
    ---
    tags:
      - Propriedade
    parameters:
      - name: id_propriedade
        in: path
        type: integer
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            responsavel:
              type: string
              example: "Maria"
            nome:
              type: string
              example: "Fazenda Esperança"
    responses:
      200:
        description: Propriedade atualizada com sucesso
        schema:
          type: object
          properties:
            id:
              type: integer
            message:
              type: string
    """
    data = request.get_json()
    responsavel = data.get("responsavel")
    nome = data.get("nome")
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_PROPRIEDADE, (responsavel, nome, id_propriedade,))
            row = cursor.fetchone()
    return {"id": row[0], "message": f"Propriedade {id_propriedade} atualizada com sucesso!"}


