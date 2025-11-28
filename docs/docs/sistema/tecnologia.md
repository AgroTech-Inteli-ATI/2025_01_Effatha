---
sidebar_position: 3
slug: /sistema/tecnologia
description: "Visão técnica da solução"
---

# Tecnologia

A plataforma AgroTech foi desenvolvida com tecnologias modernas e escaláveis, seguindo as melhores práticas de desenvolvimento de software.

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND - REACT                             │
├─────────────────────────────────────────────────────────────────────┤
│ • Interface Web Responsiva     • Mapas Interativos                  │
│ • Dashboards e Visualizações   • Exportação de Relatórios           │
│ • Autenticação                 • Comparações Temporais              │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTP/REST APIs
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND - PYTHON/FLASK                          │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐ │
│ │   API Routes    │  │ Image Processing │  │  AI/ML Services     │ │
│ │   - Auth        │  │  - NDVI/EVI      │  │  - SARIMA           │ │
│ │   - CRUD        │  │  - Biomassa      │  │  - Regressão        │ │
│ │   - Reports     │  │  - Cobertura     │  │  - Séries Temporais │ │
│ └─────────────────┘  └──────────────────┘  └─────────────────────┘ │
└──────────┬────────────────────┬─────────────────────────────────────┘
           │                    │
           ▼                    ▼
┌─────────────────────┐    ┌─────────────────────────────────────────┐
│   PostgreSQL DB     │    │        GOOGLE EARTH ENGINE API          │
├─────────────────────┤    ├─────────────────────────────────────────┤
│ • Usuários          │    │ • Imagens Landsat/Sentinel              │
│ • Propriedades      │    │ • Processamento na Nuvem                │
│ • Áreas             │    │ • Dados Históricos                      │
│ • Métricas          │    │ • Filtros Temporais                     │
│ • Relatórios        │    │ • OpenLandMap (solo)                    │
└─────────────────────┘    └─────────────────────────────────────────┘
```

## 🎨 Frontend

### Stack Principal

#### React + TypeScript + Vite
- **React 18+**: Biblioteca UI moderna com hooks e context
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Vite**: Build tool ultrarrápido para desenvolvimento
- **Bun**: Runtime JavaScript alternativo (opcional)

#### Estilização
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn/ui**: Componentes React acessíveis e customizáveis
- **Radix UI**: Primitivos headless para componentes complexos
- **Lucide Icons**: Biblioteca de ícones moderna

#### Estado e Dados
- **React Query (TanStack Query)**: Gerenciamento de estado servidor
- **Context API**: Estado global da aplicação
- **Zustand/Jotai**: Gerenciamento de estado leve (se necessário)

#### Mapas e Visualização
- **Leaflet/Mapbox GL**: Mapas interativos
- **React-Leaflet**: Bindings React para Leaflet
- **Chart.js / Recharts**: Gráficos e visualizações
- **D3.js**: Visualizações customizadas (se necessário)

#### Roteamento e Navegação
- **React Router v6**: Roteamento client-side
- **Navegação hierárquica** com breadcrumbs

### Estrutura de Pastas

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── assets/         # Imagens, ícones, fontes
│   ├── components/     # Componentes reutilizáveis
│   │   ├── ui/        # Componentes shadcn/ui
│   │   ├── maps/      # Componentes de mapa
│   │   └── charts/    # Componentes de gráficos
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilitários e helpers
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── types/         # Definições TypeScript
│   ├── App.tsx        # Componente raiz
│   └── main.tsx       # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

### Build e Deploy
- **Build de Produção**: `npm run build`
- **Preview**: `npm run preview`
- **Deploy**: Netlify, Vercel ou GitHub Pages
- **CI/CD**: GitHub Actions (opcional)

## ⚙️ Backend

### Stack Principal

#### Python 3.10+
- **Flask**: Framework web leve e flexível
- **Flask-CORS**: Habilita Cross-Origin Resource Sharing
- **Flasgger**: Documentação automática da API (Swagger/OpenAPI)

#### ORM e Banco de Dados
- **SQLAlchemy 2.0**: ORM moderno com tipagem
- **PostgreSQL**: Banco de dados relacional robusto
- **psycopg2-binary**: Driver PostgreSQL
- **Alembic**: Migrations de banco de dados (opcional)

#### Processamento de Imagens e Geoespacial
- **earthengine-api**: SDK oficial do Google Earth Engine
- **geemap**: Biblioteca Python para GEE com visualizações
- **geopandas**: Manipulação de dados geoespaciais
- **shapely**: Operações geométricas
- **rasterio**: Leitura de dados raster
- **PIL/Pillow**: Processamento de imagens

#### Machine Learning e Estatística
- **statsmodels**: Modelos estatísticos (SARIMA)
- **scikit-learn**: Machine learning (regressão, clustering)
- **numpy**: Computação numérica
- **pandas**: Manipulação de dados tabulares
- **scipy**: Algoritmos científicos

#### Autenticação
- **Firebase Admin SDK**: Autenticação e Firestore
- **PyJWT**: JSON Web Tokens
- **python-dotenv**: Gerenciamento de variáveis de ambiente

### Estrutura de Pastas

```
backend/
├── auth/                      # Módulo de autenticação
│   ├── app.py                # Servidor Flask auth
│   ├── firebase_config.py    # Configuração Firebase
│   ├── static/               # Frontend do auth
│   └── templates/            # Templates HTML
├── CRUD/                      # Módulo principal CRUD
│   ├── main.py               # Entry point
│   ├── database.py           # Configuração DB
│   ├── models.py             # Modelos SQLAlchemy
│   ├── routes/               # Rotas da API
│   │   ├── area_routes.py
│   │   ├── propriedade_routes.py
│   │   ├── metricas_routes.py
│   │   ├── metricas_solo_routes.py
│   │   ├── metricas_preditivas_routes.py
│   │   └── relatorios_routes.py
│   └── services/             # Lógica de negócio
│       └── metrics_manager.py
├── metrics/                   # Módulo de métricas
│   ├── agro_metrics.py       # Servidor de métricas agrícolas
│   ├── soil_metrics.py       # Servidor de métricas de solo
│   └── keys/                 # Chaves de serviços
├── preditive/                 # Módulo preditivo
│   ├── sarima_api.py         # API SARIMA
│   └── data/                 # Dados de previsões
├── google_earth_engine.ipynb  # Notebook exploratório GEE
├── modelo_preditivo.ipynb     # Notebook modelos ML
└── requirements.txt
```

### APIs e Endpoints

#### API CRUD (porta 5001)
- **Propriedades**: `/api/propriedade/*`
- **Áreas**: `/api/area/*`
- **Métricas**: `/api/metricas/*`
- **Métricas Solo**: `/api/metricas-solo/*`
- **Métricas Preditivas**: `/api/metricas-preditivas/*`
- **Relatórios**: `/api/relatorios/*`

#### API Métricas Agrícolas (porta 5002)
- Cálculo de NDVI, EVI, NDWI, NDMI, SAVI
- Biomassa e cobertura vegetal
- Processamento via Google Earth Engine

#### API Métricas de Solo (porta 5003)
- Cálculo de teor de argila
- Dados do OpenLandMap

#### API SARIMA (porta 5004)
- Previsões de séries temporais
- Análise estatística

### Documentação da API
- **Swagger UI**: Disponível em `/apidocs` em cada API
- **OpenAPI Specification**: Gerado automaticamente pelo Flasgger

## 🗄️ Banco de Dados

### PostgreSQL

#### Schema Principal

**Tabelas:**

1. **propriedade**
   - `id` (PK, serial)
   - `nome` (varchar)
   - `responsavel` (varchar)
   - `data_criacao` (timestamp)

2. **area**
   - `id` (PK, serial)
   - `propriedade_id` (FK)
   - `nome_area` (varchar)
   - `coordenada` (jsonb)
   - `municipio` (varchar)
   - `estado` (varchar)
   - `cultura_principal` (varchar)
   - `data_criacao` (timestamp)
   - `imagens` (text)
   - `observacoes` (text)

3. **metricas**
   - `id` (PK, serial)
   - `area_id` (FK)
   - `periodo_inicio` (date)
   - `periodo_fim` (date)
   - `ndvi_mean/median/std` (decimal)
   - `evi_mean/median/std` (decimal)
   - `ndwi_mean/median/std` (decimal)
   - `ndmi_mean/median/std` (decimal)
   - `savi_mean/median/std` (decimal)
   - `cobertura_vegetal` (decimal)
   - `biomassa_estimada` (decimal)

4. **metricas_solo**
   - `id` (PK, serial)
   - `area_id` (FK)
   - `profundidade` (varchar)
   - `clay_mean/min/max` (decimal)
   - `data_calculo` (timestamp)

5. **metricas_preditivas**
   - `id` (PK, serial)
   - `area_id` (FK)
   - `metrica_nome` (varchar)
   - `data_previsao` (date)
   - `valor_previsto` (decimal)
   - `intervalo_confianca_min/max` (decimal)
   - `data_calculo` (timestamp)

6. **relatorio**
   - `id` (PK, serial)
   - `area_id` (FK)
   - `tipo` (varchar)
   - `periodo_inicio/fim` (date)
   - `arquivo_path` (text)
   - `data_geracao` (timestamp)
   - `status` (varchar)

#### Relacionamentos
- **1:N** - Propriedade → Áreas
- **1:N** - Área → Métricas
- **1:N** - Área → Métricas Solo
- **1:N** - Área → Métricas Preditivas
- **1:N** - Área → Relatórios

#### Índices
- Índices em chaves estrangeiras
- Índice em `periodo_inicio`, `periodo_fim` para consultas temporais
- Índice JSONB em `coordenada` para consultas geoespaciais

### Firebase Firestore
- **Autenticação de usuários**
- **Sincronização em tempo real** (opcional)
- **Backup de configurações**

## 🌍 Google Earth Engine

### Integração

#### Autenticação
```python
import ee
ee.Authenticate()
ee.Initialize()
```

#### Datasets Utilizados

1. **Sentinel-2**
   - Coleção: `COPERNICUS/S2_SR`
   - Resolução: 10-20m
   - Bandas: B2 (Blue), B3 (Green), B4 (Red), B8 (NIR), B11 (SWIR1), B12 (SWIR2)

2. **Landsat 8/9**
   - Coleção: `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`
   - Resolução: 30m
   - Bandas: B2-B7

3. **OpenLandMap - Soil**
   - Coleção: `OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02`
   - Resolução: ~250m
   - Profundidades: 0-200cm

#### Processamento
- **Filtros temporais**: `.filterDate(start, end)`
- **Filtros espaciais**: `.filterBounds(geometry)`
- **Máscaras de nuvens**: QA bands
- **Redução estatística**: `.reduceRegion()`

### Cálculos de Índices

```python
# NDVI
ndvi = (nir - red) / (nir + red)

# EVI
evi = 2.5 * ((nir - red) / (nir + 6*red - 7.5*blue + 1))

# NDWI
ndwi = (green - nir) / (green + nir)

# NDMI
ndmi = (nir - swir1) / (nir + swir1)

# SAVI
L = 0.5
savi = ((nir - red) / (nir + red + L)) * (1 + L)
```

## 🔐 Segurança

### Autenticação e Autorização
- **Firebase Authentication**: Login seguro
- **JWT Tokens**: Autenticação stateless
- **CORS configurado**: Apenas origens permitidas
- **HTTPS**: Comunicação criptografada (produção)

### Proteção de Dados
- **Sanitização de inputs**: Prevenção de SQL Injection
- **Validação de schemas**: Pydantic ou marshmallow
- **Rate limiting**: Proteção contra abuso de API
- **Logs de auditoria**: Rastreamento de ações

### Variáveis de Ambiente
```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/agrotech
FIREBASE_CREDENTIALS_PATH=/path/to/credentials.json
GEE_SERVICE_ACCOUNT=your-sa@project.iam.gserviceaccount.com
SECRET_KEY=your-secret-key
```

## 📦 Dependências Principais

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "tailwindcss": "^3.x",
    "leaflet": "^1.x",
    "react-leaflet": "^4.x",
    "chart.js": "^4.x",
    "recharts": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "typescript": "^5.x",
    "vite": "^6.x"
  }
}
```

### Backend (`requirements.txt`)
```
Flask==3.0.0
flask-cors==4.0.0
flasgger==0.9.7
SQLAlchemy==2.0.23
psycopg2-binary==2.9.9
earthengine-api==0.1.384
geemap==0.29.6
geopandas==0.14.1
statsmodels==0.14.1
scikit-learn==1.3.2
pandas==2.1.4
numpy==1.26.2
firebase-admin==6.3.0
PyJWT==2.8.0
python-dotenv==1.0.0
```

## 🚀 Deploy e DevOps

### Ambientes

#### Desenvolvimento
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend CRUD: `http://localhost:5001`
- Backend Metrics: `http://localhost:5002`
- Backend Soil: `http://localhost:5003`
- Backend SARIMA: `http://localhost:5004`

#### Produção
- Frontend: Netlify/Vercel
- Backend: AWS EC2, Google Cloud Run, ou Heroku
- Banco: Amazon RDS PostgreSQL ou Google Cloud SQL

### Scripts de Automação

#### Linux/macOS: `start_all.sh`
```bash
#!/bin/bash
# Inicia todos os serviços em background
```

#### Windows: `start_all.ps1`
```powershell
# Inicia todos os serviços em janelas separadas
```

### Monitoramento
- **Logs**: Arquivos de log por serviço
- **Health checks**: Endpoints `/health` em cada API
- **Métricas**: CPU, memória, tempo de resposta

## 🧪 Testes

### Frontend
- **Vitest**: Testes unitários
- **React Testing Library**: Testes de componentes
- **Playwright/Cypress**: Testes E2E

### Backend
- **pytest**: Framework de testes
- **pytest-flask**: Testes de rotas Flask
- **unittest.mock**: Mocks de serviços externos
- **Coverage**: Cobertura de código

## 📚 Documentação Técnica

### Ferramentas
- **Docusaurus**: Documentação estática (este site)
- **Swagger/OpenAPI**: Documentação de API
- **JSDoc/TSDoc**: Documentação inline de código
- **Markdown**: Documentação em repositório

### Padrões de Código
- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Formatação de código
- **Black**: Formatação Python
- **Flake8**: Linting Python