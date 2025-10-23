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

DELETE_PROPRIEDADE_BY_ID="""
DELETE FROM propriedade
WHERE id = %s
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

DELETE_METRICAS_BY_ID="""
DELETE FROM metricas
WHERE id = %s
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
            propriedades = cursor.fetchall()
            return {"propriedades": propriedades}
    
@app.get("/api/area")
def get_all_area():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_AREA)
            propriedades = cursor.fetchall()
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

# Rotas DELETE
@app.delete("/api/propriedade/<int:id_propriedade>")
def delete_propriedade(id_propriedade):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_PROPRIEDADE_BY_ID, (id_propriedade,))
    return {"message": f"Propriedade {id_propriedade} apagada com sucesso!"}

@app.delete("/api/area/<int:id_area>")
def delete_area(id_area):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_AREA_BY_ID, (id_area,))
    return {"message": f"Area {id_area} apagada com sucesso!"}

@app.delete("/api/metricas/<int:id_metricas>")
def delete_metricas(id_metricas):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_METRICAS_BY_ID, (id_metricas,))
    return {"message": f"Metricas {id_metricas} apagada com sucesso!"}

