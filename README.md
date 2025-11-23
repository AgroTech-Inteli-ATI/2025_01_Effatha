# 🌱 Ferramenta de Mensuração Agrícola via Imagens de Satélite – Effatha

**AgroTech Inteli + Effatha · 2025**

Este repositório contém o código-fonte, documentação e entregáveis do projeto desenvolvido em parceria entre o **AgroTech Inteli** e a **Effatha**, com o objetivo de criar uma plataforma completa para **análise agrícola via imagens de satélite**, incluindo comparação temporal, métricas vegetativas (NDVI, EVI, biomassa), relatórios e previsões simples.

---

## 📌 Objetivo do Projeto

A plataforma foi criada para:

- Selecionar e monitorar áreas agrícolas por meio de mapas.
- Consultar automaticamente imagens de satélite (antes/depois).
- Calcular indicadores vegetativos relevantes.
- Gerar dashboards interativos e relatórios exportáveis.
- Validar cientificamente a tecnologia Effatha em campo.
- Apoiar decisões técnicas e comerciais da empresa.

---

## 🏢 Sobre a Effatha

A **Effatha** é a primeira **NatSciTech** do mundo, pioneira no uso de frequências extremamente baixas do campo eletromagnético terrestre para influenciar processos moleculares, aplicando esses efeitos em agricultura, energia, saúde e indústria química.

Este projeto auxilia a empresa a **mensurar de forma objetiva** os impactos de sua tecnologia no campo.

---

# 🧪 Tecnologias Utilizadas

A plataforma foi desenvolvida com um stack moderno e escalável, dividido em **frontend**, **backend**, **banco de dados** e **integrações externas**.

---

## 🎨 **Frontend – React**

Usado para construir a interface web da plataforma.  
Principais pontos:

- **React.js** — criação da interface e navegação dinâmica
- **Mapas interativos** (Leaflet/Mapbox) para seleção da área
- **Dashboards visuais** com gráficos comparativos
- **Comparações temporais**: imagens “antes x depois”
- **Autenticação** (login, logout, controle de sessão)
- **Exportação de relatórios** diretamente do navegador

---

## ⚙️ **Backend – Python + Flask**

Responsável por toda a lógica do sistema:

- **Rotas REST/HTTP**
- **Processamento de imagens** (NDVI, EVI, biomassa, cobertura)
- **Integração com Google Earth Engine**
- **Modelos de previsão** (regressão e séries temporais)
- **Geração de relatórios**
- **Gerenciamento de projetos e histórico**
- **Serviço de autenticação**

---

## 🗄 **Banco de Dados – PostgreSQL**

Usado para armazenamento:

- Usuários e credenciais
- Projetos e polígonos geográficos
- Histórico de análises
- Resultados processados (métricas, tabelas, caminhos de arquivos)

Permite organização, escalabilidade e consultas rápidas.

---

## 🌍 **Google Earth Engine API**

Componente central da plataforma:

- Obtenção de **imagens Sentinel e Landsat**
- Aplicação de filtros temporais
- Processamento na nuvem
- Extração e recorte da área selecionada
- Acesso a dados históricos e séries temporais

---

# 🏗 Arquitetura da Solução

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

---

## 📊 Funcionalidades Principais

### 🗺 Mapas e Seleção de Área

- Desenho de polígonos
- Coordenadas salvas no banco
- Visualização em camadas

### 🌿 Métricas Vegetativas

- NDVI
- EVI
- Cobertura vegetal
- Biomassa estimada

### 🕒 Comparação Temporal

- Antes vs Depois
- Linha do tempo e histórico
- Processamento automático de imagens extremas

### 📈 Previsões

- Regressão
- Séries temporais
- Gráficos de tendência

### 📄 Relatórios

- PDF
- Excel
- Exportações automáticas

---

## 🚀 Como Executar

### Visão geral

O repositório contém dois serviços Python (autenticação e API CRUD) dentro da pasta `src/` e o frontend em `frontend/` (Vite + React). Abaixo estão comandos recomendados para rodar localmente. Ajuste variáveis de ambiente (`.env`) conforme necessário.

### Frontend

```bash
cd frontend
npm install
# em desenvolvimento (dev server Vite)
npm run dev
# para testar build de produção localmente
npm run build
npm run preview
```

Observação: o comando `npm start` não existe neste projeto; o dev server é executado com `npm run dev` (Vite), por padrão na porta 5173.

### Backend — Serviço de Autenticação (src/auth)

```bash
cd src/auth
# (recomendado) criar e ativar um ambiente virtual
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# opcional: exportar SECRET_KEY ou criar um arquivo .env com SECRET_KEY
export SECRET_KEY="sua_chave_secreta_local"
# iniciar:
python app.py
```

Notas importantes:

- O `app.py` já contém `app.run(debug=True)` no bloco `__main__`, então `python app.py` é a forma mais simples de iniciar.
- O código usa `SESSION_COOKIE_SECURE = True` (cookies só em HTTPS). Para testar localmente via HTTP, comente/ajuste essa configuração ou use HTTPS/local proxy.
- Certifique-se de colocar o arquivo de credenciais Firebase `firebase-auth.json` em `src/auth/` ou ajustar o caminho no código.

### Backend — API CRUD (src/CRUD)

```bash
cd src/CRUD
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Defina a variável de conexão com o banco (por ex. DATABASE_URL) em src/CRUD/.env ou exporte no ambiente
export DATABASE_URL="postgresql://user:pass@localhost:5432/seu_db"
# iniciar o serviço
python main.py
```

Notas:

- O serviço cria as tabelas via SQLAlchemy em `main.py` (Base.metadata.create_all(bind=engine)).
- Se preferir usar `flask run`, ajuste `FLASK_APP` para `CRUD.main` e rode `flask run --host=0.0.0.0` a partir da pasta `src/CRUD`.

### Google Earth Engine

```bash
earthengine authenticate
```

### URLs úteis após iniciar

- Frontend (Vite dev): http://localhost:5173
- CRUD health check (Flask): http://127.0.0.1:5000/

Se quiser, eu atualizo mais detalhes do `.env` e adiciono exemplos mínimos dos `export`/`.env` para cada serviço.

---

## 👥 Equipe

- **AgroTech Inteli** – Desenvolvimento, pesquisa e coordenação
- **Effatha** – Orientação técnica e validação científica

---

## 📜 Licença

Uso restrito à Effatha e à AgroTech Inteli.  
Redistribuição somente com autorização.
