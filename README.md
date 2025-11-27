# 2025_01_Effatha
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

### 1. Pré‑requisitos

* Python 3.10+
* Node.js 18+
* npm

### 2. Estrutura do Projeto

O script considera automaticamente a estrutura fornecida:

```
2025_01_Effatha/
 ┣ backend/
 ┣ frontend/
 ┗ requirements.txt
```

### 3. Como executar

#### Linux/Mac OS
1. Dê permissão de execução ao script:

```bash
chmod +x start_all.sh
```

2. Execute:

```bash
./start_all.sh
```

#### Windows

1. Permita execução de scripts (caso ainda não esteja liberado):

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

2. Execute o script:

```powershell
./start_all.ps1
```

3. O PowerShell abrirá janelas separadas para backend, métricas e frontend.

### 4. O que o script faz automaticamente

1. Cria e ativa o ambiente virtual Python
2. Instala todas as dependências listadas em `requirements.txt`
3. Executa:
   * `backend/metrics/agro_metrics.py`
   * `backend/metrics/soil_metrics.py`
   * API principal: `python -m CRUD.main`
4. Instala dependências do frontend e executa `npm run dev`

### 5. Encerramento

Para finalizar todos os serviços, use **Ctrl + C**.

## 👥 Equipe

- **AgroTech Inteli** – Desenvolvimento, pesquisa e coordenação
- **Effatha** – Orientação técnica e validação científica


## 📜 Licença

Uso restrito à Effatha e à AgroTech Inteli.  
Redistribuição somente com autorização.
