---
sidebar_position: 1
slug: /sprint-2/requisitos/funcionais
description: "Requisitos funcionais do MVP de monitoramento agrícola"
---

# Requisitos Funcionais do MVP

## Seleção de Área

### Definição de Polígonos

**RF001** - O sistema deve permitir que o usuário desenhe polígonos diretamente no mapa para definir áreas de interesse agrícola.

**RF002** - O sistema deve fornecer ferramentas de desenho incluindo: ponto, linha, polígono e retângulo.

**RF003** - O sistema deve permitir edição dos polígonos após sua criação (mover, redimensionar, deletar vértices).

**RF004** - O sistema deve calcular automaticamente a área total do polígono em hectares e metros quadrados.

**RF005** - O sistema deve validar que os polígonos não sejam auto-intersectantes.

### Upload de Shapefile

**RF006** - O sistema deve aceitar upload de arquivos Shapefile (.shp, .shx, .dbf, .prj) para definição de áreas.

**RF007** - O sistema deve validar a integridade dos arquivos Shapefile durante o upload.

**RF008** - O sistema deve suportar sistemas de coordenadas comuns (WGS84, SIRGAS2000, UTM).

**RF009** - O sistema deve reprojetar automaticamente shapefiles para o sistema de coordenadas padrão da aplicação.

**RF010** - O sistema deve extrair e exibir atributos dos shapefiles (nome da propriedade, tipo de cultura, etc.).

### Coordenadas Geográficas

**RF011** - O sistema deve permitir entrada manual de coordenadas geográficas (latitude, longitude).

**RF012** - O sistema deve aceitar coordenadas nos formatos decimal e graus/minutos/segundos.

**RF013** - O sistema deve validar se as coordenadas estão dentro dos limites territoriais do Brasil.

**RF014** - O sistema deve centralizar o mapa automaticamente nas coordenadas inseridas.

**RF015** - O sistema deve permitir definição de buffer (raio) ao redor de pontos de coordenadas.

### Validação de Área

**RF016** - O sistema deve verificar se a área selecionada tem tamanho mínimo de 1 hectare.

**RF017** - O sistema deve verificar se a área selecionada tem tamanho máximo de 50.000 hectares.

**RF018** - O sistema deve validar se a área está localizada em território brasileiro.

**RF019** - O sistema deve alertar sobre sobreposição com áreas de conservação ambiental.

**RF020** - O sistema deve verificar disponibilidade de dados de satélite para a área selecionada.

## Comparação Temporal

### Seleção de Períodos

**RF021** - O sistema deve permitir seleção de datas de início e fim para análise temporal.

**RF022** - O sistema deve fornecer calendário interativo para seleção de datas.

**RF023** - O sistema deve validar que a data de início seja anterior à data de fim.

**RF024** - O sistema deve permitir seleção de períodos pré-definidos (último mês, trimestre, semestre, ano).

**RF025** - O sistema deve verificar disponibilidade de imagens satelitais para o período selecionado.

### Análise de Tendências

**RF026** - O sistema deve calcular tendências de crescimento/declínio dos índices de vegetação.

**RF027** - O sistema deve identificar padrões sazonais nos dados temporais.

**RF028** - O sistema deve detectar anomalias nos padrões esperados de vegetação.

**RF029** - O sistema deve calcular taxas de variação percentual entre períodos.

**RF030** - O sistema deve gerar alertas para mudanças significativas nos índices.

### Comparação Entre Safras

**RF031** - O sistema deve permitir comparação de dados entre safras de anos diferentes.

**RF032** - O sistema deve alinhar automaticamente períodos equivalentes de diferentes anos.

**RF033** - O sistema deve calcular diferenças percentuais entre safras comparadas.

**RF034** - O sistema deve identificar o melhor e pior desempenho histórico da área.

**RF035** - O sistema deve gerar relatórios comparativos entre safras selecionadas.

### Séries Históricas

**RF036** - O sistema deve manter histórico de dados de pelo menos 5 anos.

**RF037** - O sistema deve plotar séries temporais dos índices de vegetação.

**RF038** - O sistema deve permitir exportação de séries históricas em formato CSV.

**RF039** - O sistema deve calcular médias móveis para suavização de dados temporais.

**RF040** - O sistema deve identificar ciclos e padrões recorrentes nos dados históricos.

## Relatórios de Variáveis

### NDVI

**RF041** - O sistema deve calcular o índice NDVI (Normalized Difference Vegetation Index) para a área selecionada.

**RF042** - O sistema deve apresentar valores NDVI em escala de -1 a 1 com precisão de 3 casas decimais.

**RF043** - O sistema deve classificar automaticamente valores NDVI em categorias (solo exposto, vegetação esparsa, vegetação densa).

**RF044** - O sistema deve gerar mapas de calor coloridos baseados nos valores NDVI.

**RF045** - O sistema deve calcular estatísticas descritivas do NDVI (média, mediana, desvio padrão, mínimo, máximo).

**RF046** - O sistema deve permitir definição de limiares personalizados para classificação NDVI.

**RF047** - O sistema deve gerar relatórios históricos de evolução do NDVI ao longo do tempo.

### EVI

**RF048** - O sistema deve calcular o índice EVI (Enhanced Vegetation Index) para a área selecionada.

**RF049** - O sistema deve apresentar valores EVI com precisão de 4 casas decimais.

**RF050** - O sistema deve comparar valores EVI com NDVI para análise complementar.

**RF051** - O sistema deve identificar áreas com saturação de NDVI usando dados EVI.

**RF052** - O sistema deve calcular correlação entre EVI e produtividade esperada.

**RF053** - O sistema deve gerar mapas comparativos EVI vs NDVI lado a lado.

**RF054** - O sistema deve alertar sobre discrepâncias significativas entre EVI e NDVI.

### Biomassa Estimada

**RF055** - O sistema deve estimar biomassa vegetal baseada em modelos validados para agricultura brasileira.

**RF056** - O sistema deve apresentar biomassa em toneladas por hectare.

**RF057** - O sistema deve considerar tipo de cultura para ajuste dos modelos de biomassa.

**RF058** - O sistema deve calcular incremento de biomassa ao longo do tempo.

**RF059** - O sistema deve estimar produtividade potencial baseada na biomassa calculada.

**RF060** - O sistema deve gerar mapas de distribuição espacial da biomassa.

**RF061** - O sistema deve comparar biomassa estimada com dados históricos da região.

### Cobertura Vegetal

**RF062** - O sistema deve calcular percentual de cobertura vegetal na área selecionada.

**RF063** - O sistema deve classificar tipos de cobertura (solo exposto, vegetação, água, construções).

**RF064** - O sistema deve detectar mudanças na cobertura vegetal entre períodos.

**RF065** - O sistema deve calcular índice de fragmentação da vegetação.

**RF066** - O sistema deve identificar áreas de supressão vegetal.

**RF067** - O sistema deve monitorar regeneração natural da vegetação.

**RF068** - O sistema deve gerar relatórios de conformidade com reserva legal e APP.

## Visualizações

### Mapas Interativos

### Gráficos Temporais

### Estatísticas Descritivas

### Exportação de Dados

## Funcionalidades de Apoio

### Busca por Localização

### Salvamento de Projetos

### Compartilhamento de Resultados

### Help e Documentação
