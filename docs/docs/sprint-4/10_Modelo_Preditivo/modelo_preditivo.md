# Modelo Preditivo – Projeto Effatha 🌱

## Introdução

Este notebook apresenta o pipeline de **modelagem preditiva** do **Projeto Effatha**, que utiliza dados agrícolas e imagens de satélite para gerar indicadores quantitativos sobre o desempenho de áreas de cultivo.

A documentação a seguir destaca apenas as etapas essenciais do código:

- Importação do JSON com os dados de entrada;
- Treinamento do modelo preditivo;
- Exportação dos resultados para JSON.

---

## Explicação Objetiva

O fluxo do notebook foi estruturado em três estágios principais:

1. **Importação dos dados** – Carrega um arquivo `.json` contendo informações relevantes (índices vegetativos, variáveis meteorológicas e de solo).
2. **Treinamento do modelo** – Aplica técnicas de aprendizado supervisionado (como regressão ou ensemble) utilizando bibliotecas do `scikit-learn`.
3. **Exportação dos resultados** – Salva as predições e métricas de desempenho em formato `.json`, permitindo integração com dashboards analíticos e relatórios automatizados.

---

## Demonstração do Código

```python
import pandas as pd
import json

path = "data.json"

with open(path, "r", encoding='utf-8') as f:
    conteudo = json.load(f)

# Extrair os dados da chave correta
df = pd.DataFrame(conteudo["blocks"])

print(df.head())

```

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np
import pandas as pd

predicoes = {}
metricas = []  # lista para armazenar as métricas

# ---------- 1. Treinar todos os modelos e salvar métricas ----------
for nome in indices:
    y = series[nome]
    treino = y[:'2023-12-01']
    teste = y['2024-01-01':]

    modelo = SARIMAX(
        treino,
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 12),
        enforce_stationarity=False,
        enforce_invertibility=False
    )

    resultado = modelo.fit(disp=False)

    pred = resultado.get_forecast(steps=len(teste))
    pred_mean = pred.predicted_mean

    # Calcular métricas
    mae = mean_absolute_error(teste, pred_mean)
    rmse = np.sqrt(mean_squared_error(teste, pred_mean))

    # Guardar as previsões e métricas
    predicoes[nome] = {
        "pred": pred_mean,
        "mae": mae,
        "rmse": rmse
    }

    metricas.append({
        "variavel": nome,
        "MAE": mae,
        "RMSE": rmse
    })

# ---------- 2. Criar DataFrame com todas as métricas ----------
df_metricas = pd.DataFrame(metricas)
print("📊 Métricas de todos os índices:")
print(df_metricas.sort_values("RMSE"))

# ---------- 3. Gerar os gráficos ----------
for nome in indices:
    y = series[nome]
    treino = y[:'2023-12-01']
    teste = y['2024-01-01':]
    pred_mean = predicoes[nome]["pred"]

    plt.figure(figsize=(8,4))
    plt.plot(treino, label="Treino", color="blue")
    plt.plot(teste, label="Real (Teste)", color="orange")
    plt.plot(pred_mean, label="Previsto (SARIMA)", color="red")
    plt.title(f"Previsão {nome.upper()} - SARIMA Univariado")
    plt.legend()
    plt.show()

```

```python
import json

# Criar lista com todas as métricas + valores previstos
metricas_com_preds = []

for nome in indices:
    pred_mean = predicoes[nome]["pred"]
    mae = predicoes[nome]["mae"]
    rmse = predicoes[nome]["rmse"]

    # Converte a série de previsões em dicionário {data: valor}
    preds_dict = {str(data.date()): float(valor) for data, valor in pred_mean.items()}

    metricas_com_preds.append({
        "variavel": nome,
        "MAE": round(mae, 4),
        "RMSE": round(rmse, 4),
        "valores_previstos": preds_dict
    })

# Caminho para salvar o JSON
caminho_json = "CAMINHO"

# Salvar o arquivo JSON formatado
with open(caminho_json, "w", encoding="utf-8") as f:
    json.dump(metricas_com_preds, f, ensure_ascii=False, indent=2)

print(f"✅ JSON salvo com sucesso em: {caminho_json}")

```

---

## Conclusão

O notebook sintetiza o funcionamento essencial do **modelo preditivo agrícola** do Projeto Effatha.  
O fluxo baseado em **entrada-processamento-saída (JSON → modelo → JSON)** garante reprodutibilidade, modularidade e integração direta com outras aplicações da plataforma Effatha.

---
