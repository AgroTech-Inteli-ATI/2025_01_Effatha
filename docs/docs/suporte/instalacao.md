---
sidebar_position: 1
slug: /suporte/instalacao
description: "Guia de instalação"
---

# Instalação e Execução

Este guia fornece instruções detalhadas para configurar e executar a plataforma AgroTech em seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios

- **Python 3.10 ou superior**
  - Verifique: `python --version`
  - Download: [python.org](https://www.python.org/downloads/)

- **Node.js 18 ou superior**
  - Verifique: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)

- **PostgreSQL 14 ou superior**
  - Verifique: `psql --version`
  - Download: [postgresql.org](https://www.postgresql.org/download/)

- **Git**
  - Verifique: `git --version`
  - Download: [git-scm.com](https://git-scm.com/)

### Opcionais (Recomendados)

- **npm** (vem com Node.js) ou **bun** (alternativa mais rápida)
- **Docker** (para containerização)
- **Make** (para automação de comandos)

## 📥 Clonando o Repositório

```bash
git clone https://github.com/AgroTech-Inteli-ATI/2025_01_Effatha.git
cd 2025_01_Effatha
```

## 🗄️ Configuração do Banco de Dados

### 1. Criar o Banco de Dados

```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE agrotech;

# Crie um usuário (opcional)
CREATE USER agrotech_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE agrotech TO agrotech_user;

# Saia do psql
\q
```

### 2. Configurar String de Conexão

Crie um arquivo `.env` na raiz do projeto backend:

```bash
# backend/.env
DATABASE_URL=postgresql://agrotech_user:sua_senha_aqui@localhost:5432/agrotech
```

## 🔑 Configuração do Google Earth Engine

### 1. Criar Conta no Google Earth Engine

1. Acesse [earthengine.google.com](https://earthengine.google.com/)
2. Registre-se com sua conta Google
3. Aguarde aprovação (geralmente rápido para projetos educacionais)

### 2. Autenticar no Python

```python
import ee

# Primeira vez - autenticação interativa
ee.Authenticate()

# Após autenticação, inicialize
ee.Initialize()
```

### 3. Service Account (Produção - Opcional)

Para uso em produção, crie uma service account:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a Earth Engine API
4. Crie uma service account
5. Baixe o arquivo JSON de credenciais
6. Configure no `.env`:

```bash
GEE_SERVICE_ACCOUNT=your-sa@project.iam.gserviceaccount.com
GEE_PRIVATE_KEY_PATH=/path/to/credentials.json
```

## 🔥 Configuração do Firebase (Opcional)

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative Authentication (Email/Password)
4. Ative Firestore Database

### 2. Obter Credenciais

**Para Frontend (`firebase-config.js`):**

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

**Para Backend (Service Account):**

1. Em Project Settings → Service Accounts
2. Gere nova chave privada (JSON)
3. Salve em `backend/auth/keys/`
4. Configure no código:

```python
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
```

## ⚙️ Instalação do Backend

### 1. Criar Ambiente Virtual

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Linux/macOS)
source venv/bin/activate

# Ativar (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Ativar (Windows CMD)
.\venv\Scripts\activate.bat
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências
pip install -r requirements.txt

# Ou instalar por módulo
cd CRUD
pip install -r requirements.txt

cd ../auth
pip install -r requirements.txt

cd ../metrics
pip install -r requirements.txt
```

### 3. Inicializar Banco de Dados

```bash
# Na raiz do backend
python -c "from CRUD.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

Ou use Alembic para migrations (se configurado):

```bash
alembic upgrade head
```

## 🎨 Instalação do Frontend

### 1. Instalar Dependências

```bash
cd frontend

# Com npm
npm install

# Ou com bun (mais rápido)
bun install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório frontend:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🚀 Executando a Aplicação

### Opção 1: Script Automático (Recomendado)

#### Linux/macOS

```bash
# Dar permissão de execução
chmod +x start_all.sh

# Executar
./start_all.sh
```

#### Windows PowerShell

```powershell
# Permitir execução de scripts (apenas primeira vez)
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# Executar
.\start_all.ps1
```

O script iniciará automaticamente:
- ✅ Backend CRUD (porta 5001)
- ✅ Backend Metrics Agro (porta 5002)
- ✅ Backend Metrics Solo (porta 5003)
- ✅ Backend SARIMA (porta 5004)
- ✅ Frontend (porta 5173)

### Opção 2: Manual

#### Terminal 1 - Backend CRUD

```bash
cd backend
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
python -m CRUD.main
```

#### Terminal 2 - Backend Metrics Agro

```bash
cd backend/metrics
source ../venv/bin/activate
python agro_metrics.py
```

#### Terminal 3 - Backend Metrics Solo

```bash
cd backend/metrics
source ../venv/bin/activate
python soil_metrics.py
```

#### Terminal 4 - Backend SARIMA (Opcional)

```bash
cd backend/preditive
source ../venv/bin/activate
python sarima_api.py
```

#### Terminal 5 - Frontend

```bash
cd frontend
npm run dev
# Ou: bun run dev
```

## 🌐 Acessando a Aplicação

Após iniciar todos os serviços:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API CRUD**: [http://localhost:5001](http://localhost:5001)
- **API Docs (Swagger)**: [http://localhost:5001/apidocs](http://localhost:5001/apidocs)
- **API Metrics**: [http://localhost:5002](http://localhost:5002)
- **API Soil**: [http://localhost:5003](http://localhost:5003)
- **API SARIMA**: [http://localhost:5004](http://localhost:5004)

## 🧪 Verificando a Instalação

### 1. Testar Backend

```bash
# Testar endpoint de saúde
curl http://localhost:5001/health

# Ou use o navegador/Postman
```

### 2. Testar Frontend

Abra [http://localhost:5173](http://localhost:5173) e verifique se a página inicial carrega.

### 3. Testar Conexão com Banco

```python
from CRUD.database import SessionLocal

with SessionLocal() as db:
    print("Conexão com banco OK!")
```

## 🐳 Instalação com Docker (Opcional)

### 1. Criar Arquivo `docker-compose.yml`

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: agrotech
      POSTGRES_USER: agrotech_user
      POSTGRES_PASSWORD: senha123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5001:5001"
      - "5002:5002"
      - "5003:5003"
      - "5004:5004"
    environment:
      DATABASE_URL: postgresql://agrotech_user:senha123@db:5432/agrotech
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:5001

volumes:
  postgres_data:
```

### 2. Executar

```bash
docker-compose up -d
```

## 🛠️ Troubleshooting

### Erro: "Port already in use"

```bash
# Encontrar processo usando a porta (Linux/macOS)
lsof -i :5001

# Windows
netstat -ano | findstr :5001

# Matar processo
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

### Erro: "Module not found"

```bash
# Reinstalar dependências
pip install -r requirements.txt --force-reinstall
```

### Erro: "Connection refused" (PostgreSQL)

1. Verifique se o PostgreSQL está rodando:
   ```bash
   sudo service postgresql status  # Linux
   brew services list  # macOS
   ```

2. Verifique a string de conexão no `.env`

### Erro: "Firebase authentication failed"

1. Verifique as credenciais no `firebase-config.js`
2. Certifique-se de que o projeto Firebase está ativo
3. Verifique regras de segurança no Firestore

### Erro: "Earth Engine authentication"

```python
# Re-autenticar
import ee
ee.Authenticate(force=True)
ee.Initialize()
```

## 📚 Próximos Passos

Após a instalação:

1. ✅ Leia o [Guia de Uso](../guia/como-usar.md)
2. ✅ Explore as [Funcionalidades](../sistema/funcionalidades.md)
3. ✅ Consulte a [Documentação da API](http://localhost:5001/apidocs)
4. ✅ Veja exemplos nos notebooks:
   - `backend/google_earth_engine.ipynb`
   - `backend/modelo_preditivo.ipynb`

## 💬 Suporte

Problemas durante a instalação? Entre em contato:

- **Email**: [agrotech@inteli.edu.br](mailto:agrotech@inteli.edu.br)
- **GitHub Issues**: Abra uma issue no repositório