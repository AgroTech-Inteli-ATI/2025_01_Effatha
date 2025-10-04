---
sidebar_position: 1
slug: /sprint-1/arquitetura/tecnica
description: "Arquitetura técnica básica da solução"
---

# Arquitetura Técnica

## Visão Geral

A solução Effatha consiste em uma plataforma web para mensuração agrícola via imagens de satélite, desenvolvida para validar a eficácia da tecnologia Effatha no campo através de análise temporal de índices de vegetação.

### Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND - REACT                             │
├─────────────────────────────────────────────────────────────────────┤
│ • Interface Web Responsiva     • Mapas Interativos                  │
│ • Dashboards e Visualizações  • Exportação de Relatórios            │
│ • Autenticação                • Comparações Temporais               │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTP/REST APIs
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND - PYTHON/FLASK                          │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│ │   API Routes    │  │ Image Processing │  │  AI/ML Services     │  │
│ │   - Auth        │  │  - NDVI/EVI      │  │  - Regressão        │  │
│ │   - Projects    │  │  - Biomassa      │  │  - Séries Temporais │  │
│ │   - Reports     │  │  - Cobertura     │  │  - Predições        │  │
│ └─────────────────┘  └──────────────────┘  └─────────────────────┘  │
└──────────┬────────────────────┬─────────────────────────────────────┘
           │                    │
           ▼                    ▼
┌─────────────────────┐    ┌─────────────────────────────────────────┐
│   PostgreSQL DB     │    │        GOOGLE EARTH ENGINE API          │
├─────────────────────┤    ├─────────────────────────────────────────┤
│ • Usuários          │    │ • Imagens Landsat/Sentinel              │
│ • Projetos          │    │ • Processamento na Nuvem                │
│ • Histórico         │    │ • Dados Históricos                      │
│ • Resultados        │    │ • Filtros Temporais                     │
└─────────────────────┘    └─────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Usuário** seleciona área geográfica na interface
2. **Frontend** envia coordenadas para o backend via API REST
3. **Backend** autentica requisição e valida parâmetros
4. **Google Earth Engine** fornece imagens satelitais filtradas
5. **Processamento IA** calcula índices de vegetação (NDVI, EVI, biomassa)
6. **PostgreSQL** armazena resultados e histórico de processamento
7. **Frontend** renderiza visualizações comparativas e relatórios

### Tecnologias Escolhidas

| **Camada** | **Tecnologia** | **Justificativa** |
|------------|----------------|-------------------|
| Frontend | React 18+ | Ecossistema maduro, componentes reutilizáveis, boa performance |
| Backend | Python/Flask | Bibliotecas científicas robustas, integração com Google EE |
| Banco de Dados | PostgreSQL | ACID compliance, extensões geoespaciais, escalabilidade |
| Processamento | NumPy/Pandas/Scikit-learn | Stack padrão para análise científica de dados |
| Mapas | Leaflet | Leve, flexível, suporte completo a tiles customizados |

### Padrões Arquiteturais

- **MVC (Model-View-Controller)** - Separação clara de responsabilidades
- **RESTful APIs** - Comunicação padronizada entre frontend e backend
- **Repository Pattern** - Abstração do acesso a dados
- **Service Layer** - Lógica de negócio encapsulada em serviços
- **Dependency Injection** - Facilita testes e manutenibilidade

## Frontend

### Streamlit vs React

**Streamlit:**
- ✅ Rápido para protótipos científicos
- ✅ Interface automática para dados
- ❌ Limitado para UX customizada
- ❌ Menos controle sobre interações

**React:**
- ✅ Controle total sobre UI/UX
- ✅ Ecossistema rico de componentes
- ✅ Performance otimizada
- ❌ Curva de aprendizado maior

### Justificativa da Escolha

**React foi escolhido** por oferecer maior flexibilidade para criar uma experiência de usuário profissional que atenda às necessidades específicas dos produtores rurais, investidores e cientistas - públicos que demandam interfaces intuitivas e visualmente atrativas.

### Estrutura de Componentes

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── maps/
│   │   ├── InteractiveMap.jsx
│   │   ├── AreaSelector.jsx
│   │   └── ImageOverlay.jsx
│   ├── charts/
│   │   ├── NDVIChart.jsx
│   │   ├── BiomassChart.jsx
│   │   └── ComparisonChart.jsx
│   └── reports/
│       ├── ReportGenerator.jsx
│       ├── ExportOptions.jsx
│       └── ShareReport.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── ProjectAnalysis.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── services/
│   ├── api.js
│   ├── auth.js
│   └── geoUtils.js
└── styles/
    ├── globals.css
    └── components/
```

### Interface do Usuário

**Design System:**
- **Cores:** Paleta baseada em tons de verde (agricultura) e azul (tecnologia)
- **Tipografia:** Inter/Roboto para legibilidade em dashboards
- **Componentes:** Ant Design como base, customizado para o domínio agrícola
- **Responsividade:** Mobile-first, otimizado para tablets em campo

**Funcionalidades Principais:**
- Mapa interativo com seleção de polígonos
- Dashboard com KPIs em tempo real
- Comparações lado-a-lado (antes/depois)
- Exportação de relatórios em PDF/Excel
- Sistema de favoritos e histórico

## Backend

### Python/Flask

Flask foi escolhido como framework web por sua simplicidade e flexibilidade, permitindo integração direta com as bibliotecas científicas do Python necessárias para processamento de imagens satelitais.

**Estrutura do Projeto:**
```
app/
├── __init__.py
├── models/
│   ├── user.py
│   ├── project.py
│   └── analysis.py
├── routes/
│   ├── auth.py
│   ├── projects.py
│   ├── analysis.py
│   └── reports.py
├── services/
│   ├── earth_engine.py
│   ├── image_processor.py
│   ├── ml_models.py
│   └── report_generator.py
├── utils/
│   ├── validators.py
│   ├── decorators.py
│   └── helpers.py
└── config.py
```

### APIs REST

**Endpoints Principais:**

```python
# Autenticação
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile

# Projetos
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}

# Análises
POST /api/analysis/start
GET  /api/analysis/{id}/status
GET  /api/analysis/{id}/results
POST /api/analysis/compare

# Relatórios
GET  /api/reports/{id}
POST /api/reports/generate
GET  /api/reports/export/{format}
```

### Serviços de Processamento

**Earth Engine Service:**
```python
class EarthEngineService:
    def get_satellite_images(self, geometry, start_date, end_date):
        """Busca imagens satelitais filtradas por área e período"""
        
    def calculate_ndvi(self, image):
        """Calcula NDVI para uma imagem"""
        
    def filter_by_cloud_coverage(self, collection, max_cloud=20):
        """Filtra imagens por cobertura de nuvens"""
```

**ML Processing Service:**
```python
class MLProcessingService:
    def estimate_biomass(self, ndvi_values, area_metadata):
        """Estima biomassa usando Random Forest"""
        
    def detect_changes(self, before_image, after_image):
        """Detecta mudanças temporais entre imagens"""
        
    def predict_growth_trend(self, historical_data):
        """Prediz tendência de crescimento usando séries temporais"""
```

### Gerenciamento de Estado

- **Flask-Session** - Gerenciamento de sessões de usuário
- **Redis** - Cache de resultados de processamento pesado
- **Celery** - Processamento assíncrono para análises longas
- **SQLAlchemy** - ORM para abstração do banco de dados

## Banco de Dados

### PostgreSQL vs SQLite

**SQLite:**
- ✅ Simples configuração
- ✅ Zero administração
- ❌ Limitado para concorrência
- ❌ Sem extensões geoespaciais

**PostgreSQL:**
- ✅ ACID compliant
- ✅ PostGIS para dados geoespaciais
- ✅ Escalabilidade horizontal
- ✅ Suporte a JSON para metadados flexíveis

### Modelo de Dados

```sql
-- Usuários do sistema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projetos/Áreas monitoradas
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id),
    geometry GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Processamentos realizados
CREATE TABLE analysis (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    processing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Resultados calculados
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER REFERENCES analysis(id),
    metric_type VARCHAR(50) NOT NULL, -- 'ndvi', 'evi', 'biomass'
    value DECIMAL(10,6) NOT NULL,
    image_date DATE NOT NULL,
    confidence_score DECIMAL(3,2)
);

-- Índices para performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_analysis_project_id ON analysis(project_id);
CREATE INDEX idx_results_analysis_id ON results(analysis_id);
CREATE INDEX idx_results_metric_date ON results(metric_type, image_date);
```

### Otimizações

- **Índices Compostos** - Para consultas frequentes por usuário e data
- **Particionamento** - Tabela de resultados particionada por ano
- **Connection Pooling** - PgBouncer para otimizar conexões
- **Query Optimization** - EXPLAIN ANALYZE para identificar gargalos

### Backup e Recuperação

- **pg_dump** - Backup completo diário
- **WAL-E** - Continuous archiving para point-in-time recovery
- **Replicação** - Read replicas para consultas analíticas
- **Monitoramento** - pg_stat_activity para análise de performance

## Integração Google Earth Engine

### API do Google Earth Engine

O Google Earth Engine (GEE) fornece acesso programático a décadas de imagens satelitais e capacidade de processamento em escala planetária.

**Configuração:**
```python
import ee

# Inicialização com service account
service_account = 'your-service-account@project.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account, key_file)
ee.Initialize(credentials)

# Exemplo de uso
def get_landsat_collection(geometry, start_date, end_date):
    return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterBounds(geometry) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUD_COVER', 20))
```

### Autenticação

**Service Account Setup:**
1. Criar projeto no Google Cloud Console
2. Ativar Earth Engine API
3. Criar service account com permissões adequadas
4. Baixar arquivo JSON de credenciais
5. Registrar service account no Earth Engine

**Segurança:**
- Credenciais armazenadas como variáveis de ambiente
- Rotação periódica de chaves
- Logs de auditoria de acesso à API

### Processamento de Imagens

**Pipeline de Processamento:**
```python
class ImageProcessor:
    def process_area(self, geometry, date_range):
        # 1. Buscar coleção de imagens
        collection = self.get_image_collection(geometry, date_range)
        
        # 2. Filtrar por qualidade
        filtered = self.filter_by_quality(collection)
        
        # 3. Calcular índices
        with_indices = filtered.map(self.calculate_vegetation_indices)
        
        # 4. Reduzir para estatísticas por área
        stats = with_indices.select(['ndvi', 'evi']).reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=geometry,
            scale=30
        )
        
        return stats.getInfo()
    
    def calculate_vegetation_indices(self, image):
        # NDVI = (NIR - Red) / (NIR + Red)
        ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('ndvi')
        
        # EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
        evi = image.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
            {
                'NIR': image.select('SR_B5'),
                'RED': image.select('SR_B4'),
                'BLUE': image.select('SR_B2')
            }
        ).rename('evi')
        
        return image.addBands([ndvi, evi])
```

### Limitações e Quotes

**Quotes do Google Earth Engine:**
- 1.000 requisições por minuto por projeto
- 5.000 elementos simultâneos de computação
- 250GB de assets de usuário
- Timeout de 5 minutos por operação

**Estratégias de Mitigação:**
- Cache local de resultados frequentes
- Processamento em lotes durante horários de baixo uso
- Retry automático com backoff exponencial
- Monitoramento de usage para alertas proativos

## Infraestrutura

### Deploy Local

**Desenvolvimento:**
```bash
# Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run --debug

# Frontend
npm install
npm start

# Banco de Dados
docker run -d --name postgres \
  -e POSTGRES_DB=effatha \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgis/postgis:13-master
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/effatha
      - GOOGLE_EE_SERVICE_ACCOUNT_FILE=/app/credentials.json
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgis/postgis:13-master
    environment:
      - POSTGRES_DB=effatha
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Cloud Computing

**Opções de Deploy:**
- **AWS**: ECS + RDS + ElastiCache
- **Google Cloud**: Cloud Run + Cloud SQL + Memorystore
- **Heroku**: Simples para MVP, com add-ons PostgreSQL e Redis

**Arquitetura Cloud Recomendada:**
```
Internet → Load Balancer → Container Instances
                              ↓
                         Managed Database
                              ↓
                         Redis Cache
```

### Escalabilidade

**Horizontal Scaling:**
- Frontend: CDN para assets estáticos
- Backend: Multiple instances atrás de load balancer
- Database: Read replicas para consultas analíticas
- Cache: Redis Cluster para alta disponibilidade

**Vertical Scaling:**
- CPU: Processamento de imagens intensivo
- Memory: Cache de resultados de ML em memória
- Storage: Crescimento de dados históricos

### Monitoramento

**Métricas Técnicas:**
- Response time das APIs
- Taxa de erro por endpoint
- Utilização de CPU/Memory
- Conexões ativas no banco

**Métricas de Negócio:**
- Número de análises processadas/dia
- Tempo médio de processamento por área
- Taxa de sucesso de análises
- Usuários ativos por período

**Ferramentas:**
- **Logs**: Structured logging com Python logging
- **Métricas**: Prometheus + Grafana
- **Alertas**: Slack/email para erros críticos
- **APM**: New Relic ou Datadog para performance

## Segurança

### Autenticação

**JWT (JSON Web Tokens):**
```python
import jwt
from datetime import datetime, timedelta

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
```

**Multi-Factor Authentication (Futuro):**
- SMS/Email para confirmação
- TOTP (Google Authenticator)
- Backup codes

### Autorização

**Role-Based Access Control (RBAC):**
```python
from enum import Enum

class Role(Enum):
    ADMIN = "admin"
    SCIENTIST = "scientist"
    PRODUCER = "producer"
    VIEWER = "viewer"

class Permission(Enum):
    CREATE_PROJECT = "create_project"
    VIEW_ALL_PROJECTS = "view_all_projects"
    DELETE_PROJECT = "delete_project"
    EXPORT_DATA = "export_data"

ROLE_PERMISSIONS = {
    Role.ADMIN: [Permission.CREATE_PROJECT, Permission.VIEW_ALL_PROJECTS, Permission.DELETE_PROJECT, Permission.EXPORT_DATA],
    Role.SCIENTIST: [Permission.CREATE_PROJECT, Permission.EXPORT_DATA],
    Role.PRODUCER: [Permission.CREATE_PROJECT],
    Role.VIEWER: []
}
```

### Proteção de Dados

**Dados Sensíveis:**
- Passwords: bcrypt hashing com salt
- Coordenadas: Podem revelar propriedades privadas
- Resultados: Informações comerciais sensíveis

**Medidas de Proteção:**
- Criptografia em trânsito (HTTPS/TLS 1.3)
- Criptografia em repouso (database encryption)
- Anonymização de dados para analytics
- Audit logs para acesso a dados sensíveis

### Compliance

**LGPD (Lei Geral de Proteção de Dados):**
- Consentimento explícito para coleta de dados
- Direito ao esquecimento (delete user data)
- Portabilidade de dados (export user data)
- DPO (Data Protection Officer) designado


