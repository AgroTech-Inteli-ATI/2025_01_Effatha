import os 
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
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

CREATE_METRICAS_PREDITIVAS_TABLE = """
CREATE TABLE IF NOT EXISTS metricas_preditivas (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL,
    modelo_utilizado VARCHAR(100) NOT NULL,
    periodo_previsto_inicio DATE NOT NULL,
    periodo_previsto_fim DATE NOT NULL,
    ndvi_mean_pred DECIMAL,
    ndvi_median_pred DECIMAL,
    ndvi_std_pred DECIMAL,
    evi_mean_pred DECIMAL,
    evi_median_pred DECIMAL,
    evi_std_pred DECIMAL,
    ndwi_mean_pred DECIMAL,
    ndwi_median_pred DECIMAL,
    ndwi_std_pred DECIMAL,
    ndmi_mean_pred DECIMAL,
    ndmi_median_pred DECIMAL,
    ndmi_std_pred DECIMAL,
    gndvi_mean_pred DECIMAL,
    gndvi_median_pred DECIMAL,
    gndvi_std_pred DECIMAL,
    ndre_mean_pred DECIMAL,
    ndre_median_pred DECIMAL,
    ndre_std_pred DECIMAL,
    rendvi_mean_pred DECIMAL,
    rendvi_median_pred DECIMAL,
    rendvi_std_pred DECIMAL,
    biomassa_pred DECIMAL,
    cobertura_vegetal_pred DECIMAL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    CONSTRAINT fk_pred_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);
"""

INSERT_METRICAS_PREDITIVAS = """
INSERT INTO metricas_preditivas (
    area_id, modelo_utilizado, periodo_previsto_inicio, periodo_previsto_fim,
    ndvi_mean_pred, ndvi_median_pred, ndvi_std_pred,
    evi_mean_pred, evi_median_pred, evi_std_pred,
    ndwi_mean_pred, ndwi_median_pred, ndwi_std_pred,
    ndmi_mean_pred, ndmi_median_pred, ndmi_std_pred,
    gndvi_mean_pred, gndvi_median_pred, gndvi_std_pred,
    ndre_mean_pred, ndre_median_pred, ndre_std_pred,
    rendvi_mean_pred, rendvi_median_pred, rendvi_std_pred,
    biomassa_pred, cobertura_vegetal_pred, observacoes
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
RETURNING id;
"""

GET_ALL_METRICAS_PREDITIVAS = """
SELECT * FROM metricas_preditivas
"""

GET_METRICAS_PREDITIVAS_BY_ID = """
SELECT * FROM metricas_preditivas
WHERE id = %s
"""

DELETE_ALL_METRICAS_PREDITIVAS = """
DELETE FROM metricas_preditivas;
"""

DELETE_METRICAS_PREDITIVAS_BY_ID = """
DELETE FROM metricas_preditivas
WHERE id = %s;
"""

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

# Rotas GET ALL
@app.get("/api/propriedade")
def get_all_propriedade():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_PROPRIEDADE)
            propriedades = cursor.fetchone()
            return {"propriedades": propriedades}
    
@app.get("/api/area")
def get_all_area():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_AREA)
            propriedades = cursor.fetchone()
            return {"area": propriedades}

@app.get("/api/metricas")
def get_all_metricas():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_METRICAS)
            propriedades = cursor.fetchall()
            return {"metricas": propriedades}

# Rotas POST
@app.post("/api/propriedade")
def create_propriedade():
    data = request.get_json()
    reponsavel = data["responsavel"]
    nome = data["nome"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PROPRIEDADE_TABLE)
            cursor.execute(INSERT_PROPRIEDADE, (reponsavel, nome))
            propriedade_id = cursor.fetchone()[0]
    return {"id": propriedade_id, "message": f"Propriedade {nome} criada!"}, 201

@app.post("/api/area")
def create_area():
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
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_PROPRIEDADE)
    return {"message": "Todas as propriedades foram apagadas com sucesso!"}

@app.delete("/api/area")
def delete_area():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_AREA)
    return {"message": " Todas as áreas foram apagadas com sucesso!"}

@app.delete("/api/metricas")
def delete_metricas():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_METRICAS)
    return {"message": f"Todas as Metricas foram apagada com sucesso!"}

# Rotas DELETE BY ID
@app.delete("/api/propriedade/<int:id_propriedade>")
def delete_propriedade_by_id(id_propriedade):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_PROPRIEDADE_BY_ID, (id_propriedade,))
    return {"message": f"Propriedade {id_propriedade} apagada com sucesso!"}

@app.delete("/api/area/<int:id_area>")
def delete_area_by_id(id_area):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_AREA_BY_ID, (id_area,))
    return {"message": f"Area {id_area} apagada com sucesso!"}

@app.delete("/api/metricas/<int:id_metricas>")
def delete_metricas_by_id(id_metricas):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_METRICAS_BY_ID, (id_metricas,))
    return {"message": f"Metricas {id_metricas} apagada com sucesso!"}

# Rotas GET BY ID
@app.get("/api/propriedade/<int:id_propriedade>")
def get_propriedade_by_id(id_propriedade):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_PROPRIEDADE_BY_ID, (id_propriedade,))
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}

@app.get("/api/area/<int:id_area>")
def get_area_by_id(id_area):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_AREA_BY_ID, (id_area,))
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}
        
@app.get("/api/metricas/<int:id_metricas>")
def get_metricas_by_id(id_metricas):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_METRICAS_BY_ID, (id_metricas,))
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}
        
# Rotas UPDATES

@app.put("/api/propriedade/<int:id_propriedade>")
def update_propriedade(id_propriedade):
    data = request.get_json()
    responsavel = data.get("responsavel")
    nome = data.get("nome")
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_PROPRIEDADE, (responsavel, nome, id_propriedade,))
            row = cursor.fetchone()
    return {"id": row[0], "message": f"Propriedade {id_propriedade} atualizada com sucesso!"}

# Metricas Preditivas

@app.get("/api/metricas_preditivas")
def get_all_metricas_preditivas():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_METRICAS_PREDITIVAS)
            metricas = cursor.fetchall()
            return {"metricas_preditivas": metricas}

@app.get("/api/metricas_preditivas/<int:id_pred>")
def get_metricas_preditivas_by_id(id_pred):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_METRICAS_PREDITIVAS_BY_ID, (id_pred,))
            metrica = cursor.fetchall()
            return {"metricas_preditivas": metrica}

@app.post("/api/metricas_preditivas")
def create_metricas_preditivas():
    data = request.get_json()

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_METRICAS_PREDITIVAS_TABLE)
            cursor.execute(INSERT_METRICAS_PREDITIVAS, (
                data["area_id"], data["modelo_utilizado"],
                data["periodo_previsto_inicio"], data["periodo_previsto_fim"],
                data["ndvi_mean_pred"], data["ndvi_median_pred"], data["ndvi_std_pred"],
                data["evi_mean_pred"], data["evi_median_pred"], data["evi_std_pred"],
                data["ndwi_mean_pred"], data["ndwi_median_pred"], data["ndwi_std_pred"],
                data["ndmi_mean_pred"], data["ndmi_median_pred"], data["ndmi_std_pred"],
                data["gndvi_mean_pred"], data["gndvi_median_pred"], data["gndvi_std_pred"],
                data["ndre_mean_pred"], data["ndre_median_pred"], data["ndre_std_pred"],
                data["rendvi_mean_pred"], data["rendvi_median_pred"], data["rendvi_std_pred"],
                data["biomassa_pred"], data["cobertura_vegetal_pred"],
                data.get("observacoes", None)
            ))
            metrica_id = cursor.fetchone()[0]
    return {"id": metrica_id, "message": "Métricas preditivas criadas com sucesso!"}, 201

@app.delete("/api/metricas_preditivas")
def delete_all_metricas_preditivas():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_METRICAS_PREDITIVAS)
    return {"message": "Todas as métricas preditivas foram apagadas com sucesso!"}

@app.delete("/api/metricas_preditivas/<int:id_pred>")
def delete_metricas_preditivas_by_id(id_pred):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_METRICAS_PREDITIVAS_BY_ID, (id_pred,))
    return {"message": f"Métricas preditivas {id_pred} apagadas com sucesso!"}
