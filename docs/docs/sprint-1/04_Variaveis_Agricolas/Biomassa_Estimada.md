---
sidebar_position: 3
slug: /sprint-1/variaveis/biomassa
description: "Estimativa de biomassa via sensoriamento remoto"
---

# Biomassa Estimada

## Definição

### Conceito de Biomassa
A biomassa corresponde à quantidade total de matéria orgânica de origem vegetal ou animal presente em um ecossistema, geralmente expressa em massa por unidade de área. No contexto agrícola, refere-se principalmente ao acúmulo de seca de plantas (fitomassa).

### Métodos de Estimativa
A biomassa pode ser estimada por meio de modelagem matemática e sensoriamento remoto. O sensoriamento remoto tem se destacado por permitir estimativas em grande escala e com alta frequência temporal.

### Unidades de Medida
Normalmente expressa em toneladas por hectare (t/ha), gramas por metro quadrado (g/m²) ou quilogramas de matéria seca por hectare (kg/ha).

### Tipos de Biomassa
- **Aérea:** folhas, caules e partes visíveis da planta.  
- **Subterrânea:** raízes.  
- **Total:** soma da biomassa aérea e subterrânea.  
- **Biomassa residual:** restos de colheita e subprodutos.

## Metodologia de Cálculo

### Modelos Utilizados
- Modelos empíricos (baseados em regressões entre índices espectrais e biomassa observada em campo).  
- Modelos de radiotransferência (simulam interação da radiação com a vegetação).  
- Modelos híbridos que combinam dados de campo e sensoriamento remoto.

### Variáveis de Entrada
- Índices de vegetação (NDVI, EVI, SAVI, etc.).  
- Dados espectrais em diferentes bandas (visível, NIR, SWIR).  
- Dados meteorológicos (radiação solar, temperatura, precipitação).  
- Características do solo e da cultura.

### Algoritmos
- Regressão linear/múltipla.  
- Random Forest e Gradient Boosting.  
- Redes neurais artificiais.  
- Modelos de aprendizado profundo aplicados a imagens de satélite ou drones.

### Calibração
Realizada a partir de dados de campo (coleta de biomassa real) para ajustar modelos e reduzir erros de predição.

## Aplicações Agrícolas

### Estimativa de Produtividade
Permite prever a produção antes da colheita com base no acúmulo de biomassa.

### Planejamento de Colheita
Auxilia na definição do momento ideal para a colheita e logística de maquinário.

### Gestão de Recursos
Otimiza o uso de fertilizantes, irrigação e defensivos agrícolas.

### Análise de Crescimento
Monitora o desenvolvimento da cultura em diferentes estágios fenológicos.

## Precisão e Validação

### Dados de Campo
Servem como referência (ground truth) para validar estimativas via sensoriamento remoto.

### Erros Típicos
- Saturação dos índices espectrais em áreas de alta densidade vegetal.  
- Interferência de nuvens e sombreamento.  
- Variações sazonais não modeladas.

### Fatores de Correção
- Uso de índices ajustados (EVI, NDWI).  
- Normalização por variáveis climáticas.  
- Correção atmosférica dos dados de satélite.

### Intervalos de Confiança
Estimativas são acompanhadas de incertezas estatísticas (RMSE, R², intervalos de 95%).

## Implementação Técnica

### Sensores Utilizados
- Satélites: Sentinel-2, Landsat-8/9, MODIS.  
- Drones com câmeras multiespectrais ou hiperespectrais.  
- Sensores de campo (LiDAR, espectrorradiômetros portáteis).

### Processamento
Envolve pré-processamento de imagens (correção atmosférica, mosaico), extração de índices de vegetação e aplicação de modelos de estimativa.

### Modelos Preditivos
Machine Learning e Deep Learning são aplicados para gerar mapas de biomassa de alta precisão.

### Atualizações
As estimativas podem ser feitas em escala diária, semanal ou mensal, dependendo da fonte de dados (satélite de alta resolução, MODIS, drone).

## Limitações

### Condições Climáticas
Cobertura de nuvens pode prejudicar a aquisição de imagens ópticas. Sensores de radar (SAR) são alternativas para estes casos.

### Tipos de Cultura
Modelos podem ter desempenho variável entre culturas (grãos, cana-de-açúcar, florestas).

### Resolução Espacial
A precisão depende da resolução do sensor: MODIS (250 m), Sentinel-2 (10–20 m), drones (`<10 cm`).

### Variabilidade Temporal
Diferenças no ciclo fenológico podem gerar erros se não forem considerados.

## Casos de Uso

### Diferentes Culturas
- Grãos (milho, soja, trigo).  
- Cana-de-açúcar.  
- Pastagens e florestas plantadas.

### Fases de Crescimento
Monitoramento desde a emergência até a maturação, com ajustes de modelos em cada estágio.

### Condições Ambientais
Uso em áreas irrigadas e de sequeiro, em diferentes tipos de solo e clima.

### Escalas de Aplicação
- Local (talhão agrícola).  
- Regional (município, estado).  
- Nacional (monitoramento de safra). 

## Leitura complementar
1. LOPES, F. et al. FUNÇÃO ALOMÉTRICA DE BIOMASSA COM IMAGENS DE SATÉLITE DE ALTA RESOLUÇÃO ESPACIAL. Ciência Florestal, v. 28, n. 3, p. 960–969, 1 out. 2018. Disponível em: https://doi.org/10.5902/1980509833368.

2. LI, Y. et al. Forest aboveground biomass estimation using Landsat 8 and Sentinel-1A data with machine learning algorithms. Scientific Reports, v. 10, n. 1, 19 jun. 2020. Disponível em: https://www.nature.com/articles/s41598-020-67024-3
‌
