#!/bin/bash

# Script para criar estrutura da Sprint 2 - MVP Monitoramento Agrícola via Satélite
echo "🚀 Criando estrutura Sprint 2 - MVP Agro..."

# Criar diretório base se não existir
mkdir -p docs/sprint-2

# 📁 01_Sobre_Sprint2
echo "📁 Criando pasta 01_Sobre_Sprint2..."
mkdir -p docs/sprint-2/01_Sobre_Sprint2

# _category_.json para 01_Sobre_Sprint2
cat > docs/sprint-2/01_Sobre_Sprint2/_category_.json << 'EOF'
{
  "label": "Sobre Sprint 2",
  "position": 1,
  "link": {
    "type": "generated-index",
    "description": "Visão geral da Sprint 2, objetivos do MVP de monitoramento agrícola via satélite."
  }
}
EOF

# Intro_Sprint2.md
cat > docs/sprint-2/01_Sobre_Sprint2/Intro_Sprint2.md << 'EOF'
---
sidebar_position: 1
slug: /sprint-2/sobre/intro
description: "Introdução à Sprint 2 - MVP Monitoramento Agrícola"
---

# Introdução Sprint 2

## Objetivos da Sprint 2

### Objetivo Principal

### Escopo do MVP

### Entregáveis Principais

## Contexto do Monitoramento Agrícola

### Desafios Atuais

### Oportunidades com Sensoriamento Remoto

### Benefícios Esperados

## Cronograma da Sprint

### Atividades Principais

### Marcos de Entrega

### Dependências

## Metodologia de Trabalho

### Abordagem Ágil

### Ferramentas Utilizadas

### Critérios de Sucesso
EOF

# Escopo_MVP.md
cat > docs/sprint-2/01_Sobre_Sprint2/Escopo_MVP.md << 'EOF'
---
sidebar_position: 2
slug: /sprint-2/sobre/escopo-mvp
description: "Definição do escopo do MVP de monitoramento agrícola"
---

# Escopo do MVP

## Funcionalidades Mínimas

### Seleção de Área

### Comparação Temporal

### Relatórios de Variáveis

### Visualizações

## Variáveis Monitoradas

### NDVI (Normalized Difference Vegetation Index)

### EVI (Enhanced Vegetation Index)

### Biomassa Estimada

### Cobertura Vegetal

## Limitações do MVP

### Funcionalidades Fora do Escopo

### Limitações Técnicas

### Restrições de Dados

## Roadmap Futuro

### Funcionalidades Planejadas

### Evoluções Técnicas

### Integrações Futuras
EOF

# 📁 02_Requisitos_MVP_Agro
echo "📁 Criando pasta 02_Requisitos_MVP_Agro..."
mkdir -p docs/sprint-2/02_Requisitos_MVP_Agro

# _category_.json para 02_Requisitos_MVP_Agro
cat > docs/sprint-2/02_Requisitos_MVP_Agro/_category_.json << 'EOF'
{
  "label": "Requisitos do MVP Agro",
  "position": 2,
  "link": {
    "type": "generated-index",
    "description": "Especificação dos requisitos funcionais e não funcionais do MVP de monitoramento agrícola."
  }
}
EOF

# Requisitos_Funcionais_MVP.md
cat > docs/sprint-2/02_Requisitos_MVP_Agro/Requisitos_Funcionais_MVP.md << 'EOF'
---
sidebar_position: 1
slug: /sprint-2/requisitos/funcionais
description: "Requisitos funcionais do MVP de monitoramento agrícola"
---

# Requisitos Funcionais do MVP

## Seleção de Área

### Definição de Polígonos

### Upload de Shapefile

### Coordenadas Geográficas

### Validação de Área

## Comparação Temporal

### Seleção de Períodos

### Análise de Tendências

### Comparação Entre Safras

### Séries Históricas

## Relatórios de Variáveis

### NDVI

### EVI

### Biomassa Estimada

### Cobertura Vegetal

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
EOF

# Requisitos_Nao_Funcionais_MVP.md
cat > docs/sprint-2/02_Requisitos_MVP_Agro/Requisitos_Nao_Funcionais_MVP.md << 'EOF'
---
sidebar_position: 2
slug: /sprint-2/requisitos/nao-funcionais
description: "Requisitos não funcionais do MVP de monitoramento agrícola"
---

# Requisitos Não Funcionais do MVP

## Usabilidade

### Interface Intuitiva

### Navegação Simples

### Feedback Visual

### Responsividade

## Desempenho Básico

### Tempo de Resposta

### Processamento de Dados

### Carregamento de Mapas

### Capacidade de Área

## Simplicidade da Interface

### Design Minimalista

### Fluxo Direto

### Redução de Cliques

### Clareza Visual

## Compatibilidade

### Navegadores Suportados

### Resoluções de Tela

### Dispositivos

### Sistemas Operacionais

## Confiabilidade

### Disponibilidade

### Tratamento de Erros

### Recuperação de Falhas

### Backup de Dados

## Segurança

### Proteção de Dados

### Controle de Acesso

### Privacidade

### Conformidade
EOF

# User_Stories_MVP.md
cat > docs/sprint-2/02_Requisitos_MVP_Agro/User_Stories_MVP.md << 'EOF'
---
sidebar_position: 3
slug: /sprint-2/requisitos/user-stories
description: "User stories do MVP organizadas por persona"
---

# User Stories do MVP

## Produtor Rural

### Monitoramento da Propriedade

### Análise de Produtividade

### Comparação Safras

### Tomada de Decisão

## Investidor

### Avaliação de Investimentos

### Monitoramento de Ativos

### Análise de Riscos

### Relatórios Gerenciais

## Cientista/Pesquisador

### Coleta de Dados

### Análise Temporal

### Validação de Hipóteses

### Publicação de Resultados

## User Stories Transversais

### Acesso à Plataforma

### Configurações Básicas

### Suporte e Ajuda

### Feedback do Sistema

## Critérios de Aceite

### Definições de Pronto

### Testes de Aceitação

### Validação com Usuários

### Performance Mínima
EOF

# Casos_Uso.md
cat > docs/sprint-2/02_Requisitos_MVP_Agro/Casos_Uso.md << 'EOF'
---
sidebar_position: 4
slug: /sprint-2/requisitos/casos-uso
description: "Casos de uso detalhados do MVP"
---

# Casos de Uso

## UC01 - Selecionar Área de Interesse

### Ator Principal

### Pré-condições

### Fluxo Principal

### Fluxos Alternativos

### Pós-condições

## UC02 - Analisar Índices de Vegetação

### Ator Principal

### Pré-condições

### Fluxo Principal

### Fluxos Alternativos

### Pós-condições

## UC03 - Comparar Períodos Temporais

### Ator Principal

### Pré-condições

### Fluxo Principal

### Fluxos Alternativos

### Pós-condições

## UC04 - Gerar Relatório

### Ator Principal

### Pré-condições

### Fluxo Principal

### Fluxos Alternativos

### Pós-condições

## Matriz de Rastreabilidade

### Requisitos x Casos de Uso

### User Stories x Casos de Uso

### Personas x Casos de Uso
EOF

# 📁 03_Personas_Jornada_Usuario
echo "📁 Criando pasta 03_Personas_Jornada_Usuario..."
mkdir -p docs/sprint-2/03_Personas_Jornada_Usuario

# _category_.json para 03_Personas_Jornada_Usuario
cat > docs/sprint-2/03_Personas_Jornada_Usuario/_category_.json << 'EOF'
{
  "label": "Personas e Jornada do Usuário",
  "position": 3,
  "link": {
    "type": "generated-index",
    "description": "Definição das personas e suas jornadas dentro da plataforma para guiar o design da solução."
  }
}
EOF

# Definicao_Personas.md
cat > docs/sprint-2/03_Personas_Jornada_Usuario/Definicao_Personas.md << 'EOF'
---
sidebar_position: 1
slug: /sprint-2/personas/definicao
description: "Definição das personas do sistema"
---

# Definição de Personas

## Persona 1: Produtor Rural

### Perfil Demográfico

### Características Profissionais

### Necessidades e Objetivos

### Dores e Desafios

### Comportamento Tecnológico

### Cenário de Uso

## Persona 2: Investidor

### Perfil Demográfico

### Características Profissionais

### Necessidades e Objetivos

### Dores e Desafios

### Comportamento Tecnológico

### Cenário de Uso

## Persona 3: Cientista/Pesquisador

### Perfil Demográfico

### Características Profissionais

### Necessidades e Objetivos

### Dores e Desafios

### Comportamento Tecnológico

### Cenário de Uso

## Validação das Personas

### Fontes de Informação

### Entrevistas Realizadas

### Dados de Mercado

### Ajustes e Refinamentos

## Priorização

### Persona Primária

### Personas Secundárias

### Justificativa da Priorização
EOF

# Jornada_Produtor.md
cat > docs/sprint-2/03_Personas_Jornada_Usuario/Jornada_Produtor.md << 'EOF'
---
sidebar_position: 2
slug: /sprint-2/personas/jornada-produtor
description: "Jornada do usuário para a persona Produtor Rural"
---

# Jornada do Produtor Rural

## Contexto da Jornada

### Momento de Uso

### Motivação

### Expectativas

### Restrições

## Etapas da Jornada

### Descoberta da Plataforma

### Primeiro Acesso

### Configuração Inicial

### Uso Recorrente

### Avaliação de Resultados

## Pontos de Contato

### Canais de Entrada

### Interfaces Utilizadas

### Momentos de Interação

### Pontos de Saída

## Experiência do Usuário

### Facilidades

### Dificuldades

### Emoções

### Satisfação

## Oportunidades de Melhoria

### Pontos de Dor

### Gargalos

### Sugestões

### Funcionalidades Desejadas

## Métricas de Sucesso

### KPIs da Jornada

### Indicadores de Satisfação

### Conversão

### Retenção
EOF

# Jornada_Investidor.md
cat > docs/sprint-2/03_Personas_Jornada_Usuario/Jornada_Investidor.md << 'EOF'
---
sidebar_position: 3
slug: /sprint-2/personas/jornada-investidor
description: "Jornada do usuário para a persona Investidor"
---

# Jornada do Investidor

## Contexto da Jornada

### Momento de Uso

### Motivação

### Expectativas

### Restrições

## Etapas da Jornada

### Avaliação de Oportunidades

### Due Diligence

### Monitoramento de Ativos

### Análise de Performance

### Tomada de Decisão

## Pontos de Contato

### Fontes de Informação

### Dashboards Utilizados

### Relatórios Consultados

### Comunicação com Stakeholders

## Experiência do Usuário

### Necessidades de Dados

### Formato de Apresentação

### Frequência de Consulta

### Nível de Detalhamento

## Oportunidades de Melhoria

### Dados Ausentes

### Melhorias na Visualização

### Automatizações

### Integrações

## Métricas de Sucesso

### Qualidade das Decisões

### Tempo de Análise

### Precisão das Previsões

### ROI das Informações
EOF

# Jornada_Cientista.md
cat > docs/sprint-2/03_Personas_Jornada_Usuario/Jornada_Cientista.md << 'EOF'
---
sidebar_position: 4
slug: /sprint-2/personas/jornada-cientista
description: "Jornada do usuário para a persona Cientista/Pesquisador"
---

# Jornada do Cientista/Pesquisador

## Contexto da Jornada

### Projeto de Pesquisa

### Hipóteses a Validar

### Metodologia

### Cronograma

## Etapas da Jornada

### Definição da Área de Estudo

### Coleta de Dados Históricos

### Análise Temporal

### Validação de Resultados

### Publicação

## Pontos de Contato

### Ferramentas de Análise

### Bases de Dados

### Exportação de Dados

### Documentação Técnica

## Experiência do Usuário

### Precisão dos Dados

### Facilidade de Extração

### Formatos Compatíveis

### Reprodutibilidade

## Oportunidades de Melhoria

### APIs para Integração

### Metadados Completos

### Ferramentas Avançadas

### Documentação Científica

## Métricas de Sucesso

### Qualidade dos Dados

### Eficiência na Pesquisa

### Reprodutibilidade

### Impacto Científico
EOF

# Matriz_Personas_Funcionalidades.md
cat > docs/sprint-2/03_Personas_Jornada_Usuario/Matriz_Personas_Funcionalidades.md << 'EOF'
---
sidebar_position: 5
slug: /sprint-2/personas/matriz-funcionalidades
description: "Matriz relacionando personas com funcionalidades prioritárias"
---

# Matriz Personas x Funcionalidades

## Priorização por Persona

### Funcionalidades Críticas

### Funcionalidades Importantes

### Funcionalidades Desejáveis

### Funcionalidades Futuras

## Matriz de Impacto

### Produtor Rural

### Investidor

### Cientista/Pesquisador

### Análise Cruzada

## Roadmap Orientado a Personas

### Fase 1 - MVP

### Fase 2 - Evolução

### Fase 3 - Especialização

### Fase 4 - Inovação

## Validação das Priorizações

### Feedback das Personas

### Testes de Usabilidade

### Métricas de Uso

### Ajustes Necessários

## Design Guidelines

### Princípios de UX

### Padrões de Interface

### Fluxos Otimizados

### Acessibilidade
EOF

# 📁 04_Variaveis_Agricolas
echo "📁 Criando pasta 04_Variaveis_Agricolas..."
mkdir -p docs/sprint-2/04_Variaveis_Agricolas

# _category_.json para 04_Variaveis_Agricolas
cat > docs/sprint-2/04_Variaveis_Agricolas/_category_.json << 'EOF'
{
  "label": "Variáveis Agrícolas",
  "position": 4,
  "link": {
    "type": "generated-index",
    "description": "Relatório descrevendo os índices e métricas que serão monitorados via satélite."
  }
}
EOF

# NDVI.md
cat > docs/sprint-2/04_Variaveis_Agricolas/NDVI.md << 'EOF'
---
sidebar_position: 1
slug: /sprint-2/variaveis/ndvi
description: "Normalized Difference Vegetation Index - definição e aplicações"
---

# NDVI - Normalized Difference Vegetation Index

## Definição

### Conceito

### Fórmula de Cálculo

### Bandas Espectrais Utilizadas

### Interpretação dos Valores

## Aplicações Agrícolas

### Monitoramento de Vigor Vegetal

### Detecção de Estresse

### Estimativa de Biomassa

### Previsão de Produtividade

## Vantagens e Limitações

### Vantagens

### Limitações Conhecidas

### Fatores de Interferência

### Melhores Práticas

## Implementação Técnica

### Satélites Utilizados

### Resolução Temporal

### Resolução Espacial

### Processamento de Dados

## Casos de Uso

### Milho

### Soja

### Cana-de-açúcar

### Outras Culturas

## Validação

### Dados de Campo

### Correlações

### Precisão

### Confiabilidade
EOF

# EVI.md
cat > docs/sprint-2/04_Variaveis_Agricolas/EVI.md << 'EOF'
---
sidebar_position: 2
slug: /sprint-2/variaveis/evi
description: "Enhanced Vegetation Index - definição e aplicações"
---

# EVI - Enhanced Vegetation Index

## Definição

### Conceito

### Fórmula de Cálculo

### Bandas Espectrais Utilizadas

### Melhorias em Relação ao NDVI

## Aplicações Agrícolas

### Monitoramento Aprimorado

### Áreas de Alta Biomassa

### Redução de Ruído Atmosférico

### Sensibilidade Melhorada

## Vantagens e Limitações

### Vantagens sobre NDVI

### Limitações Específicas

### Quando Utilizar

### Complementaridade

## Implementação Técnica

### Satélites Compatíveis

### Parâmetros de Cálculo

### Processamento

### Calibração

## Casos de Uso

### Florestas

### Culturas Densas

### Monitoramento Sazonal

### Estudos Comparativos

## Validação

### Benchmarks

### Estudos de Caso

### Correlações

### Métricas de Qualidade
EOF

# Biomassa_Estimada.md
cat > docs/sprint-2/04_Variaveis_Agricolas/Biomassa_Estimada.md << 'EOF'
---
sidebar_position: 3
slug: /sprint-2/variaveis/biomassa
description: "Estimativa de biomassa via sensoriamento remoto"
---

# Biomassa Estimada

## Definição

### Conceito de Biomassa

### Métodos de Estimativa

### Unidades de Medida

### Tipos de Biomassa

## Metodologia de Cálculo

### Modelos Utilizados

### Variáveis de Entrada

### Algoritmos

### Calibração

## Aplicações Agrícolas

### Estimativa de Produtividade

### Planejamento de Colheita

### Gestão de Recursos

### Análise de Crescimento

## Precisão e Validação

### Dados de Campo

### Erros Típicos

### Fatores de Correção

### Intervalos de Confiança

## Implementação Técnica

### Sensores Utilizados

### Processamento

### Modelos Preditivos

### Atualizações

## Limitações

### Condições Climáticas

### Tipos de Cultura

### Resolução Espacial

### Variabilidade Temporal

## Casos de Uso

### Diferentes Culturas

### Fases de Crescimento

### Condições Ambientais

### Escalas de Aplicação
EOF

# Cobertura_Vegetal.md
cat > docs/sprint-2/04_Variaveis_Agricolas/Cobertura_Vegetal.md << 'EOF'
---
sidebar_position: 4
slug: /sprint-2/variaveis/cobertura-vegetal
description: "Análise de cobertura vegetal via satélite"
---

# Cobertura Vegetal

## Definição

### Conceito

### Métodos de Classificação

### Categorias de Cobertura

### Métricas Associadas

## Metodologia de Análise

### Classificação Supervisionada

### Classificação Não Supervisionada

### Algoritmos de Machine Learning

### Pós-processamento

## Aplicações Agrícolas

### Mapeamento de Culturas

### Detecção de Mudanças

### Monitoramento de Plantio

### Análise de Sucessão

## Classes de Cobertura

### Vegetação Densa

### Vegetação Esparsa

### Solo Exposto

### Área Urbana

### Corpos d'Água

## Implementação Técnica

### Bandas Espectrais

### Índices Utilizados

### Algoritmos de Classificação

### Validação

## Precisão e Qualidade

### Matriz de Confusão

### Acurácia Global

### Kappa

### Validação de Campo

## Temporal Analysis

### Mudanças Sazonais

### Tendências de Longo Prazo

### Detecção de Anomalias

### Comparações Interanuais
EOF

# Integracao_Indices.md
cat > docs/sprint-2/04_Variaveis_Agricolas/Integracao_Indices.md << 'EOF'
---
sidebar_position: 5
slug: /sprint-2/variaveis/integracao
description: "Integração e análise conjunta dos índices agrícolas"
---

# Integração dos Índices

## Análise Multivariada

### Correlações Entre Índices

### Análise de Componentes Principais

### Clustering

### Análise Discriminante

## Modelos Integrados

### Modelos de Regressão

### Machine Learning

### Deep Learning

### Ensemble Methods

## Dashboard Integrado

### Visualização Conjunta

### Comparações

### Alertas

### Relatórios Automáticos

## Casos de Uso Integrados

### Diagnóstico Completo

### Previsão de Produtividade

### Detecção Precoce de Problemas

### Otimização de Manejo

## Validação Cruzada

### Consistência Entre Índices

### Detecção de Anomalias

### Qualidade dos Dados

### Confiabilidade

## Interpretação Agronômica

### Combinação de Informações

### Recomendações

### Tomada de Decisão

### Suporte Técnico

## Evolução Futura

### Novos Índices

### Sensores Avançados

### Inteligência Artificial

### IoT Integration
EOF

# 📁 05_Arquitetura_Plano_Trabalho
echo "📁 Criando pasta 05_Arquitetura_Plano_Trabalho..."
mkdir -p docs/sprint-2/05_Arquitetura_Plano_Trabalho

# _category_.json para 05_Arquitetura_Plano_Trabalho
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/_category_.json << 'EOF'
{
  "label": "Arquitetura e Plano de Trabalho",
  "position": 5,
  "link": {
    "type": "generated-index",
    "description": "Documento descrevendo a arquitetura técnica básica e plano de trabalho da solução."
  }
}
EOF

# Arquitetura_Tecnica.md
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/Arquitetura_Tecnica.md << 'EOF'
---
sidebar_position: 1
slug: /sprint-2/arquitetura/tecnica
description: "Arquitetura técnica básica da solução"
---

# Arquitetura Técnica

## Visão Geral

### Componentes Principais

### Fluxo de Dados

### Tecnologias Escolhidas

### Padrões Arquiteturais

## Frontend

### Streamlit vs React

### Justificativa da Escolha

### Estrutura de Componentes

### Interface do Usuário

## Backend

### Python/Flask

### APIs REST

### Serviços de Processamento

### Gerenciamento de Estado

## Banco de Dados

### PostgreSQL vs SQLite

### Modelo de Dados

### Otimizações

### Backup e Recuperação

## Integração Google Earth Engine

### API do Google Earth Engine

### Autenticação

### Processamento de Imagens

### Limitações e Quotas

## Infraestrutura

### Deploy Local

### Cloud Computing

### Escalabilidade

### Monitoramento

## Segurança

### Autenticação

### Autorização

### Proteção de Dados

### Compliance
EOF

# Google_Earth_Engine.md
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/Google_Earth_Engine.md << 'EOF'
---
sidebar_position: 2
slug: /sprint-2/arquitetura/gee
description: "Integração com Google Earth Engine"
---

# Integração Google Earth Engine

## Visão Geral do GEE

### Capacidades da Plataforma

### Catálogo de Dados

### Processamento em Nuvem

### APIs Disponíveis

## Configuração e Autenticação

### Conta de Serviço

### Credenciais

### Quotas e Limites

### Boas Práticas

## Datasets Utilizados

### Landsat

### Sentinel

### MODIS

### Outros Sensores

## Processamento de Imagens

### Filtros Temporais

### Filtros Espaciais

### Cálculo de Índices

### Agregações

## APIs e SDKs

### Python API

### JavaScript API

### REST API

### Integração com Backend

## Otimizações

### Cache de Resultados

### Processamento Assíncrono

### Paralelização

### Gestão de Recursos

## Limitações

### Quotas de Computação

### Limites de Dados

### Latência

### Disponibilidade

## Alternativas

### Outros Provedores

### Processamento Local

### Híbrido
EOF

# Tecnologias_Justificativas.md
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/Tecnologias_Justificativas.md << 'EOF'
---
sidebar_position: 3
slug: /sprint-2/arquitetura/tecnologias
description: "Justificativas para escolha das tecnologias"
---

# Tecnologias e Justificativas

## Frontend

### Streamlit

#### Vantagens

#### Desvantagens

#### Casos de Uso Ideais

### React

#### Vantagens

#### Desvantagens

#### Casos de Uso Ideais

### Decisão Final

## Backend

### Python

#### Justificativa

#### Ecossistema

#### Integração com GEE

### Flask

#### Simplicidade

#### Flexibilidade

#### Performance

### Alternativas Consideradas

## Banco de Dados

### PostgreSQL

#### Características

#### Vantagens

#### Considerações

### SQLite

#### Características

#### Vantagens

#### Limitações

### Critérios de Escolha

## Ferramentas de Desenvolvimento

### IDEs

### Controle de Versão

### Testes

### Deploy

## Bibliotecas Principais

### Processamento de Dados

### Visualização

### APIs

### Geoespacial
EOF

# Plano_Trabalho.md
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/Plano_Trabalho.md << 'EOF'
---
sidebar_position: 4
slug: /sprint-2/arquitetura/plano-trabalho
description: "Plano de trabalho detalhado para desenvolvimento"
---

# Plano de Trabalho

## Fases do Projeto

### Fase 1: Setup e Configuração

### Fase 2: Backend Core

### Fase 3: Frontend MVP

### Fase 4: Integração e Testes

### Fase 5: Deploy e Validação

## Cronograma Detalhado

### Semana 1-2

### Semana 3-4

### Semana 5-6

### Semana 7-8

### Semana 9-10

## Recursos Necessários

### Equipe

### Infraestrutura

### Ferramentas

### Licenças

## Dependências

### Externas

### Internas

### Críticas

### Mitigações

## Marcos e Entregas

### MVP Básico

### Testes de Usuário

### Versão Beta

### Produção

## Riscos Identificados

### Riscos Técnicos

### Riscos de Cronograma

### Riscos de Recursos

### Planos de Contingência

## Critérios de Sucesso

### Técnicos

### Funcionais

### Usuário

### Negócio
EOF

# Setup_Desenvolvimento.md
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/Setup_Desenvolvimento.md << 'EOF'
---
sidebar_position: 5
slug: /sprint-2/arquitetura/setup
description: "Setup do ambiente de desenvolvimento"
---

# Setup do Ambiente de Desenvolvimento

## Pré-requisitos

### Software Necessário

### Contas e Credenciais

### Hardware Mínimo

### Conhecimentos Técnicos

## Configuração do Ambiente

### Python e Dependências

### Google Earth Engine

### Banco de Dados

### IDEs e Ferramentas

## Estrutura do Projeto

### Organização de Pastas

### Convenções de Código

### Documentação

### Testes

## Scripts de Automação

### Setup Inicial

### Deploy Local

### Testes Automatizados

### Backup

## Troubleshooting

### Problemas Comuns

### Soluções

### Contatos de Suporte

### Documentação Adicional
EOF

# Estimativas_Recursos.md
cat > docs/sprint-2/05_Arquitetura_Plano_Trabalho/Estimativas_Recursos.md << 'EOF'
---
sidebar_position: 6
slug: /sprint-2/arquitetura/estimativas
description: "Estimativas de recursos e custos do projeto"
---

# Estimativas de Recursos

## Recursos Humanos

### Perfis Necessários

### Horas Estimadas

### Distribuição por Fase

### Custos de Pessoal

## Infraestrutura

### Servidores

### Banco de Dados

### Storage

### Rede

## Licenças e Ferramentas

### Google Earth Engine

### Softwares de Desenvolvimento

### Ferramentas de Deploy

### Monitoramento

## Custos Operacionais

### Hosting

### APIs

### Backup

### Suporte

## Estimativas por Fase

### Desenvolvimento

### Testes

### Deploy

### Manutenção

## ROI Esperado

### Benefícios Quantificáveis

### Economia de Custos

### Novos Negócios

### Payback
EOF

echo "✅ Estrutura Sprint 2 Agro criada com sucesso!"
echo ""
echo "📋 Estrutura gerada:"
echo "├── 📁 01_Sobre_Sprint2 (2 arquivos)"
echo "├── 📁 02_Requisitos_MVP_Agro (4 arquivos)"
echo "├── 📁 03_Personas_Jornada_Usuario (5 arquivos)"
echo "├── 📁 04_Variaveis_Agricolas (5 arquivos)"
echo "└── 📁 05_Arquitetura_Plano_Trabalho (6 arquivos)"
echo ""
echo "Total: 5 pastas, 22 arquivos + arquivos _category_.json"
echo ""
echo "🎯 Próximos passos:"
echo "1. Execute o script: chmod +x create_sprint2_agro.sh && ./create_sprint2_agro.sh"
echo "2. Preencha os tópicos baseando-se nos requisitos do MVP Agro"
echo "3. Defina as personas com base em pesquisa de campo"
echo "4. Documente as variáveis agrícolas com precisão técnica"
echo "5. Execute 'npm start' no Docusaurus para visualizar"
echo ""
echo "📋 Entregáveis da Sprint 2:"
echo "• Requisitos Funcionais e Não Funcionais do MVP Agro"
echo "• Personas + Jornada do Usuário (Produtor, Investidor, Cientista)"
echo "• Mapeamento de Variáveis Agrícolas (NDVI, EVI, Biomassa, Cobertura)"
echo "• Arquitetura Inicial + Plano de Trabalho (GEE, Frontend, Backend)"