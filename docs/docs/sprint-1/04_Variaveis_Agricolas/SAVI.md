---
sidebar_position: 5
slug: /sprint-2/variaveis/savi
description: "Soil-Adjusted Vegetation Index - definição e aplicações"
---

# SAVI - Soil-Adjusted Vegetation Index

## Definição

### Conceito
O SAVI (Soil-Adjusted Vegetation Index) é um índice espectral derivado do NDVI, projetado para reduzir a influência do solo em áreas com vegetação esparsa. Ele inclui um fator de ajuste do solo (L) que minimiza o efeito do solo exposto sobre o valor do índice.

### Fórmula de Cálculo
```math
\text{SAVI} = \frac{(NIR - RED) \cdot (1 + L)}{(NIR + RED + L)}
```

Na qual $L$ é o fator de correção do solo, geralmente entre 0 e 1 (tipicamente 0,5 em vegetação moderada).

### Bandas Espectrais Utilizadas
* NIR (Infravermelho Próximo)
* RED (Vermelho)

### Interpretação dos Valores
* Valores próximos a +1 indicam vegetação densa e saudável.
* Valores próximos a 0 indicam solo exposto ou vegetação muito rala.
* Valores negativos podem indicar corpos d’água ou áreas sem vegetação.

## Aplicações Agrícolas

### Monitoramento de Vigor Vegetal
Permite acompanhar a vegetação em áreas com cobertura parcial do solo, como em estágios iniciais do cultivo.

### Detecção de Estresse
Identifica déficit hídrico, pragas ou doenças, com menor interferência do solo do que o NDVI.

### Estimativa de Biomassa
Melhor estimativa em regiões com solo visível, especialmente em culturas de baixa densidade.

### Previsão de Produtividade
Auxilia na previsão de rendimento em condições de cobertura intermediária ou variável.

## Vantagens e Limitações

### Vantagens
* Reduz influência do solo em áreas de cobertura parcial.
* Melhor sensibilidade em regiões de vegetação rala.
* Compatível com os mesmos sensores utilizados para NDVI.

### Limitações Específicas
* Menos necessário em áreas de vegetação densa, onde o NDVI já é confiável.
* Escolha do fator L pode variar conforme tipo de solo e estação do ano.
* Sensível a erros radiométricos e atmosferas contaminadas.

### Quando Utilizar
* Em regiões com solos expostos frequentes, como campos agrícolas recém-plantados ou pastagens ralas.
* Para complementar NDVI em análises comparativas de cobertura intermediária.

### Complementaridade
* Pode ser usado em conjunto com NDVI, EVI e outros índices para robustez em análises multivariadas.

## Implementação Técnica

### Satélites Compatíveis
* Landsat (5, 7, 8, 9)
* Sentinel-2 (MSI)
* MODIS (Terra e Aqua)
* Sensores comerciais e drones com bandas RED e NIR

### Parâmetros de Cálculo
* Definição do fator L de acordo com densidade da vegetação.
* Correção radiométrica e atmosférica das imagens.

### Processamento
* Alinhamento espacial das bandas NIR e RED.
* Cálculo pixel a pixel do SAVI.
* Aplicação de filtros para nuvens e sombras.

### Calibração
* Validação com dados de campo: biomassa, LAI, produtividade.
* Ajuste do fator L conforme as condições locais de solo e cultivo.

## Casos de Uso

### Milho
Monitoramento inicial do crescimento e cobertura do solo.

### Soja
Estágios iniciais de plantio, especialmente em regiões de solo parcialmente exposto.

### Cana-de-açúcar
Suporte à estimativa de biomassa em áreas com cobertura parcial de solo.

### Outras Culturas
Arroz, trigo, pastagens e horticultura com cobertura intermediária.

## Validação

### Dados de Campo
Medições de biomassa, altura de planta e índice de área foliar (LAI) para calibração do SAVI.

### Correlações
Maior precisão que o NDVI em áreas de cobertura parcial; boas correlações com biomassa e vigor.

### Precisão
Depende do fator L escolhido, qualidade do sensor e pré-processamento.

### Confiabilidade
Robusto em áreas de vegetação esparsa, especialmente quando combinado com NDVI e EVI.

## Leitura complementar
1. WIKIPEDIA CONTRIBUTORS. Soil-adjusted vegetation index. Disponível em: <https://en.wikipedia.org/wiki/Soil-adjusted_vegetation_index>.
2. USGS. Landsat Soil Adjusted Vegetation Index | U.S. Geological Survey. Disponível em: <https://www.usgs.gov/landsat-missions/landsat-soil-adjusted-vegetation-index>.