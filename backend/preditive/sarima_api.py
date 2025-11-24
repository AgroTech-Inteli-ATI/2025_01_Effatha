from fastapi import FastAPI, HTTPException
import json
import os

app = FastAPI(
    title="API – Previsões SARIMA",
    description="API simples para retornar previsões do modelo SARIMA já treinado.",
    version="1.0.0",
)

# Caminho do arquivo com as previsões
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "data", "metricas_sarima_preds.json")

# Carregar previsões ao iniciar a API
with open(JSON_PATH, "r", encoding="utf-8") as f:
    PREVISOES = json.load(f)


@app.get("/variaveis")
def listar_variaveis():
    """Retorna a lista de variáveis disponíveis no modelo."""
    return [item["variavel"] for item in PREVISOES]


@app.get("/prever/{variavel}")
def prever_variavel(variavel: str):
    """Retorna previsões para uma variável específica."""
    for item in PREVISOES:
        if item["variavel"].lower() == variavel.lower():
            return item

    raise HTTPException(404, f"Variável '{variavel}' não encontrada.")


@app.get("/prever")
def prever_todas():
    """Retorna todas as previsões do modelo."""
    return PREVISOES


@app.get("/prever/{variavel}/6meses")
def prever_6_meses(variavel: str):
    """Retorna apenas 6 meses futuros da variável."""
    for item in PREVISOES:
        if item["variavel"].lower() == variavel.lower():
            valores = item["valores_previstos"]

            # ordenar as datas
            datas_ordenadas = sorted(valores.keys())

            # pegar as últimas 6
            ultimos_6 = datas_ordenadas[-6:]

            return {
                "variavel": variavel,
                "ultimos_6_meses": {d: valores[d] for d in ultimos_6}
            }

    raise HTTPException(404, f"Variável '{variavel}' não encontrada.")
