---
sidebar_position: 1
slug: /sprint-1/variaveis/ndvi
description: "Normalized Difference Vegetation Index - definição e aplicações"
---

# NDVI - Normalized Difference Vegetation Index

## Definição

### Conceito
O **NDVI (Normalized Difference Vegetation Index)** é um índice espectral usado para medir a "saúde" e o vigor da vegetação. Ele se baseia na diferença de refletância entre o vermelho (RED), que é absorvido pela clorofila, e o infravermelho próximo (NIR), que é fortemente refletido pelas folhas.

### Fórmula de Cálculo
NDVI = (NIR - RED) / (NIR + RED)

### Bandas Espectrais Utilizadas
- NIR (Infravermelho Próximo) 
- RED (Vermelho)

### Interpretação dos Valores
- Valores próximos a +1 indicam uma vegetação densa e saudável.  
- Valores próximos a 0 indicam áreas sem vegetação significativa (solo exposto).  
- Valores negativos indicam corpos d’água, neve ou nuvens.  

## Aplicações Agrícolas

### Monitoramento de Vigor Vegetal
Acompanha o desenvolvimento das culturas ao longo do ciclo agrícola.

### Detecção de Estresse
Identifica deficiências nutricionais, hídrica ou danos por pragas e doenças.

### Estimativa de Biomassa
Relaciona-se ao acúmulo de matéria seca da planta.

### Previsão de Produtividade
Permite antecipar a estimativa de rendimento das culturas.

## Vantagens e Limitações

### Vantagens
- Simples de calcular e interpretar.  
- Ampla disponibilidade em diferentes sensores e satélites.  
- Útil para análises comparativas em grandes áreas e séries temporais longas.  

### Limitações Conhecidas
- Saturação em áreas de alta biomassa (nesses casos ocorre perda de sensibilidade).  
- Influência de condições atmosféricas e de iluminação.  
- Dificuldade em diferenciar culturas em estágios iniciais.  

### Fatores de Interferência
- Presença de nuvens e sombras.  
- Propriedades do solo exposto (brilho e umidade).  
- Variações sazonais não modeladas.  

### Melhores Práticas
- Uso combinado com outros índices ([EVI](EVI.md), [SAVI](SAVI.md)).  
- Correções atmosféricas e de solo.  
- Validação com dados de campo para maior confiabilidade.  

## Implementação Técnica

### Satélites Utilizados
- Landsat (5, 7, 8, 9)  
- Sentinel-2 (MSI)  
- MODIS (Terra e Aqua)
- PlanetScope, RapidEye e outros sensores comerciais  

### Resolução Temporal
- MODIS: 1–2 dias.  
- Sentinel-2: 5 dias.  
- Landsat: 16 dias.  

### Resolução Espacial
- MODIS: 250-500 m.  
- Sentinel-2: 10-20 m.  
- Landsat: 30 m.  
- Drones: `<10 cm`.  

### Processamento de Dados
- Correção atmosférica e radiométrica.  
- Alinhamento espacial das bandas.  
- Cálculo pixel a pixel do índice.  

## Casos de Uso

### Milho
Acompanhamento do crescimento, detecção de estresse hídrico e previsão de rendimento.

### Soja
Monitoramento do ciclo fenológico e previsão de produtividade.

### Cana-de-açúcar
Avaliação da biomassa e planejamento de colheita.

### Outras Culturas
Aplicável em arroz, trigo, pastagens e fruticultura.  

## Validação

### Dados de Campo
Amostras de biomassa, altura de planta, índice de área foliar (LAI) e produtividade.

### Correlações
Alta correlação entre NDVI e parâmetros biofísicos em estágios intermediários de crescimento.

### Precisão
Depende da qualidade do sensor, do pré-processamento e da calibração regional.

### Confiabilidade
NDVI é considerado um índice robusto, tendo décadas de validação em diferentes biomas e aplicações agrícolas.

## Leitura complementar
1. KATERYNA SERGIEIEVA. *NDVI Explicado: Como O Índice Ajuda A Monitorar A Saúde Das Lavouras*.  
   Disponível em: [https://eos.com/pt/blog/indice-de-vegetacao-por-diferenca-normalizada-ou-ndvi/](https://eos.com/pt/blog/indice-de-vegetacao-por-diferenca-normalizada-ou-ndvi/).

2. *Índice de estado da vegetação (NDVI) | Observatório de Clima e Saúde*.  
   Disponível em: [https://climaesaude.icict.fiocruz.br/indicador/indice-de-estado-da-vegetacao-ndvi](https://climaesaude.icict.fiocruz.br/indicador/indice-de-estado-da-vegetacao-ndvi).

3. GABRIELA. *O que é NDVI? Descubra sua importância no campo*.  
   Disponível em: [https://digifarmz.com/o-que-e-ndvi/](https://digifarmz.com/o-que-e-ndvi/).
