---
sidebar_position: 1
slug: /sprint-2/banco_de_dados/modelagem
description: "Modelagem do banco de dados, incluindo diagramas ER, definição de tabelas e relacionamentos."
---

# Modelagem de Banco de Dados - Effatha

## Visão Geral

Este documento apresenta a modelagem do banco de dados para o sistema Effatha, uma plataforma de monitoramento agrícola via análise de imagens de satélite. O modelo foi desenvolvido para suportar as funcionalidades principais do MVP, incluindo gestão de projetos, análise de áreas agrícolas, geração de relatórios com índices de vegetação e manutenção de histórico de análises.

## Diagrama de Entidade-Relacionamento

![Diagrama do Banco de Dados](../../../static/img/modelagemBancoEffatha.png)

## Estrutura das Tabelas

### 1. Tabela PROPRIEDADE

Armazena informações das propriedades que serão monitoradas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | SERIAL | PRIMARY KEY | Identificador único da propriedade |
| `data_criacao` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora de criação do registro |
| `responsavel` | VARCHAR(100) | NOT NULL | Nome do responsável pela propriedade |
| `nome` | VARCHAR(100) | NOT NULL | Nome da propriedade |

### 2. Tabela AREA

Gerencia asáreas de interesse para análise.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | SERIAL | PRIMARY KEY | Identificador único da área |
| `propriedade_id` | INTEGER | FOREIGN KEY REFERENCES propriedade(id) ON DELETE CASCADE | Identificador da propriedade associada |
| `coordenada` | JSONB | — | Coordenadas geográficas da área em formato JSON |
| `municipio` | VARCHAR(100) | NOT NULL | Nome do município onde a área está localizada |
| `estado` | VARCHAR(50) | NOT NULL | Estado onde a área está localizada |
| `nome_area` | VARCHAR(100) | NOT NULL | Nome da área |
| `cultura_principal` | VARCHAR(100) | — | Cultura agrícola predominante na área |
| `data_criacao` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora de criação do registro |
| `imagens` | TEXT | — | URLs ou caminhos das imagens associadas à área |
| `observacoes` | TEXT | — | Observações adicionais sobre a área |

### 5. Tabela MÉTRICAS

Armazena os valores calculados das métricas espectrais e índices de vegetação obtidos a partir das imagens analisadas. Esses indicadores permitem avaliar o estado da vegetação, biomassa e cobertura vegetal em diferentes áreas monitoradas.
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | SERIAL | PRIMARY KEY | Identificador único das métricas |
| `area_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES area(id) ON DELETE CASCADE | Identificador da área associada às métricas |
| `periodo_inicio` | DATE | NOT NULL | Data de início do período de análise |
| `periodo_fim` | DATE | NOT NULL | Data de término do período de análise |
| `ndvi_mean` | DECIMAL | — | Valor médio do índice NDVI |
| `ndvi_median` | DECIMAL | — | Valor mediano do índice NDVI |
| `ndvi_std` | DECIMAL | — | Desvio padrão do índice NDVI |
| `evi_mean` | DECIMAL | — | Valor médio do índice EVI |
| `evi_median` | DECIMAL | — | Valor mediano do índice EVI |
| `evi_std` | DECIMAL | — | Desvio padrão do índice EVI |
| `ndwi_mean` | DECIMAL | — | Valor médio do índice NDWI |
| `ndwi_median` | DECIMAL | — | Valor mediano do índice NDWI |
| `ndwi_std` | DECIMAL | — | Desvio padrão do índice NDWI |
| `ndmi_mean` | DECIMAL | — | Valor médio do índice NDMI |
| `ndmi_median` | DECIMAL | — | Valor mediano do índice NDMI |
| `ndmi_std` | DECIMAL | — | Desvio padrão do índice NDMI |
| `gndvi_mean` | DECIMAL | — | Valor médio do índice GNDVI |
| `gndvi_median` | DECIMAL | — | Valor mediano do índice GNDVI |
| `gndvi_std` | DECIMAL | — | Desvio padrão do índice GNDVI |
| `ndre_mean` | DECIMAL | — | Valor médio do índice NDRE |
| `ndre_median` | DECIMAL | — | Valor mediano do índice NDRE |
| `ndre_std` | DECIMAL | — | Desvio padrão do índice NDRE |
| `rendvi_mean` | DECIMAL | — | Valor médio do índice RENDVI |
| `rendvi_median` | DECIMAL | — | Valor mediano do índice RENDVI |
| `rendvi_std` | DECIMAL | — | Desvio padrão do índice RENDVI |
| `biomassa` | DECIMAL | — | Estimativa da biomassa da área analisada |
| `cobertura_ve_

**Relações com outras tabelas:**

- Cada registro de **Métricas** é referenciado por uma **área**, por meio da chave estrangeira `area_id`.
- Essa relação permite vincular os resultados das análises espectrais a uma área específica de uma propriedade.

**Índices:**

- `PRIMARY KEY` em `id`  
- `idx_relatorio_metrica_id` em `relatorio(metrica_id)` — acelera consultas e *joins* entre relatórios e métricas
- `idx_projeto_nome` em `nome` para buscas por nome do projeto
- `idx_projeto_responsavel` em `responsavel` para buscas por responsável
- `idx_projeto_data_criacao` em `data_criacao` para ordenação temporal
- `idx_area_municipio_estado` em `(municipio, estado)` para buscas por localização
- `idx_area_nome` em `nome_area` 
- `idx_relatorio_projeto_id` em `projeto_id`
- `idx_relatorio_area_id` em `area_id`
- `idx_relatorio_data_criacao` em `data`
- `idx_relatorio_periodo` em `(periodo_inicio, periodo_fim)`
- `idx_historico_relatorio_id` em `relatorio_id`
- `idx_historico_data_registro` em `data_registro`

## Relacionamentos

### Cardinalidade

- **Propriedade → area**: Um para Muitos (1:N)
  - Uma propriedade pode ter múltiplas áreas para análisar
  
- **Área → métrica**: Um para Muitos (1:N)
  - Uma área pode ter múltiplas análises ao longo do tempo

### Integridade Referencial

- `CASCADE DELETE` em Histórico quando Relatório é removido
- `RESTRICT DELETE` em Projeto e Área quando existem relatórios associados

## Script de Criação (SQL)

```sql
CREATE TABLE IF NOT EXISTS propriedade (
    id SERIAL PRIMARY KEY,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responsavel VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS area (
    id SERIAL PRIMARY KEY,
    propriedade_id INTEGER,
    coordenada JSONB,
    municipio VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    nome_area VARCHAR(100) NOT NULL,
    cultura_principal VARCHAR(100),
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    imagens TEXT,
    observacoes TEXT,
    CONSTRAINT fk_area_propriedade FOREIGN KEY (propriedade_id) REFERENCES propriedade(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metricas  (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    ndvi_mean DECIMAL,
    ndvi_median DECIMAL,
    ndvi_std DECIMAL,
    evi_mean DECIMAL,
    evi_median DECIMAL,
    evi_std DECIMAL,
    ndwi_mean DECIMAL,
    ndwi_median DECIMAL,
    ndwi_std DECIMAL,
    ndmi_mean DECIMAL,
    ndmi_median DECIMAL,
    ndmi_std DECIMAL,
    gndvi_mean DECIMAL,
    gndvi_median DECIMAL,
    gndvi_std DECIMAL,
    ndre_mean DECIMAL,
    ndre_median DECIMAL,
    ndre_std DECIMAL,
    rendvi_mean DECIMAL,
    rendvi_median DECIMAL,
    rendvi_std DECIMAL,
    biomassa DECIMAL,
    cobertura_vegetal DECIMAL,
    CONSTRAINT fk_metricas_area FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);


-- Criação de índices
CREATE INDEX idx_projeto_nome ON projeto(nome);
CREATE INDEX idx_projeto_responsavel ON projeto(responsavel);
CREATE INDEX idx_projeto_data_criacao ON projeto(data_criacao);
CREATE INDEX idx_area_municipio_estado ON area(municipio, estado);
CREATE INDEX idx_area_nome ON area(nome_area);
CREATE INDEX idx_relatorio_projeto_id ON relatorio(projeto_id);
CREATE INDEX idx_relatorio_area_id ON relatorio(area_id);
CREATE INDEX idx_relatorio_data ON relatorio(data_criacao);
CREATE INDEX idx_relatorio_periodo ON relatorio(periodo_inicio, periodo_fim);
CREATE INDEX idx_historico_relatorio_id ON historico(relatorio_id);
CREATE INDEX idx_historico_data_registro ON historico(data_registro);
CREATE INDEX idx_area_metrica_id ON area(metrica_id);


-- Comentários nas tabelas
COMMENT ON TABLE propriedade IS 'Tabela que armazena informações das propriedades';
COMMENT ON TABLE area IS 'Tabela que gerencia as áreas de interesse para análise';
COMMENT ON TABLE metrica IS 'Tabela que registra a média, mediana e desvio padrão para cada uma das sete métricas (exceto biomassa e corbetura_vegetal)';
```

## Considerações de Design

### Flexibilidade dos Dados

O modelo permite extensibilidade futura através de:

- Campo `observacoes` em formato TEXT para dados não estruturados
- Múltiplos índices de vegetação para diferentes tipos de análise
- Estrutura de histórico para auditoria e rastreamento

## Integração com a Aplicação

### Compatibilidade

Este modelo está alinhado com:

- Requisitos funcionais do MVP (RF041-RF091)
- Requisitos não-funcionais de performance (RNF031-RNF048)
- Arquitetura técnica descrita na documentação do projeto

### Performance

As consultas mais frequentes foram otimizadas através de:

- Índices compostos para queries com múltiplos filtros
- Particionamento temporal implícito através dos índices de data
- Normalização adequada evitando redundância desnecessária

## Conclusão

Esta modelagem de banco de dados fornece uma base sólida e escalável para o sistema Effatha, suportando todas as funcionalidades essenciais do MVP enquanto mantém flexibilidade para evolução futura. A estrutura está preparada para atender aos requisitos de performance e crescimento esperados do sistema.
