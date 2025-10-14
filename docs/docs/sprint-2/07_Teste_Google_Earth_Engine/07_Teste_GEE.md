---
sidebar_position: 2
slug: /sprint-2/teste_gee/teste_google_earth_engine
description: "Teste com Google Earth Engine (GEE) para cálculo de índices de vegetação e análise temporal usando Sentinel‑2."
---

# Teste com Google Earth Engine (GEE)

## Visão Geral

Este documento descreve o experimento realizado no notebook para testar a API do Google Earth Engine (GEE) no contexto do projeto Effatha. O objetivo foi validar a coleta de imagens Sentinel‑2, o pré-processamento básico e o cálculo de índices espectrais de vegetação, além de uma comparação temporal simples de NDVI.

O teste serve como base para as análises do MVP, conectando a etapa de aquisição e processamento de dados satelitais à geração de métricas agronômicas descritas na Sprint 1.

## Objetivos

- Autenticar e inicializar a sessão do GEE em Python.
- Definir uma Área de Interesse (AOI) a partir de coordenadas geográficas.
- Selecionar imagens Sentinel‑2 dentro de um intervalo de tempo com controle de nebulosidade.
- Extrair bandas necessárias e calcular índices espectrais: NDVI, EVI, NDWI, NDMI, GNDVI, NDRE e RENDVI.
- Criar um proxy simples de biomassa a partir de NDVI e NDRE normalizados.
- Comparar o NDVI médio entre dois períodos (antes vs. depois) e visualizar a diferença.

## Ambiente e Pré‑requisitos

- Python com as bibliotecas: `earthengine-api` e `matplotlib`.
- Acesso a um projeto Google Cloud habilitado para Earth Engine.
- VS Code/Jupyter para executar o notebook.

Autenticação e inicialização no início do notebook:

```python
import ee
ee.Authenticate()                 # abrirá o navegador para login
ee.Initialize(project='')
```

## Metodologia

### 1. Definição da AOI

A AOI foi definida como um polígono (coordenadas obtidas no Code Editor do GEE), por exemplo:

```python
coords = [[
	[-39.28604579767139, -7.043724891671749],
	[-39.28604579767139, -7.043724891671749],
	[-39.28604311546238, -7.043756835262702],
	[-39.28591436942966, -7.043735539535638],
	[-39.285923757161214, -7.043698272010933],
	[-39.28604579767139, -7.043724891671749]
]]
aoi = ee.Geometry.Polygon(coords)
```

Obs.: As coordenadas são exemplos do notebook e podem ser substituídas conforme a área de estudo.

### 2. Seleção de imagens Sentinel‑2 e filtros

Foi utilizada a coleção `COPERNICUS/S2_SR_HARMONIZED` (nível surface reflectance) filtrando por:

- Intervalo de datas (ex.: maio/2024)
- Intersecção com a AOI
- Percentual de nuvem (`CLOUDY_PIXEL_PERCENTAGE <= 20`)

Em seguida, selecionou-se a “melhor” cena ordenando por nebulosidade e extraindo as bandas necessárias convertidas para reflectância (escala 0–1): B2 (Blue), B3 (Green), B4 (Red), B5/B6 (Red‑Edge), B8 (NIR) e B11 (SWIR1).

### 3. Cálculo dos índices espectrais

Para cada índice, foram calculadas estatísticas na AOI (mínimo, máximo e média) usando `reduceRegion`. Abaixo, os índices implementados:

- NDVI: (NIR − RED) / (NIR + RED)
- EVI: 2.5 × (NIR − RED) / (NIR + 6×RED − 7.5×BLUE + 1)
- NDWI: (GREEN − NIR) / (GREEN + NIR)
- NDMI: (NIR − SWIR1) / (NIR + SWIR1)
- GNDVI: (NIR − GREEN) / (NIR + GREEN)
- NDRE: (NIR − RE1) / (NIR + RE1)
- RENDVI: (NIR − RE2) / (NIR + RE2)

Para explicações conceituais mais detalhadas, ver também os materiais da Sprint 1: [NDVI](../../sprint-1/04_Variaveis_Agricolas/NDVI.md) e [EVI](../../sprint-1/04_Variaveis_Agricolas/EVI.md).

### 4. Proxy de Biomassa

Foi adotada uma normalização min‑max dos mapas de NDVI e NDRE dentro da AOI. Em seguida, calculou‑se a média simples dos dois índices normalizados, resultando em um proxy de biomassa em escala 0–1 e uma versão 0–100 (score):

```python
biomassa_proxy = (ndvi_norm.add(ndre_norm).divide(2)).rename('BIOMASSA_PROXY')
biomassa_score = biomassa_proxy.multiply(100).rename('BIOMASSA_SCORE')
```

Observação: Trata‑se de uma proxy simples para demonstração; calibrações específicas por cultura/estágio fenológico são recomendadas para uso operacional.

### 5. Comparação temporal (ΔNDVI)

Foram definidos dois períodos (ex.: 2024‑05 e 2024‑10). Para cada período:

1. filtrou‑se a coleção por data/AOI/nebuloisdade,
2. aplicou‑se uma máscara básica de nuvens (QA60) e
3. gerou‑se um compósito temporal (mediana). O NDVI de cada período foi então calculado e subtraído (depois − antes) para estimar a variação.

Por fim, foram extraídas estatísticas do ΔNDVI na AOI.

## Resultados e Saídas do Notebook

O notebook imprime, para cada índice, estatísticas na AOI (mínimo, máximo e média). Além disso, é gerado um gráfico de barras comparando o NDVI médio antes vs. depois, auxiliando a visualização da mudança no vigor da vegetação.

Os valores numéricos dependem da área e das datas selecionadas e, portanto, podem variar a cada execução.

## Conclusão

O experimento no GEE demonstrou a viabilidade de integrar aquisição e processamento de imagens Sentinel‑2 ao cálculo de índices espectrais relevantes ao monitoramento agrícola. A partir da AOI e de filtros simples, foi possível obter métricas (NDVI, EVI, NDWI, NDMI, GNDVI, NDRE, RENDVI), compor um proxy de biomassa e analisar a variação de NDVI entre períodos.

Esse fluxo fornece uma base sólida para evoluir o pipeline de análise do Effatha, permitindo refinamentos em mascaramento de nuvens, calibração de indicadores por cultura e expansão para séries temporais mais longas e análises preditivas.

## Referências

- Google Earth Engine Data Catalog – Sentinel‑2 SR Harmonized
- Documentação da API Python do Earth Engine
- Materiais da Sprint 1: [NDVI](../../sprint-1/04_Variaveis_Agricolas/NDVI.md), [EVI](../../sprint-1/04_Variaveis_Agricolas/EVI.md), [Biomassa Estimada](../../sprint-1/04_Variaveis_Agricolas/Biomassa_Estimada.md)
