# Documentação Simplificada – Projeto Effatha 🌱

## Introdução

Este notebook tem como objetivo demonstrar o fluxo essencial do **modelo de aprendizado de máquina** aplicado ao projeto **Effatha**, focado em mensuração agrícola por imagens e dados de satélite.

A seguir, são apresentadas apenas as partes **fundamentais do código**:

- Importação do arquivo JSON contendo os dados;
- Treinamento do modelo preditivo;
- Exportação dos resultados para JSON.

---

## Explicação Objetiva

O fluxo de trabalho implementado no notebook segue três etapas principais:

1. **Importação dos dados** – leitura de um arquivo `.json` contendo amostras ou registros processados previamente (ex.: índices de vegetação, parâmetros meteorológicos, ou variáveis de solo).
2. **Treinamento do modelo** – uso de bibliotecas como `scikit-learn` para ajustar um modelo supervisionado aos dados fornecidos.
3. **Exportação dos resultados** – conversão das previsões ou métricas do modelo em formato `.json`, permitindo integração com outras partes do sistema ou dashboards analíticos.

---

## Demonstração do Código

```python
import pandas as pd
import json

path = "data.json"

with open(path, "r", encoding='utf-8') as f:
    conteudo = json.load(f)

data = conteudo["data"]

df = pd.DataFrame(data)

print(df.head())
```

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np

predicoes = {}


for nome in indices:
    y = series[nome]
    treino = y[:'2023-12-01']
    teste = y['2024-01-01':]

    # Treinar o modelo SARIMA univariado
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


    mae = mean_absolute_error(teste, pred_mean)
    rmse = np.sqrt(mean_squared_error(teste, pred_mean))

    # Salvar resultado
    predicoes[nome] = {
        "pred": pred_mean,
        "mae": mae,
        "rmse": rmse
    }

    plt.figure(figsize=(8,4))
    plt.plot(treino, label="Treino", color="blue")
    plt.plot(teste, label="Real (Teste)", color="orange")
    plt.plot(pred_mean, label="Previsto (SARIMA)", color="red")
    plt.title(f"Previsão {nome.upper()} - SARIMA Univariado")
    plt.legend()
    plt.show()

```

```python
area_id = 1
modelo = "SARIMA_univariado"

df_final = pd.DataFrame(index=predicoes["ndvi_mean"]["pred"].index)

# Adicionar colunas previstas
for nome in indices:
    df_final[nome + "_pred"] = predicoes[nome]["pred"].values

# Adicionar colunas fixas
df_final = df_final.reset_index().rename(columns={"index": "periodo_previsto_inicio"})
df_final["periodo_previsto_fim"] = df_final["periodo_previsto_inicio"] + pd.offsets.MonthEnd(1)
df_final["area_id"] = area_id
df_final["modelo_utilizado"] = modelo

# Criar texto de observações com métricas resumidas
obs_texto = []
for nome in indices:
    mae = predicoes[nome]["mae"]
    rmse = predicoes[nome]["rmse"]
    obs_texto.append(f"{nome}: MAE={mae:.4f}, RMSE={rmse:.4f}")
df_final["observacoes"] = "; ".join(obs_texto)

# Reorganizar colunas conforme a tabela do banco
colunas_banco = [
    "area_id", "modelo_utilizado", "periodo_previsto_inicio", "periodo_previsto_fim",
    "ndvi_mean_pred", "ndvi_median_pred", "ndvi_std_pred",
    "evi_mean_pred", "evi_median_pred", "evi_std_pred",
    "ndwi_mean_pred", "ndwi_median_pred", "ndwi_std_pred",
    "ndmi_mean_pred", "ndmi_median_pred", "ndmi_std_pred",
    "gndvi_mean_pred", "gndvi_median_pred", "gndvi_std_pred",
    "ndre_mean_pred", "ndre_median_pred", "ndre_std_pred",
    "rendvi_mean_pred", "rendvi_median_pred", "rendvi_std_pred",
    "biomassa_pred", "cobertura_vegetal_pred", "observacoes"
]
df_export = df_final[colunas_banco]

# 🔹 Converter colunas de data antes de gerar o JSON
df_export["periodo_previsto_inicio"] = df_export["periodo_previsto_inicio"].dt.strftime("%Y-%m-%d")
df_export["periodo_previsto_fim"] = df_export["periodo_previsto_fim"].dt.strftime("%Y-%m-%d")

# 🔹 Agora sim, converter para JSON
json_saida = df_export.to_dict(orient="records")

# Salvar JSON no diretório desejado
caminho_arquivo = "/home/guilherme/Documentos/Inteli/ANO-1/SEMESTRE-2/M3/teste-api-google-earth/metricas_preditivas_sarima.json"

with open(caminho_arquivo, "w", encoding="utf-8") as f:
    json.dump(json_saida, f, ensure_ascii=False, indent=2)

print(f"✅ JSON salvo em: {caminho_arquivo}")

```

---

## Conclusão

O notebook documentado resume o núcleo funcional do pipeline de aprendizado de máquina do projeto **Effatha**.  
A estrutura adotada garante **reprodutibilidade**, **integração simples via JSON** e **exportação compatível com dashboards ou APIs externas**.

O modelo resultante é um componente essencial da plataforma, permitindo análises quantitativas de desempenho e comportamento agrícola em diferentes áreas de interesse.

---
