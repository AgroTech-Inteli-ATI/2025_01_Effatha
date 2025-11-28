---
sidebar_position: 2
slug: /sprint-5/banco-de-dados/final
description: "Modelagem final do banco de dados PostgreSQL implementada no Supabase"
---

# Modelagem de Banco de Dados - Versão Final

## Visão Geral

Este documento apresenta a modelagem final do banco de dados PostgreSQL da plataforma Effatha, implementada no Supabase. O modelo suporta gestão de propriedades, áreas de cultivo, métricas espectrais e predições via machine learning.

## Diagrama de Entidade-Relacionamento

![Diagrama Final do Banco de Dados Supabase](./assets/diagrama-banco-final.jpeg)

## Estrutura das Tabelas

### 1. Tabela `propriedade`

Armazena informações das propriedades rurais monitoradas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | INT4 | PRIMARY KEY | Identificador único |
| `data_criacao` | TIMESTAMP | NOT NULL | Data de criação |
| `responsavel` | VARCHAR(100) | NOT NULL | Nome do responsável |
| `nome` | VARCHAR(100) | NOT NULL | Nome da propriedade |

**Relacionamento:** Uma propriedade possui várias áreas (1:N com `area`)

---

### 2. Tabela `area`

Gerencia as áreas de cultivo dentro de cada propriedade.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | INT4 | PRIMARY KEY | Identificador único |
| `propriedade_id` | INT4 | FOREIGN KEY | Referência à propriedade |
| `coordenada` | JSONB | - | Coordenadas geográficas (GeoJSON) |
| `municipio` | VARCHAR(100) | NOT NULL | Município |
| `estado` | VARCHAR(50) | NOT NULL | Estado (UF) |
| `nome_area` | VARCHAR(100) | NOT NULL | Nome da área |
| `cultura_principal` | VARCHAR(100) | - | Cultura predominante |
| `data_criacao` | TIMESTAMP | NOT NULL | Data de criação |
| `imagens` | TEXT | - | URLs das imagens |
| `observacoes` | TEXT | - | Observações adicionais |

**Relacionamentos:**

- Pertence a uma `propriedade` (N:1)
- Possui várias `metricas` (1:N)
- Possui várias `metricas_preditivas` (1:N)

---

### 3. Tabela `metricas`

Armazena valores calculados de índices de vegetação obtidos via análise de imagens de satélite.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT4 | Identificador único |
| `area_id` | INT4 | Referência à área |
| `periodo_inicio` | DATE | Início do período |
| `periodo_fim` | DATE | Fim do período |

**Índices de Vegetação (cada um com mean, median, std):**

- **NDVI** (Normalized Difference Vegetation Index) - Saúde da vegetação
- **EVI** (Enhanced Vegetation Index) - Índice melhorado de vegetação
- **NDWI** (Normalized Difference Water Index) - Conteúdo de água
- **NDMI** (Normalized Difference Moisture Index) - Umidade do solo
- **GNDVI** (Green Normalized Difference Vegetation Index) - Clorofila
- **NDRE** (Normalized Difference Red Edge) - Nitrogênio
- **RENDVI** (Red-Edge Normalized Difference Vegetation Index) - Estresse vegetal

**Outras métricas:**

- `biomassa` (NUMERIC) - Estimativa da biomassa vegetal
- `cobertura_vegetal` (NUMERIC) - Percentual de cobertura

**Relacionamento:** Cada métrica pertence a uma `area` (N:1)

---

### 4. Tabela `metricas_preditivas`

Armazena predições de índices de vegetação para períodos futuros usando machine learning.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT4 | Identificador único |
| `area_id` | INT4 | Referência à área |
| `modelo_utilizado` | VARCHAR(100) | Nome do modelo ML |
| `periodo_previsto_inicio` | DATE | Início do período previsto |
| `periodo_previsto_fim` | DATE | Fim do período previsto |
| `data_criacao` | TIMESTAMP | Data da predição |
| `observacoes` | TEXT | Observações |

**Predições (mean, min, max, std para cada):**

- NDVI previsto
- EVI previsto  
- NDWI previsto

**Relacionamento:** Cada predição pertence a uma `area` (N:1)

---

## Relacionamentos

```text
propriedade (1) ──── (N) area (1) ──┬── (N) metricas
                                    │
                                    └── (N) metricas_preditivas
```

**Política de Deleção:** CASCADE em todos os relacionamentos - ao deletar uma propriedade, todas as áreas e suas métricas são removidas automaticamente.

---

## Índices Principais

**Tabela `area`:**

- `propriedade_id` - Para joins com propriedade
- `(municipio, estado)` - Buscas geográficas

**Tabela `metricas`:**

- `area_id` - Para joins com área
- `(area_id, periodo_inicio, periodo_fim)` - Queries temporais

**Tabela `metricas_preditivas`:**

- `area_id` - Para joins
- `modelo_utilizado` - Filtragem por modelo

---

## Exemplo de Uso

### Consultar métricas de uma área

```sql
SELECT m.periodo_inicio, m.periodo_fim, 
       m.ndvi_mean, m.evi_mean, m.biomassa
FROM metricas m
JOIN area a ON m.area_id = a.id
WHERE a.nome_area = 'Talhão Norte'
  AND m.periodo_inicio >= '2024-01-01'
ORDER BY m.periodo_inicio;
```

### Buscar áreas por localização

```sql
SELECT p.nome AS propriedade, a.nome_area, a.cultura_principal
FROM area a
JOIN propriedade p ON a.propriedade_id = p.id
WHERE a.municipio = 'Campinas' AND a.estado = 'SP';
```

---

## Tecnologias

- **Banco de Dados:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy
- **Tipo Especial:** JSONB para coordenadas geográficas
- **Backup:** Automático (7 dias de retenção no Supabase)
