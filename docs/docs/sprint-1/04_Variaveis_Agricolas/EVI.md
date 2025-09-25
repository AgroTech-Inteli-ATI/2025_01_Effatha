---
sidebar_position: 2
slug: /sprint-1/variaveis/evi
description: "Enhanced Vegetation Index - definição e aplicações"
---

# EVI - Enhanced Vegetation Index

## Definição

### Conceito
O EVI (Enhanced Vegetation Index) é um índice espectral desenvolvido para melhorar as limitações do NDVI em áreas de alta densidade de vegetação. Ele aumenta a sensibilidade em regiões com grande acúmulo de biomassa e corrige interferências atmosféricas e do solo.

### Fórmula de Cálculo
A fórmula mais comum do EVI é [[1]](#leitura-complementar):  

EVI = G * (NIR - RED) / (NIR + C_1 * RED - C_2 * BLUE + L)

Na qual:  
- **NIR** = refletância no infravermelho próximo  
- **RED** = refletância no vermelho  
- **BLUE** = refletância no azul  
- **G** = fator de ganho (geralmente 2.5)  
- **C1 e C2** = coeficientes de correção atmosférica (6 e 7.5, respectivamente)  
- **L** = fator de correção do solo (1)  

### Bandas Espectrais Utilizadas
- Banda Vermelha (RED)  
- Banda Azul (BLUE)  
- Banda Infravermelho Próximo (NIR)  

### Melhorias em Relação ao NDVI
- Reduz saturação em áreas com alta biomassa.  
- Melhora a correção atmosférica (uso da banda azul).  
- Aumenta a linearidade entre valores espectrais e biomassa.  

## Aplicações Agrícolas

### Monitoramento Aprimorado
Permite acompanhar o vigor da vegetação com maior precisão em áreas densamente cultivadas.

### Áreas de Alta Biomassa
Funciona melhor que o [NDVI](NDVI.md) em florestas e culturas densas (como cana-de-açúcar, milho e soja em fase avançada).

### Redução de Ruído Atmosférico
Corrige parcialmente interferências causadas por partículas e aerossóis na atmosfera.

### Sensibilidade Melhorada
Mantém boa resposta espectral mesmo em cenários de saturação do [NDVI](NDVI.md).

## Vantagens e Limitações

### Vantagens sobre NDVI
- Maior precisão em ambientes florestais e agrícolas de alta densidade.  
- Melhor desempenho em condições atmosféricas adversas.  
- Reduz efeitos de fundo do solo.  

### Limitações Específicas
- Mais dependente da qualidade da banda azul, que pode ser sensível a nuvens e sombras.  
- Menor disponibilidade em sensores antigos que não captam o espectro azul.  
- Mais complexo de calcular do que o [NDVI](NDVI.md).  

### Quando Utilizar
- Monitoramento de florestas tropicais e temperadas.  
- Cultivos densos ou em estágio avançado (No contexto do projeto, pode ser mais indicado dependendo da cultura).  
- Regiões com maior interferência atmosférica.  

### Complementaridade
O EVI é frequentemente utilizado em conjunto com o [NDVI](NDVI.md), fornecendo uma análise complementar da vegetação.  

## Implementação Técnica

### Satélites Compatíveis
- **MODIS (Terra e Aqua)** (onde o índice foi originalmente desenvolvido.)  
- **Landsat 8/9** (bandas RED, BLUE, NIR).  
- **Sentinel-2** (bandas correspondentes).  
- Outros sensores multiespectrais com as bandas necessárias também são compatíveis. A análise deve ser feita caso a caso.  

### Parâmetros de Cálculo
Valores padrão:  
- $G$ = 2.5  
- $C1$ = 6  
- $C2$ = 7.5  
- $L$ = 1  

### Processamento
- Correção atmosférica prévia das imagens.  
- Reamostragem e alinhamento de bandas.  
- Cálculo pixel a pixel do índice.  

### Calibração
É recomendada a validação com dados de campo (biomassa, LAI, produtividade agrícola) para ajuste regional.

## Casos de Uso

### Florestas
Avaliação de densidade, vigor e desmatamento em áreas de cobertura florestal.

### Culturas Densas
Monitoramento de soja, milho, cana-de-açúcar, arroz irrigado e culturas perenes.

### Monitoramento Sazonal
Estudo da variação do crescimento ao longo do ciclo agrícola ou entre estações.

### Estudos Comparativos
Comparações entre NDVI e EVI para avaliar limitações e complementaridade em diferentes cenários.  

## Validação

### Benchmarks
Utilização de dados MODIS (coleção oficial do EVI) como referência global.

### Estudos de Caso
Experimentos em campo com culturas agrícolas e florestais comprovam a maior eficiência do EVI em relação ao NDVI.

### Correlações
EVI apresenta correlação mais linear com parâmetros biofísicos, como biomassa seca e índice de área foliar (LAI).

### Métricas de Qualidade
- R² entre EVI e biomassa observada.  
- RMSE em validações de campo.  
- Índices de concordância estatística (ex.: Willmott’s Index).  

## Leitura complementar
1. L, J. *Enhanced Vegetation Index (EVI): A Modern Approach to Vegetation Health Monitoring - Geospatial Artificial Intelligence | GeoAI*.  
   Disponível em: [https://geoai.au/enhanced-vegetation-index-evi-a-modern-approach-to-vegetation-health-monitoring/](https://geoai.au/enhanced-vegetation-index-evi-a-modern-approach-to-vegetation-health-monitoring/).

