---
sidebar_position: 4
slug: /sprint-2/variaveis/cobertura-vegetal
description: "Análise de cobertura vegetal via satélite"
---

# Cobertura Vegetal

## Definição

### Conceito
Cobertura vegetal refere-se à proporção e ao tipo de vegetação presente em uma determinada área da superfície terrestre. É um indicador do estado ambiental, do uso da terra e da dinâmica de ecossistemas.

### Métodos de Classificação
- **Visual/manual:** interpretação de imagens por especialistas.  
- **Automática:** uso de algoritmos de classificação supervisionada e não supervisionada (ML).  
- **Híbrida:** combinação de interpretação manual e classificação automatizada.  

### Categorias de Cobertura
Podem incluir vegetação natural, áreas agrícolas, florestas, áreas urbanizadas, corpos hídricos e solos expostos, variando conforme a legenda adotada no projeto.

### Métricas Associadas
- Percentual de cobertura em uma área.  
- Fragmentação e conectividade.  
- Índices de diversidade e heterogeneidade espacial.

## Metodologia de Análise

### Classificação Supervisionada
Requer amostras de treinamento de áreas conhecidas, utilizadas para treinar o algoritmo a distinguir classes (algoritmos que podem ser usados incluem Random Forest, SVM entre outros).

### Classificação Não Supervisionada
Agrupa pixels em clusters com base em similaridade espectral, sem necessidade de treinamento (algoritmos que podem ser usados incluem k-means, DBSCAN entre outros).

### Algoritmos de Machine Learning
- Random Forest;
- Support Vector Machines (SVM);
- Redes neurais convolucionais (CNN) para imagens de alta resolução;
- K-means;
- DBSCAN;

### Pós-processamento
Inclui filtragem espacial, suavização de bordas, correção de ruídos e validação cruzada para melhorar a acurácia do mapa final.

## Aplicações Agrícolas

### Mapeamento de Culturas
Identificação e delimitação de áreas cultivadas, distinguindo diferentes tipos de culturas.

### Detecção de Mudanças
Análise multitemporal para identificar desmatamentos, expansão agrícola ou substituição de culturas.

### Monitoramento de Plantio
Avaliação da distribuição espacial do plantio e acompanhamento do ciclo agrícola.

### Análise de Sucessão
Estudo da substituição de espécies vegetais em áreas de pousio ou regeneração natural.

## Classes de Cobertura

### Vegetação Densa
Florestas, matas ciliares e áreas com alta [biomassa](Biomassa_Estimada.md).

### Vegetação Esparsa
Pastagens, cerrado ralo ou áreas de cultivo em início de crescimento.

### Solo Exposto
Áreas agrícolas recém-preparadas, regiões áridas ou de mineração.

### Área Urbana
Cidades, estradas e construções.

### Corpos d'Água
Rios, lagos, reservatórios e áreas alagadas.

## Implementação Técnica

### Bandas Espectrais
- **Visível (RGB):** diferenciação básica de classes.  
- **Infravermelho próximo (NIR):** sensível à vegetação.  
- **Infravermelho de ondas curtas (SWIR):** detecta umidade do solo e vegetação.  

### Índices Utilizados
- NDVI (Normalized Difference Vegetation Index).  
- EVI (Enhanced Vegetation Index).  
- NDWI (Normalized Difference Water Index).  
- SAVI (Soil-Adjusted Vegetation Index).  

### Algoritmos de Classificação
- Árvores de decisão.  
- Random Forest.  
- Redes neurais profundas.  
- Análise por objetos (OBIA, _Object-Based Image Analysis_).  

### Validação
Comparação com dados de campo e imagens de alta resolução, utilizando métricas como acurácia global e coeficiente Kappa.

## Precisão e Qualidade

### Matriz de Confusão
Ferramenta que compara a classificação obtida com dados de referência para avaliar erros de omissão e comissão.

### Acurácia Global
Percentual de acertos totais em relação às amostras validadas.

### Kappa
Coeficiente que mede a concordância além do acaso, útil em avaliações de qualidade.

### Validação de Campo
Coleta de dados in situ para checar a exatidão das classes de cobertura mapeadas.

## Temporal Analysis

### Mudanças Sazonais
Identificação de variações ao longo do ano, como crescimento, colheita e queda foliar.

### Tendências de Longo Prazo
Monitoramento de processos de desmatamento, degradação ambiental ou recuperação florestal.

### Detecção de Anomalias
Identificação de eventos inesperados como incêndios, pragas ou alagamentos.

### Comparações Interanuais
Avaliação da dinâmica de cobertura vegetal entre diferentes anos agrícolas ou períodos históricos.

## Leitura complementar
1. ALMALKI, R. et al. Monitoring and Mapping Vegetation Cover Changes in Arid and Semi-Arid Areas Using Remote Sensing Technology: A Review. Remote Sensing, v. 14, n. 20, p. 5143, 14 out. 2022. Disponível em: https://www.mdpi.com/2072-4292/14/20/5143

2. AZIZ, G. et al. Remote sensing based forest cover classification using machine learning. Scientific Reports, v. 14, n. 1, p. 69, 2 jan. 2024. Disponível em: https://www.nature.com/articles/s41598-023-50863-1