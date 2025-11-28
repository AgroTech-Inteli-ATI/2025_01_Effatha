---
sidebar_position: 1
slug: /sistema/funcionalidades
description: "Principais funcionalidades"
---

# Funcionalidades

A plataforma AgroTech oferece um conjunto completo de funcionalidades para análise agrícola via imagens de satélite, permitindo monitoramento, análise temporal e geração de relatórios detalhados.

## 📍 Gestão de Propriedades e Áreas

### Propriedades
- **Cadastro de propriedades agrícolas** com informações do responsável
- **Gestão hierárquica**: uma propriedade pode conter múltiplas áreas
- **Rastreamento temporal**: data de criação e histórico de modificações

### Áreas
- **Importação de polígonos** via arquivos KML/KMZ
- **Definição manual** de coordenadas geográficas (GeoJSON)
- **Informações detalhadas**:
  - Localização (município, estado)
  - Cultura principal cultivada
  - Observações e anotações
  - Anexo de imagens de referência
- **Visualização em mapas interativos**

## 🌿 Métricas Vegetativas

A plataforma calcula automaticamente diversos índices de vegetação utilizando imagens de satélite (Sentinel-2, Landsat):

### NDVI (Normalized Difference Vegetation Index)
- **Objetivo**: Medir a densidade e saúde da vegetação
- **Valores**: -1 a +1 (quanto maior, mais vegetação saudável)
- **Estatísticas**: média, mediana e desvio padrão
- **Aplicação**: Identificação de áreas com estresse hídrico ou problemas de crescimento

### EVI (Enhanced Vegetation Index)
- **Objetivo**: Versão aprimorada do NDVI, menos sensível à atmosfera
- **Melhor para**: Áreas com alta biomassa
- **Estatísticas**: média, mediana e desvio padrão

### NDWI (Normalized Difference Water Index)
- **Objetivo**: Avaliar o conteúdo de água na vegetação
- **Aplicação**: Monitoramento de estresse hídrico e irrigação

### NDMI (Normalized Difference Moisture Index)
- **Objetivo**: Medir umidade da vegetação
- **Aplicação**: Detecção precoce de seca

### SAVI (Soil-Adjusted Vegetation Index)
- **Objetivo**: Índice ajustado para minimizar influência do solo
- **Melhor para**: Áreas com vegetação esparsa

### Cobertura Vegetal
- **Cálculo**: Percentual da área coberta por vegetação
- **Métodos**: Baseado em thresholds de NDVI

### Biomassa Estimada
- **Cálculo**: Estimativa de biomassa vegetal (kg/m² ou ton/ha)
- **Baseado em**: Modelos de regressão com índices vegetativos

## 🗺️ Métricas de Solo

### Teor de Argila
- **Fonte**: OpenLandMap (dataset global de propriedades do solo)
- **Profundidades disponíveis**:
  - 0-5 cm
  - 5-15 cm
  - 15-30 cm
  - 30-60 cm
  - 60-100 cm
  - 100-200 cm
- **Estatísticas**: média, mínimo e máximo por área
- **Aplicação**: Planejamento de manejo e irrigação

## 📊 Análise Temporal

### Comparação Antes/Depois
- **Seleção de períodos**: Definir datas de início e fim
- **Visualização lado a lado**: Imagens e métricas comparativas
- **Detecção de mudanças**: Identificação automática de variações significativas

### Séries Temporais
- **Histórico completo**: Armazenamento de todas as métricas por período
- **Gráficos evolutivos**: Visualização de tendências ao longo do tempo
- **Periodicidade**: Semanal, mensal ou personalizada

## 🔮 Modelos Preditivos

### SARIMA (Seasonal AutoRegressive Integrated Moving Average)
- **Objetivo**: Previsão de métricas futuras baseadas em histórico
- **Aplicações**:
  - Previsão de NDVI
  - Estimativa de produtividade
  - Planejamento de safra
- **Parâmetros ajustáveis**:
  - Horizonte de previsão
  - Sazonalidade
  - Confiança estatística

### Métricas Preditivas Armazenadas
- **Tabela dedicada** para armazenar previsões
- **Validação**: Comparação entre previsto vs. real
- **Histórico**: Todas as previsões são mantidas para análise posterior

## 📄 Relatórios

### Tipos de Relatórios
1. **Relatório de Área**
   - Resumo de todas as métricas
   - Comparações temporais
   - Gráficos e visualizações

2. **Relatório Comparativo**
   - Múltiplas áreas
   - Benchmarking interno

3. **Relatório Preditivo**
   - Previsões futuras
   - Intervalos de confiança
   - Recomendações baseadas em IA

### Formatos de Exportação
- **PDF**: Relatórios formatados e prontos para impressão
- **Excel/CSV**: Dados tabulares para análise customizada
- **JSON**: Integração com outros sistemas

### Conteúdo dos Relatórios
- Metadados da área (localização, cultura, responsável)
- Tabelas com métricas históricas
- Gráficos de evolução temporal
- Mapas de calor (heatmaps)
- Análise estatística
- Previsões e tendências

## 🔐 Autenticação e Segurança

### Controle de Acesso
- **Firebase Authentication**: Login seguro via e-mail/senha
- **Sessões JWT**: Tokens de autenticação para APIs
- **Permissões por usuário**: Acesso controlado por propriedade/área

### Firestore Integration
- **Sincronização em tempo real** para dados de usuários
- **Backup automático** de configurações

## 🌐 Integração Google Earth Engine

### Processamento na Nuvem
- **Acesso direto** a petabytes de dados de satélite
- **Processamento otimizado**: Cálculos realizados nos servidores do Google
- **Sem download**: Imagens processadas remotamente

### Fontes de Dados
- **Sentinel-2**: Resolução de 10-20m, revisita de 5 dias
- **Landsat 8/9**: Resolução de 30m, histórico desde 1984
- **MODIS**: Dados diários, resolução de 250-500m
- **OpenLandMap**: Propriedades do solo

### Filtros e Máscaras
- **Filtro de nuvens**: Remoção automática de pixels com nuvens
- **Filtro temporal**: Seleção de imagens por período
- **Máscara de qualidade**: Uso de bandas QA para melhor precisão

## 📡 APIs RESTful

### Endpoints Disponíveis

#### Propriedades
- `GET /api/propriedade` - Listar propriedades
- `POST /api/propriedade` - Criar propriedade
- `GET /api/propriedade/{id}` - Detalhes
- `PUT /api/propriedade/{id}` - Atualizar
- `DELETE /api/propriedade/{id}` - Deletar

#### Áreas
- `GET /api/area` - Listar áreas
- `POST /api/area` - Criar área
- `GET /api/area/{id}` - Detalhes
- `PUT /api/area/{id}` - Atualizar
- `DELETE /api/area/{id}` - Deletar
- `POST /api/area/import-kml` - Importar KML

#### Métricas
- `GET /api/metricas/area/{area_id}` - Métricas por área
- `POST /api/metricas/calcular` - Calcular novas métricas
- `GET /api/metricas/periodo` - Filtrar por período

#### Métricas de Solo
- `GET /api/metricas-solo/area/{area_id}` - Métricas de solo

#### Relatórios
- `GET /api/relatorios` - Listar relatórios
- `POST /api/relatorios/gerar` - Gerar novo relatório
- `GET /api/relatorios/{id}/download` - Download do relatório

## 🎨 Interface Web (Frontend)

### Dashboard Interativo
- **Visão geral** de todas as propriedades e áreas
- **Cards informativos** com métricas principais
- **Gráficos interativos** (Chart.js, Recharts)
- **Mapas dinâmicos** (Leaflet, Mapbox)

### Navegação
- **Menu lateral** com acesso rápido
- **Breadcrumbs** para navegação hierárquica
- **Busca global** por propriedades/áreas

### Responsividade
- **Design adaptativo** para desktop, tablet e mobile
- **Tailwind CSS** para estilização moderna
- **Componentes shadcn/ui** para interface consistente

## 🔄 Processamento em Background

### Tarefas Assíncronas
- **Cálculo de métricas**: Processamento em lote de áreas
- **Geração de relatórios**: Criação de PDFs sem bloquear a interface
- **Atualização periódica**: Métricas podem ser calculadas automaticamente

### Notificações
- **Status de processamento**: Feedback em tempo real
- **Conclusão de tarefas**: Notificações quando relatórios estiverem prontos
- **Alertas**: Avisos sobre anomalias detectadas