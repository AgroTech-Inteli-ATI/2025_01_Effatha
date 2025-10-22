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

### 1. Tabela PROJETO

Armazena informações dos projetos de monitoramento agrícola.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único do projeto |
| `nome` | VARCHAR(150) | NOT NULL | Nome do projeto |
| `data_criacao` | DATETIME | NOT NULL | Data e hora de criação do projeto |
| `responsavel` | VARCHAR(100) | NOT NULL | Nome do responsável pelo projeto |

**Índices:**

- `idx_projeto_nome` em `nome` para buscas por nome do projeto
- `idx_projeto_responsavel` em `responsavel` para buscas por responsável
- `idx_projeto_data_criacao` em `data_criacao` para ordenação temporal

### 2. Tabela AREA

Gerencia as propriedades rurais e áreas de interesse para análise.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único da área |
| `coordenada` | JSONB | NOT NULL | Coordenadas geográficas da propriedade |
| `municipio` | VARCHAR(100) | NOT NULL | Município de localização |
| `estado` | VARCHAR(50) | NOT NULL | Estado (UF) |
| `nome_area` | VARCHAR(100) | NOT NULL | Nome da propriedade ou identificação |
| `cultura predominante` | VARCHAR(100) | NOT NULL | Nome da cultura principal |
| `periodo_inicio` | DATE | NOT NULL | Data inicial do período de análise |
| `periodo_fim` | DATE | NOT NULL | Data final do período de análise |

**Índices:**

- `idx_area_municipio_estado` em `(municipio, estado)` para buscas por localização
- `idx_area_nome` em `nome_area` para buscas por nome

### 3. Tabela RELATORIO

Tabela central que armazena os resultados das análises de imagens satelitais e índices de vegetação calculados.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único do relatório |
| `projeto_id` | UUID | FOREIGN KEY → Projeto(id) | Referência ao projeto |
| `area_id` | UUID | FOREIGN KEY → Area(id) | Referência à área analisada |
| `data_criacao` | DATETIME | NOT NULL | Data da análise |
| `safra` | VARCHAR(50) | - | Identificação da safra (ex: "Soja 2024/25") |
| `imagens` | TEXT | - | Caminho/URL das imagens processadas |
| `observacoes` | TEXT | - | Campo livre para anotações do usuário |

**Índices:**

- `idx_relatorio_projeto_id` em `projeto_id`
- `idx_relatorio_area_id` em `area_id`
- `idx_relatorio_data_criacao` em `data`
- `idx_relatorio_periodo` em `(periodo_inicio, periodo_fim)`

### 4. Tabela HISTORICO

Registra eventos importantes, alertas e anomalias detectadas nas análises.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único do registro |
| `relatorio_id` | UUID | FOREIGN KEY → Relatorio(id) | Referência ao relatório relacionado |
| `data_registro` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data e hora do registro |
| `alerta` | VARCHAR(255) | - | Descrição da anomalia ou tendência detectada |

**Índices:**

- `idx_historico_relatorio_id` em `relatorio_id`
- `idx_historico_data_registro` em `data_registro`

### 5. Tabela MÉTRICAS

Armazena os valores calculados das métricas espectrais e índices de vegetação obtidos a partir das imagens analisadas. Esses indicadores permitem avaliar o estado da vegetação, biomassa e cobertura vegetal em diferentes áreas monitoradas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único do conjunto de métricas |
| `ndvi_mean` | DECIMAL | - | Média do índice de vegetação por diferença normalizada (NDVI) |
| `ndvi_median` | DECIMAL | - | Mediana dos valores de NDVI |
| `ndvi_std` | DECIMAL | - | Desvio padrão dos valores de NDVI |
| `evi_mean` | DECIMAL | - | Média do índice de vegetação aprimorado (EVI) |
| `evi_median` | DECIMAL | - | Mediana dos valores de EVI |
| `evi_std` | DECIMAL | - | Desvio padrão dos valores de EVI |
| `ndwi_mean` | DECIMAL | - | Média do índice de água por diferença normalizada (NDWI) |
| `ndwi_median` | DECIMAL | - | Mediana dos valores de NDWI |
| `ndwi_std` | DECIMAL | - | Desvio padrão dos valores de NDWI |
| `ndmi_mean` | DECIMAL | - | Média do índice de umidade por diferença normalizada (NDMI) |
| `ndmi_median` | DECIMAL | - | Mediana dos valores de NDMI |
| `ndmi_std` | DECIMAL | - | Desvio padrão dos valores de NDMI |
| `gndvi_mean` | DECIMAL | - | Média do índice verde de vegetação por diferença normalizada (GNDVI) |
| `gndvi_median` | DECIMAL | - | Mediana dos valores de GNDVI |
| `gndvi_std` | DECIMAL | - | Desvio padrão dos valores de GNDVI |
| `ndre_mean` | DECIMAL | - | Média do índice de borda do vermelho (NDRE) |
| `ndre_median` | DECIMAL | - | Mediana dos valores de NDRE |
| `ndre_std` | DECIMAL | - | Desvio padrão dos valores de NDRE |
| `rendvi_mean` | DECIMAL | - | Média do índice de vegetação vermelho (RendVI) |
| `rendvi_median` | DECIMAL | - | Mediana dos valores de RendVI |
| `rendvi_std` | DECIMAL | - | Desvio padrão dos valores de RendVI |
| `biomassa` | DECIMAL | - | Estimativa da biomassa vegetal total da área |
| `cobertura_vegetal` | DECIMAL | - | Percentual estimado de cobertura vegetal da área analisada |

**Relações com outras tabelas:**

- Cada registro de **Métricas** é referenciado por um **Relatório**, por meio da chave estrangeira `relatorio.metrica_id`.
- Essa relação permite vincular os resultados das análises espectrais a um relatório específico de projeto e área.

**Índices:**

- `PRIMARY KEY` em `id`  
- `idx_relatorio_metrica_id` em `relatorio(metrica_id)` — acelera consultas e *joins* entre relatórios e métricas

## Relacionamentos

### Cardinalidade

- **Projeto → Relatório**: Um para Muitos (1:N)
  - Um projeto pode ter múltiplos relatórios de análise
  
- **Área → Relatório**: Um para Muitos (1:N)
  - Uma área pode ter múltiplas análises ao longo do tempo
  
- **Relatório → Histórico**: Um para Muitos (1:N)
  - Um relatório pode ter múltiplos registros de histórico e alertas

- **Relatório - Area**: Um para Um (1:1)
  - Um área possui suas respectivas métricas referentes a um período de tempo.

### Integridade Referencial

- `CASCADE DELETE` em Histórico quando Relatório é removido
- `RESTRICT DELETE` em Projeto e Área quando existem relatórios associados

## Script de Criação (SQL)

```sql
-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela PROJETO
CREATE TABLE projeto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT,CURRENT_TIMESTAMP,
    responsavel VARCHAR(100) NOT NULL
);

-- Tabela AREA
CREATE TABLE area (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metrica_id UUID NOT NULL,
    coordenada JSONB,
    municipio VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    nome_area VARCHAR(100) NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    CONSTRAINT fk_area_metrica FOREIGN KEY (metrica_id) 
      REFERENCES metrica(id) ON DELETE RESTRICT
);

-- Tabela RELATORIO
CREATE TABLE relatorio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projeto_id UUID NOT NULL,
    area_id UUID NOT NULL,
    data_criacao TIMESTAMP NOT NULL,
    safra VARCHAR(50),
    imagens TEXT,
    observacoes TEXT,
    CONSTRAINT fk_relatorio_projeto FOREIGN KEY (projeto_id) 
        REFERENCES projeto(id) ON DELETE RESTRICT,
    CONSTRAINT fk_relatorio_area FOREIGN KEY (area_id) 
        REFERENCES area(id) ON DELETE RESTRICT,
);

-- Tabela HISTORICO
CREATE TABLE historico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relatorio_id UUID NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alerta VARCHAR(255),
    CONSTRAINT fk_historico_relatorio FOREIGN KEY (relatorio_id) 
        REFERENCES relatorio(id) ON DELETE CASCADE
);

-- Criação da tabela Metrica
CREATE TABLE metrica (
  id UUID PRIMARY KEY,
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
  cobertura_vegetal DECIMAL
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
COMMENT ON TABLE projeto IS 'Tabela que armazena informações dos projetos de monitoramento agrícola';
COMMENT ON TABLE area IS 'Tabela que gerencia as propriedades rurais e áreas de interesse para análise';
COMMENT ON TABLE relatorio IS 'Tabela central que armazena os resultados das análises de imagens satelitais';
COMMENT ON TABLE historico IS 'Tabela que registra eventos importantes, alertas e anomalias detectadas';
COMMENT ON TABLE metrica IS 'Tabela que registra a média, mediana e desvio padrão para cada uma das sete métricas (exceto biomassa e corbetura_vegetal)';
```

## Considerações de Design

### Uso de UUID

A adoção de UUID como chave primária oferece vantagens importantes:

- Identificadores únicos globalmente, facilitando distribuição e replicação
- Evita problemas de colisão em ambientes distribuídos
- Maior segurança ao não expor informações sobre o volume de dados

### Índices Estratégicos

Os índices foram projetados considerando os padrões de consulta mais frequentes:

- Busca de relatórios por projeto e área
- Filtros por período temporal
- Consultas de histórico por relatório

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
