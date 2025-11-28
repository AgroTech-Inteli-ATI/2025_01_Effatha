---
sidebar_position: 1
slug: /sprint-5/arquitetura/tecnica
description: "Arquitetura técnica final da solução Effatha"
---

# Arquitetura Técnica Final

## Visão Geral

A solução Effatha é uma plataforma web completa para monitoramento e análise agrícola via imagens de satélite, desenvolvida para validar a eficácia da tecnologia Effatha através de análise temporal de índices de vegetação (NDVI, EVI, biomassa) e métricas preditivas.

### Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────┐
│                   FRONTEND - REACT + VITE                           │
├─────────────────────────────────────────────────────────────────────┤
│ • Interface Web Responsiva     • Mapas Leaflet Interativos         │
│ • shadcn/ui Components         • KML Import/Export                  │
│ • React Query + TanStack      • Visualizações de Dados             │
│ • Firebase Authentication     • Relatórios Detalhados              │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTP/REST APIs
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVICES                             │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌────────────────────┐   │
│ │  Auth Service    │ │   CRUD Service   │ │  Metrics Service   │   │
│ │  (Flask)         │ │   (Flask)        │ │  (FastAPI)         │   │
│ │                  │ │                  │ │                    │   │
│ │ • Firebase Auth  │ │ • SQLAlchemy ORM │ │ • Earth Engine API │   │
│ │ • Session Mgmt   │ │ • Flasgger Docs  │ │ • NDVI/EVI/Biomass │   │
│ │ • User Routes    │ │ • CRUD Completo  │ │ • Time Series      │   │
│ └──────────────────┘ └──────────────────┘ └────────────────────┘   │
└──────────┬──────────────────┬───────────────────────┬──────────────┘
           │                  │                       │
           ▼                  ▼                       ▼
┌─────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│  Firebase Auth      │ │  PostgreSQL DB   │ │  Google Earth Engine │
├─────────────────────┤ ├──────────────────┤ ├──────────────────────┤
│ • User Management   │ │ • Propriedades   │ │ • Sentinel-2 L2A     │
│ • Token Validation  │ │ • Áreas          │ │ • Landsat 8/9        │
│ • Social Login      │ │ • Métricas       │ │ • Cloud Processing   │
│ • Password Reset    │ │ • Preditivas     │ │ • Historical Data    │
└─────────────────────┘ └──────────────────┘ └──────────────────────┘
```

### Fluxo de Dados

1. **Autenticação**: Usuário faz login via Firebase Authentication
2. **Gestão de Propriedades**: CRUD de propriedades e áreas com coordenadas geográficas
3. **Seleção de Área**: Interface de mapa permite desenhar polígonos ou importar KML
4. **Solicitação de Métricas**: Frontend envia coordenadas e período para Metrics Service
5. **Processamento**: FastAPI comunica com Google Earth Engine para obter imagens
6. **Cálculo**: Índices de vegetação (NDVI, EVI) e biomassa são calculados
7. **Armazenamento**: Resultados são salvos no PostgreSQL via CRUD Service
8. **Visualização**: Frontend renderiza gráficos temporais e relatórios comparativos

### Stack Tecnológico

| **Camada** | **Tecnologia** | **Versão/Detalhes** |
|------------|----------------|---------------------|
| **Frontend** | React 18 + TypeScript | Vite como build tool, SWC para compilação rápida |
| **UI Components** | shadcn/ui + Radix UI | Sistema de design completo e acessível |
| **State Management** | TanStack Query (React Query) | Cache e sincronização de dados do servidor |
| **Mapas** | Leaflet + React Leaflet | Mapas interativos com desenho de polígonos |
| **Forms** | React Hook Form + Zod | Validação de formulários type-safe |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend - Auth** | Flask + Firebase Admin SDK | Autenticação e autorização |
| **Backend - CRUD** | Flask + SQLAlchemy | API REST para operações CRUD |
| **Backend - Metrics** | FastAPI + Python EE | Processamento de imagens satelitais |
| **Banco de Dados** | PostgreSQL | Banco relacional com suporte JSON (JSONB) |
| **Processamento** | Google Earth Engine API | Análise de imagens satelitais em escala |
| **Documentação API** | Flasgger (Swagger) | Documentação interativa das APIs |

---

## Frontend

### Arquitetura React + Vite

A aplicação frontend foi construída com **React 18** utilizando **Vite** como ferramenta de build, proporcionando desenvolvimento rápido com Hot Module Replacement (HMR) e builds otimizados para produção.

#### Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes shadcn/ui
│   │   ├── AppSidebar.tsx         # Navegação lateral
│   │   ├── Layout.tsx             # Layout principal
│   │   ├── MapDrawer.tsx          # Componente de mapa interativo
│   │   ├── MapSearch.tsx          # Busca de localizações
│   │   ├── ExternalMapSearch.tsx  # Busca externa de mapas
│   │   └── KmlImporter.tsx        # Importação de arquivos KML
│   ├── pages/
│   │   ├── Login.tsx              # Autenticação
│   │   ├── Home.tsx               # Dashboard principal
│   │   ├── Projetos.tsx           # Listagem de propriedades
│   │   ├── ProjetoDetalhes.tsx    # Detalhes de propriedade
│   │   ├── Areas.tsx              # Gestão de áreas
│   │   ├── Relatorios.tsx         # Listagem de relatórios
│   │   └── RelatorioDetalhes.tsx  # Visualização de métricas
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Detecção de dispositivos móveis
│   │   └── use-toast.ts           # Sistema de notificações
│   ├── lib/
│   │   └── utils.ts               # Utilitários (cn, etc)
│   ├── App.tsx                    # Configuração de rotas
│   └── main.tsx                   # Entry point
├── public/                        # Assets estáticos
├── vite.config.ts                 # Configuração Vite
├── tailwind.config.ts             # Configuração Tailwind
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependências
```

### Principais Funcionalidades

#### 1. Sistema de Autenticação
- Integração com **Firebase Authentication**
- Login/logout com persistência de sessão
- Proteção de rotas privadas
- Interface responsiva de login

#### 2. Mapas Interativos (MapDrawer)
- **Leaflet** para renderização de mapas
- Desenho de polígonos customizados
- Múltiplas camadas de visualização (OpenStreetMap, Satélite, Topográfico)
- Importação/exportação de arquivos KML
- Geocodificação e busca de endereços
- Edição e remoção de polígonos
- Coordenadas em GeoJSON

```typescript
// Exemplo de interface de coordenadas
interface Coordinate {
  lat: number;
  lng: number;
}

// Polígonos são arrays de arrays de coordenadas
onPolygonCreated: (coordinates: Coordinate[][]) => void;
```

#### 3. Gestão de Propriedades e Áreas
- CRUD completo de propriedades rurais
- Cadastro de áreas com:
  - Nome e descrição
  - Coordenadas geográficas (polígonos)
  - Município e estado
  - Cultura principal
  - Imagens de referência
  - Observações
- Relacionamento propriedade → múltiplas áreas

#### 4. Visualização de Métricas
- Gráficos de séries temporais
- Comparação entre períodos
- Índices de vegetação (NDVI, EVI)
- Estimativa de biomassa
- Exportação de relatórios

### Design System (shadcn/ui)

Utiliza **shadcn/ui** como base de componentes, construído sobre **Radix UI** primitives:

**Componentes Utilizados:**
- `Dialog`, `AlertDialog` - Modais e confirmações
- `Button`, `Input`, `Select` - Formulários
- `Tabs`, `Accordion` - Organização de conteúdo
- `Toast`, `Sonner` - Notificações
- `Tooltip`, `Popover` - Informações contextuais
- `Dropdown Menu`, `Navigation Menu` - Navegação
- `Progress`, `Slider` - Indicadores
- `Checkbox`, `Radio Group`, `Switch` - Seleção

**Vantagens:**
- Componentes totalmente customizáveis
- Acessibilidade WCAG 2.1 nativa
- Type-safe com TypeScript
- Sem dependência de runtime externo
- Copy-paste, não npm install

### Estilização com Tailwind CSS

```typescript
// Utility function para merge de classes
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Configuração Customizada:**
- Paleta de cores tema agrícola
- Breakpoints responsivos
- Animações e transições
- Dark mode support (preparado)

### State Management

#### TanStack Query (React Query)

Gerenciamento de estado do servidor:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
```

**Benefícios:**
- Cache automático de requisições
- Revalidação em background
- Otimistic updates
- Retry automático
- Paginação e infinite scroll
- Sincronização entre tabs

#### Local State
- `useState`, `useEffect` para estado de componentes
- Context API para temas e autenticação (quando necessário)
- React Hook Form para formulários complexos

### Roteamento

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route path="/projetos" element={<Projetos />} />
    <Route path="/areas" element={<Areas />} />
    <Route path="/relatorios" element={<Relatorios />} />
    <Route path="/projeto/:id" element={<ProjetoDetalhes />} />
    <Route path="/relatorio/:id" element={<RelatorioDetalhes />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Performance e Otimizações

- **Code Splitting**: Rotas lazy-loaded
- **Tree Shaking**: Vite elimina código não utilizado
- **Minificação**: Build production otimizado
- **CDN para assets**: Ícones Leaflet via CDN
- **Memoization**: React.memo para componentes pesados
- **Virtual Scrolling**: Para listas grandes (futuro)

---

## Backend

### Arquitetura Modular

O backend está organizado em **três serviços independentes**, cada um com responsabilidades específicas:

#### 1. **Auth Service** (Flask + Firebase)
```
src/auth/
├── app.py                    # Aplicação Flask principal
├── firebase_config.py        # Configuração Firebase Admin SDK
├── firebase-auth.json        # Credenciais service account
├── requirements.txt          # Dependências
├── templates/                # Templates HTML
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   └── ...
└── static/                   # Assets estáticos
    ├── firebase-config.js
    ├── login-auth.js
    └── styles.css
```

**Responsabilidades:**
- Autenticação de usuários via Firebase
- Gerenciamento de sessões (Flask-Session)
- Rotas de login, logout, signup
- Reset de senha
- Templates para páginas de autenticação

**Tecnologias:**
- Flask
- Firebase Admin SDK
- python-dotenv
- gunicorn (produção)

#### 2. **CRUD Service** (Flask + SQLAlchemy)
```
src/CRUD/
├── __init__.py               # Factory pattern para app Flask
├── main.py                   # Entry point
├── database.py               # Configuração SQLAlchemy
├── models.py                 # Modelos de dados (ORM)
├── requirements.txt
└── routes/
    ├── __init__.py
    ├── area_routes.py        # CRUD de áreas
    ├── propriedade_routes.py # CRUD de propriedades
    ├── metricas_routes.py    # CRUD de métricas
    └── metricas_preditivas_routes.py
```

**Responsabilidades:**
- CRUD completo de propriedades
- CRUD completo de áreas
- CRUD de métricas (NDVI, EVI, biomassa)
- CRUD de métricas preditivas
- Documentação Swagger (Flasgger)
- Validação de dados

**Tecnologias:**
- Flask
- SQLAlchemy (ORM)
- PostgreSQL (psycopg2-binary)
- Flasgger (Swagger UI)
- python-dotenv

#### 3. **Metrics Service** (FastAPI + Earth Engine)
```
src/metrics/
├── app.py                    # Aplicação FastAPI
├── requirements.txt
└── .env                      # Variáveis de ambiente (GEE credentials)
```

**Responsabilidades:**
- Integração com Google Earth Engine
- Processamento de imagens Sentinel-2 e Landsat
- Cálculo de índices de vegetação (NDVI, EVI)
- Estimativa de biomassa
- Suporte a séries temporais
- Processamento de geometrias (GeoJSON, KML)

**Tecnologias:**
- FastAPI
- Google Earth Engine Python API
- Pydantic (validação)
- python-dotenv

### Modelo de Dados (SQLAlchemy)

#### Schema do Banco de Dados

```python
# models.py

class Propriedade(Base):
    __tablename__ = "propriedade"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    responsavel: Mapped[str] = mapped_column(String(100), nullable=False)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Relacionamento 1:N
    areas = relationship("Area", back_populates="propriedade", cascade="all, delete-orphan")


class Area(Base):
    __tablename__ = "area"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    propriedade_id: Mapped[int] = mapped_column(Integer, ForeignKey("propriedade.id", ondelete="CASCADE"))
    coordenada: Mapped[Optional[Dict]] = mapped_column(JSONB)  # GeoJSON
    municipio: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)
    nome_area: Mapped[str] = mapped_column(String(100), nullable=False)
    cultura_principal: Mapped[Optional[str]] = mapped_column(String(100))
    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    imagens: Mapped[Optional[str]] = mapped_column(Text)
    observacoes: Mapped[Optional[str]] = mapped_column(Text)
    
    # Relacionamentos
    propriedade = relationship("Propriedade", back_populates="areas")
    metricas = relationship("Metricas", back_populates="area", cascade="all, delete-orphan")
    metricas_preditivas = relationship("MetricasPreditivas", back_populates="area", cascade="all, delete-orphan")


class Metricas(Base):
    __tablename__ = "metricas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    area_id: Mapped[int] = mapped_column(Integer, ForeignKey("area.id", ondelete="CASCADE"))
    data_medicao: Mapped[date] = mapped_column(Date, nullable=False)
    ndvi: Mapped[Optional[float]] = mapped_column(DECIMAL(5, 4))
    evi: Mapped[Optional[float]] = mapped_column(DECIMAL(5, 4))
    biomassa: Mapped[Optional[float]] = mapped_column(DECIMAL(10, 2))
    cobertura_vegetal: Mapped[Optional[float]] = mapped_column(DECIMAL(5, 2))
    observacoes: Mapped[Optional[str]] = mapped_column(Text)
    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    
    area = relationship("Area", back_populates="metricas")


class MetricasPreditivas(Base):
    __tablename__ = "metricas_preditivas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    area_id: Mapped[int] = mapped_column(Integer, ForeignKey("area.id", ondelete="CASCADE"))
    data_previsao: Mapped[date] = mapped_column(Date, nullable=False)
    ndvi_previsto: Mapped[Optional[float]] = mapped_column(DECIMAL(5, 4))
    biomassa_prevista: Mapped[Optional[float]] = mapped_column(DECIMAL(10, 2))
    confianca: Mapped[Optional[float]] = mapped_column(DECIMAL(3, 2))
    modelo_usado: Mapped[Optional[str]] = mapped_column(String(100))
    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    
    area = relationship("Area", back_populates="metricas_preditivas")
```

**Características do Modelo:**
- **JSONB** para coordenadas geográficas (flexibilidade GeoJSON)
- **Cascade delete** para integridade referencial
- **Timestamps automáticos** com `server_default=func.now()`
- **Typed mappings** com `Mapped[]` (Python 3.10+)
- **Relacionamentos bidirecionais** via `relationship()`

### APIs REST

#### CRUD Service Endpoints

```python
# Propriedades
GET    /api/propriedade/           # Listar todas
POST   /api/propriedade/           # Criar nova
GET    /api/propriedade/{id}       # Buscar por ID
PUT    /api/propriedade/{id}       # Atualizar
DELETE /api/propriedade/{id}       # Deletar

# Áreas
GET    /api/area/                  # Listar todas
POST   /api/area/                  # Criar nova
GET    /api/area/{id}              # Buscar por ID
PUT    /api/area/{id}              # Atualizar
DELETE /api/area/{id}              # Deletar

# Métricas
GET    /api/metricas/              # Listar todas
POST   /api/metricas/              # Criar nova
GET    /api/metricas/{id}          # Buscar por ID
PUT    /api/metricas/{id}          # Atualizar
DELETE /api/metricas/{id}          # Deletar
GET    /api/metricas/area/{area_id} # Métricas de uma área

# Métricas Preditivas
GET    /api/metricas-preditivas/
POST   /api/metricas-preditivas/
GET    /api/metricas-preditivas/{id}
PUT    /api/metricas-preditivas/{id}
DELETE /api/metricas-preditivas/{id}
```

#### Metrics Service Endpoints (FastAPI)

```python
POST /compute
# Body: ComputeRequest (Pydantic model)
# - geometry: GeoJSON polygon
# - kml: KML string (alternativa)
# - start_date: "YYYY-MM-DD"
# - end_date: "YYYY-MM-DD"
# - collection: "SENTINEL2" | "LANDSAT8"
# - timeseries: boolean
# - timeseries_unit: "per_image" | "period"
# - max_images: int (limite de segurança)
```

**Exemplo de Request:**
```json
{
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-46.6333, -23.5505],
      [-46.6333, -23.5605],
      [-46.6233, -23.5605],
      [-46.6233, -23.5505],
      [-46.6333, -23.5505]
    ]]
  },
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "collection": "SENTINEL2",
  "timeseries": true,
  "timeseries_unit": "period",
  "timeseries_period_days": 30
}
```

**Exemplo de Response:**
```json
{
  "ndvi_mean": 0.7234,
  "evi_mean": 0.6512,
  "biomass_estimate": 45.32,
  "timeseries": [
    {
      "date": "2024-01-15",
      "ndvi": 0.6123,
      "evi": 0.5432,
      "biomass": 38.21
    },
    {
      "date": "2024-02-14",
      "ndvi": 0.7001,
      "evi": 0.6234,
      "biomass": 42.56
    }
    // ...
  ],
  "image_count": 24,
  "cloud_coverage_avg": 8.3
}
```

### Documentação Swagger

O **CRUD Service** expõe documentação interativa via **Flasgger**:

```python
from flasgger import Swagger

swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "Effatha CRUD API",
        "version": "1.0.0",
        "description": "API para gestão de propriedades, áreas e métricas agrícolas"
    }
})
```

Acessível em: `http://localhost:5000/apidocs/`

### Configuração de Ambiente

#### CRUD Service (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/effatha
SECRET_KEY=your-secret-key-here
```

#### Metrics Service (.env)
```bash
SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_APPLICATION_CREDENTIALS_PATH=/path/to/service-account-key.json
GEE_PROJECT=your-gee-project-id
```

#### Auth Service (.env)
```bash
SECRET_KEY=your-secret-key-here
FIREBASE_CONFIG_PATH=/path/to/firebase-auth.json
```

---

## Integração Google Earth Engine

### Configuração e Autenticação

O **Metrics Service** utiliza **Service Account** para autenticação com Google Earth Engine:

```python
import ee
import os
from dotenv import load_dotenv

def init_ee():
    service_account = os.getenv("SERVICE_ACCOUNT_EMAIL")
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
    project = os.getenv("GEE_PROJECT")
    
    # Se project não definido, tenta extrair do JSON
    if not project and key_path and os.path.exists(key_path):
        with open(key_path, "r") as f:
            key_data = json.load(f)
            project = key_data.get("project_id")
    
    if service_account and key_path and project:
        credentials = ee.ServiceAccountCredentials(service_account, key_path)
        ee.Initialize(credentials, project=project)
    else:
        # Fallback: autenticação interativa (dev)
        ee.Authenticate()
        ee.Initialize(project=project)
```

### Processamento de Imagens

#### Coleções Suportadas

**Sentinel-2 Level 2A (Surface Reflectance):**
- ID: `COPERNICUS/S2_SR_HARMONIZED`
- Resolução: 10-60m
- Revisita: ~5 dias
- Bandas utilizadas: B2 (Blue), B4 (Red), B8 (NIR)

**Landsat 8/9 Level 2:**
- ID: `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`
- Resolução: 30m
- Revisita: 16 dias
- Bandas utilizadas: B2 (Blue), B4 (Red), B5 (NIR)

#### Cálculo de Índices

```python
def calculate_vegetation_indices(image, collection_type):
    """
    Calcula NDVI e EVI para uma imagem.
    """
    if collection_type == "SENTINEL2":
        nir = image.select('B8')
        red = image.select('B4')
        blue = image.select('B2')
        scale_factor = 0.0001
    else:  # Landsat
        nir = image.select('SR_B5')
        red = image.select('SR_B4')
        blue = image.select('SR_B2')
        scale_factor = 0.0000275
    
    # NDVI = (NIR - Red) / (NIR + Red)
    ndvi = nir.subtract(red).divide(nir.add(red)).rename('ndvi')
    
    # EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
    evi = image.expression(
        '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
        {
            'NIR': nir.multiply(scale_factor),
            'RED': red.multiply(scale_factor),
            'BLUE': blue.multiply(scale_factor)
        }
    ).rename('evi')
    
    return image.addBands([ndvi, evi])
```

#### Estimativa de Biomassa

Modelo empírico baseado em NDVI:

```python
def estimate_biomass(ndvi_value, max_biomass=100):
    """
    Estimativa de biomassa usando relação linear com NDVI.
    Baseado em estudos que relacionam NDVI com biomassa vegetal.
    
    max_biomass: biomassa máxima esperada para a cultura (ton/ha)
    """
    if ndvi_value < 0:
        return 0
    
    # Relação linear: biomassa = NDVI * max_biomass
    biomass = ndvi_value * max_biomass
    
    return min(biomass, max_biomass)
```

### Séries Temporais

O serviço suporta dois modos de séries temporais:

#### 1. Por Imagem (`per_image`)
Retorna métricas para cada aquisição satelital individualmente:

```python
def process_timeseries_per_image(collection, geometry, max_images=100):
    image_list = collection.toList(max_images)
    size = image_list.size().getInfo()
    
    results = []
    for i in range(min(size, max_images)):
        img = ee.Image(image_list.get(i))
        date = ee.Date(img.get('system:time_start')).format('YYYY-MM-dd').getInfo()
        
        stats = img.select(['ndvi', 'evi']).reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=geometry,
            scale=30,
            maxPixels=1e9
        ).getInfo()
        
        results.append({
            'date': date,
            'ndvi': stats.get('ndvi'),
            'evi': stats.get('evi')
        })
    
    return results
```

#### 2. Por Período (`period`)
Agrega imagens em períodos fixos (ex: a cada 30 dias):

```python
def process_timeseries_by_period(collection, geometry, period_days=30):
    start = ee.Date(collection.first().get('system:time_start'))
    end = ee.Date(collection.sort('system:time_start', False).first().get('system:time_start'))
    
    num_periods = end.difference(start, 'day').divide(period_days).ceil()
    
    results = []
    for i in range(num_periods.getInfo()):
        period_start = start.advance(i * period_days, 'day')
        period_end = period_start.advance(period_days, 'day')
        
        period_collection = collection.filterDate(period_start, period_end)
        
        if period_collection.size().getInfo() > 0:
            composite = period_collection.mean()
            
            stats = composite.select(['ndvi', 'evi']).reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=geometry,
                scale=30
            ).getInfo()
            
            results.append({
                'date': period_start.format('YYYY-MM-dd').getInfo(),
                'ndvi': stats.get('ndvi'),
                'evi': stats.get('evi'),
                'image_count': period_collection.size().getInfo()
            })
    
    return results
```

### Filtragem de Nuvens

```python
def filter_clouds(collection, max_cloud_percent=20):
    """
    Filtra imagens por cobertura de nuvens.
    """
    return collection.filter(
        ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', max_cloud_percent)
    )
```

### Limitações e Boas Práticas

**Quotas do Earth Engine:**
- 1.000 requisições/minuto por projeto
- 5.000 concurrent operations
- 250GB de assets por usuário
- 5 minutos de timeout por operação

**Mitigações:**
- Limitar `max_images` em séries temporais
- Cache de resultados no banco de dados
- Processamento assíncrono para áreas grandes
- Retry com backoff exponencial
- Monitoramento de usage

---

## Banco de Dados PostgreSQL

### Configuração

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
# Exemplo: postgresql://user:password@localhost:5432/effatha

engine = create_engine(DATABASE_URL, future=True, echo=False)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Esquema Relacional

```
propriedade
├── id (PK)
├── data_criacao
├── responsavel
└── nome

area
├── id (PK)
├── propriedade_id (FK → propriedade.id) ON DELETE CASCADE
├── coordenada (JSONB - GeoJSON)
├── municipio
├── estado
├── nome_area
├── cultura_principal
├── data_criacao
├── imagens
└── observacoes

metricas
├── id (PK)
├── area_id (FK → area.id) ON DELETE CASCADE
├── data_medicao
├── ndvi
├── evi
├── biomassa
├── cobertura_vegetal
├── observacoes
└── data_criacao

metricas_preditivas
├── id (PK)
├── area_id (FK → area.id) ON DELETE CASCADE
├── data_previsao
├── ndvi_previsto
├── biomassa_prevista
├── confianca
├── modelo_usado
└── data_criacao
```

### Índices

```sql
-- Índices automáticos em PKs e FKs
-- Índices adicionais recomendados:

CREATE INDEX idx_area_propriedade_id ON area(propriedade_id);
CREATE INDEX idx_metricas_area_id ON metricas(area_id);
CREATE INDEX idx_metricas_data_medicao ON metricas(data_medicao);
CREATE INDEX idx_metricas_preditivas_area_id ON metricas_preditivas(area_id);
CREATE INDEX idx_metricas_preditivas_data_previsao ON metricas_preditivas(data_previsao);
```

### Migrations

Criação automática de tabelas via SQLAlchemy:

```python
# main.py
from CRUD.database import engine
from CRUD.models import Base

# Cria todas as tabelas definidas nos models
Base.metadata.create_all(bind=engine)
```

**Produção:** Considerar **Alembic** para migrations versionadas:

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Backup e Recuperação

```bash
# Backup completo
pg_dump -U user -h localhost effatha > backup_$(date +%Y%m%d).sql

# Restore
psql -U user -h localhost effatha < backup_20241121.sql

# Backup apenas schema
pg_dump -U user -h localhost --schema-only effatha > schema.sql

# Backup apenas dados
pg_dump -U user -h localhost --data-only effatha > data.sql
```

---

## Segurança

### Autenticação Firebase

**Fluxo de Autenticação:**

1. Frontend obtém ID Token via Firebase JS SDK
2. Token é enviado em header `Authorization: Bearer <token>`
3. Backend valida token via Firebase Admin SDK
4. Session cookie é criado para requests subsequentes

```python
from firebase_admin import auth

def verify_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        return uid
    except Exception as e:
        return None
```

### Proteção de Rotas

```python
from functools import wraps
from flask import session, abort

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            abort(401, description="Unauthorized")
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/propriedade/', methods=['GET'])
@login_required
def list_propriedades():
    # ...
```

### Segurança de Dados

**Variáveis de Ambiente:**
- Todas as credenciais em arquivos `.env` (não versionados)
- `.gitignore` inclui `.env`, `firebase-auth.json`, etc.

**HTTPS:**
- Produção: Apenas HTTPS (certificado SSL/TLS)
- Cookies com flags `Secure`, `HttpOnly`, `SameSite=Lax`

**Sanitização:**
- SQLAlchemy ORM previne SQL injection
- Pydantic valida e sanitiza inputs no FastAPI
- Flask valida tipos nos routes

**CORS:**
```python
from flask_cors import CORS

CORS(app, origins=[
    "http://localhost:8080",
    "https://effatha.com"
], supports_credentials=True)
```

### Validação de Dados

```python
# Pydantic model para validação
from pydantic import BaseModel, Field, validator

class ComputeRequest(BaseModel):
    start_date: str
    end_date: str
    collection: Optional[str] = Field("SENTINEL2", regex="^(SENTINEL2|LANDSAT8)$")
    
    @validator('start_date', 'end_date')
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
```

---

## Infraestrutura e Deploy

### Desenvolvimento Local

#### Backend - CRUD Service
```bash
cd src/CRUD
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurar .env com DATABASE_URL

python main.py
# Servidor rodando em http://localhost:5000
```

#### Backend - Metrics Service
```bash
cd src/metrics
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar .env com credenciais GEE

uvicorn app:app --reload --port 8000
# Servidor rodando em http://localhost:8000
```

#### Backend - Auth Service
```bash
cd src/auth
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar .env e firebase-auth.json

python app.py
# Servidor rodando em http://localhost:5001
```

#### Frontend
```bash
cd frontend
npm install

npm run dev
# Aplicação rodando em http://localhost:8080
```

#### PostgreSQL (Docker)
```bash
docker run -d \
  --name postgres-effatha \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=effatha \
  -p 5432:5432 \
  postgres:15-alpine

# Com volume persistente
docker run -d \
  --name postgres-effatha \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=effatha \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine
```

### Docker Compose (Recomendado)

```yaml
version: '3.8'

services:
  # Banco de dados
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: effatha_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: effatha
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U effatha_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # CRUD Service
  crud-service:
    build:
      context: ./src/CRUD
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://effatha_user:${DB_PASSWORD}@postgres:5432/effatha
      SECRET_KEY: ${SECRET_KEY}
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # Metrics Service
  metrics-service:
    build:
      context: ./src/metrics
      dockerfile: Dockerfile
    environment:
      SERVICE_ACCOUNT_EMAIL: ${GEE_SERVICE_ACCOUNT}
      GOOGLE_APPLICATION_CREDENTIALS_PATH: /app/gee-credentials.json
      GEE_PROJECT: ${GEE_PROJECT}
    volumes:
      - ./gee-credentials.json:/app/gee-credentials.json:ro
    ports:
      - "8000:8000"
    restart: unless-stopped

  # Auth Service
  auth-service:
    build:
      context: ./src/auth
      dockerfile: Dockerfile
    environment:
      SECRET_KEY: ${SECRET_KEY}
      FIREBASE_CONFIG_PATH: /app/firebase-auth.json
    volumes:
      - ./firebase-auth.json:/app/firebase-auth.json:ro
    ports:
      - "5001:5001"
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    depends_on:
      - crud-service
      - metrics-service
      - auth-service
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy em Produção

#### Opções de Hosting

**1. AWS:**
- **ECS/Fargate**: Containers gerenciados
- **RDS PostgreSQL**: Banco de dados gerenciado
- **S3 + CloudFront**: Frontend estático
- **Route 53**: DNS
- **Certificate Manager**: SSL/TLS

**2. Google Cloud:**
- **Cloud Run**: Serverless containers
- **Cloud SQL**: PostgreSQL gerenciado
- **Cloud Storage + CDN**: Frontend
- **Cloud DNS**: DNS

**3. Heroku (Simples para MVP):**
```bash
# Backend
heroku create effatha-crud
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix src/CRUD heroku main

# Frontend
heroku create effatha-frontend
heroku buildpacks:set heroku/nodejs
git subtree push --prefix frontend heroku main
```

**4. Railway/Render (Alternativas modernas):**
- Deploy via Git
- Auto-scaling
- Bancos de dados inclusos
- SSL automático

### Variáveis de Ambiente (Produção)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/effatha

# Security
SECRET_KEY=<generate-strong-random-key>
ALLOWED_ORIGINS=https://effatha.com,https://www.effatha.com

# Google Earth Engine
SERVICE_ACCOUNT_EMAIL=effatha-sa@project.iam.gserviceaccount.com
GOOGLE_APPLICATION_CREDENTIALS_PATH=/app/credentials/gee-key.json
GEE_PROJECT=effatha-gee-project

# Firebase
FIREBASE_CONFIG_PATH=/app/credentials/firebase-auth.json
```

### Monitoramento

**Logs:**
- Estruturados em JSON
- Centralizados (CloudWatch, Stackdriver, Datadog)
- Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL

**Métricas:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Application Performance Monitoring (New Relic, Datadog)
- Error tracking (Sentry)

**Alertas:**
- Downtime > 5 minutos
- Erro rate > 5%
- Latência > 2s (p95)
- Disk usage > 80%

---

## Performance e Escalabilidade

### Frontend

**Otimizações:**
- Code splitting por rota
- Lazy loading de componentes pesados
- Image optimization (WebP, lazy loading)
- Bundle size < 500KB (gzipped)
- CDN para assets estáticos

**Métricas:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

### Backend

**Otimizações:**
- Connection pooling no PostgreSQL
- Cache de queries frequentes (Redis - futuro)
- Paginação em listagens
- Índices em colunas de busca
- Compressão de responses (gzip)

**Escalabilidade Horizontal:**
- Stateless services (facilita réplicas)
- Load balancer (Nginx, AWS ALB)
- Multiple instances do CRUD/Metrics service

### Banco de Dados

**Otimizações:**
- Read replicas para consultas analíticas
- Particionamento de tabela `metricas` por data
- VACUUM e ANALYZE periódicos
- PgBouncer para connection pooling

### Caching (Futuro)

```python
import redis
from functools import wraps
import json

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

def cache_result(expire_seconds=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{json.dumps(args)}:{json.dumps(kwargs)}"
            
            # Tenta buscar do cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Se não existe, calcula e cacheia
            result = func(*args, **kwargs)
            redis_client.setex(cache_key, expire_seconds, json.dumps(result))
            return result
        return wrapper
    return decorator

@cache_result(expire_seconds=7200)  # 2 horas
def get_area_metrics(area_id):
    # ...
```

---

## Testes

### Frontend (Jest + React Testing Library)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// MapDrawer.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MapDrawer from './MapDrawer';

test('renders map container', () => {
  render(<MapDrawer onPolygonCreated={jest.fn()} />);
  const mapElement = screen.getByTestId('map-container');
  expect(mapElement).toBeInTheDocument();
});

test('calls onPolygonCreated when polygon is drawn', () => {
  const mockCallback = jest.fn();
  render(<MapDrawer onPolygonCreated={mockCallback} />);
  
  // Simular desenho de polígono
  // ...
  
  expect(mockCallback).toHaveBeenCalledWith(expect.any(Array));
});
```

### Backend (pytest)

```bash
pip install pytest pytest-flask pytest-cov
```

```python
# tests/test_area_routes.py
import pytest
from CRUD import create_app
from CRUD.database import Base, engine

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    
    # Setup test database
    Base.metadata.create_all(bind=engine)
    
    yield app
    
    # Teardown
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(app):
    return app.test_client()

def test_list_areas(client):
    response = client.get('/api/area/')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_area(client):
    data = {
        'propriedade_id': 1,
        'nome_area': 'Área Teste',
        'municipio': 'São Paulo',
        'estado': 'SP'
    }
    response = client.post('/api/area/', json=data)
    assert response.status_code == 201
    assert response.json['nome_area'] == 'Área Teste'
```

### Cobertura

```bash
# Backend
pytest --cov=CRUD --cov-report=html tests/

# Frontend
npm run test -- --coverage
```

**Meta de Cobertura:** > 80%

---

## Documentação da API

### Swagger UI (Flasgger)

Acessível em `http://localhost:5000/apidocs/`

**Exemplo de documentação:**

```python
@area_bp.route("/", methods=["POST"])
def criar_area():
    """
    Cria uma nova área
    Cadastra uma nova área associada a uma propriedade.
    ---
    tags:
      - Área
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - propriedade_id
            - nome_area
            - municipio
            - estado
          properties:
            propriedade_id:
              type: integer
              example: 1
            nome_area:
              type: string
              example: "Talhão Norte"
            municipio:
              type: string
              example: "Ribeirão Preto"
            estado:
              type: string
              example: "SP"
            cultura_principal:
              type: string
              example: "Soja"
            coordenada:
              type: object
              description: GeoJSON Polygon
            imagens:
              type: string
            observacoes:
              type: string
    responses:
      201:
        description: Área criada com sucesso
        schema:
          $ref: '#/definitions/Area'
      400:
        description: Dados inválidos
    """
    # ...
```

### FastAPI Docs (Metrics Service)

Acessível em `http://localhost:8000/docs`

Documentação automática via Pydantic models.

---

## Próximos Passos

### Melhorias Planejadas

**Funcionalidades:**
- [ ] Análise comparativa multi-área
- [ ] Modelos preditivos de ML (LSTM para séries temporais)
- [ ] Alertas automáticos (seca, pragas)
- [ ] Exportação de relatórios PDF/Excel
- [ ] Integração com APIs de clima
- [ ] App mobile (React Native)

**Técnicas:**
- [ ] CI/CD pipeline (GitHub Actions, GitLab CI)
- [ ] Testes E2E (Playwright, Cypress)
- [ ] Redis para caching
- [ ] Message queue para processamento assíncrono (Celery + RabbitMQ)
- [ ] WebSockets para updates em tempo real
- [ ] GraphQL API (alternativa ao REST)

**Infraestrutura:**
- [ ] Kubernetes para orquestração
- [ ] Terraform para Infrastructure as Code
- [ ] Multi-region deployment
- [ ] CDN global para frontend
- [ ] Database sharding para escala massiva

---

## Conclusão

A arquitetura técnica final do projeto Effatha demonstra uma solução robusta, modular e escalável para monitoramento agrícola via satélite. A separação clara de responsabilidades entre os três serviços backend (Auth, CRUD, Metrics) combinada com um frontend moderno e responsivo proporciona:

- **Manutenibilidade**: Código organizado e bem documentado
- **Escalabilidade**: Serviços independentes que podem escalar individualmente
- **Performance**: Otimizações em todas as camadas
- **Segurança**: Autenticação robusta e proteção de dados
- **Experiência do Usuário**: Interface intuitiva e visualizações ricas

A integração com Google Earth Engine permite processamento de imagens satelitais em escala, viabilizando análises temporais precisas de índices de vegetação. O banco de dados PostgreSQL oferece a confiabilidade necessária para dados agrícolas críticos, enquanto a stack moderna React + TypeScript garante uma interface de usuário profissional e responsiva.

Esta arquitetura está preparada para evolução contínua, com possibilidades de expansão para modelos de machine learning mais sofisticados, integração com sensores IoT, aplicações mobile e análises preditivas avançadas.
