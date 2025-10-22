import os 
import psycopg2
from dotenv import load_dotenv
from flask import Flask

CREATE_PROPRIEDADE_TABLE="""
CREATE TABLE propriedade (
    id UUID PRIMARY KEY,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responsavel VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL
);
"""

CREATE_AREA_TABLE="""
CREATE TABLE area (
    id UUID PRIMARY KEY,
    projeto_id UUID,
    coordenada JSONB,
    municipio VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    nome_area VARCHAR(100) NOT NULL,
    cultura_principal VARCHAR(100),
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    imagens TEXT,
    observacoes TEXT,
    CONSTRAINT fk_area_propriedade FOREIGN KEY (projeto_id) REFERENCES propriedade(id) ON DELETE CASCADE
);
"""

CREATE_METRICAS_TABLE="""
CREATE TABLE metricas (
    id UUID PRIMARY KEY,
    area_id UUID NOT NULL,
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


load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

@app.get("/")
def home():
    return "Hello World!"

@app.post("/api/area")
def create_area():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PROPRIEDADE_TABLE)
            cursor.execute(CREATE_AREA_TABLE)
            cursor.execute(CREATE_METRICAS_TABLE)
    return {"message": f"Tabela criada"}, 201

