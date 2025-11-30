#!/bin/bash
set -e

PROJECT_ROOT="$(pwd)"

# 1. Criar ambiente virtual Python e instalar dependências
if [ ! -d "venv" ]; then
echo "[INFO] Criando ambiente virtual Python..."
python3 -m venv venv
fi

source venv/bin/activate

echo "[INFO] Instalando dependências Python..."
pip install -r requirements.txt

# 2. Iniciar métricas do backend
cd backend/metrics/
echo "[INFO] Executando agro_metrics.py..."
python agro_metrics.py &
PID_AGRO=$!

echo "[INFO] Executando soil_metrics.py..."
python soil_metrics.py &
PID_SOIL=$!

# 3. Iniciar API principal
cd "$PROJECT_ROOT/backend/"
echo "[INFO] Subindo backend CRUD..."
python -m CRUD.main &
PID_BACKEND=$!

# 4. Subir frontend
cd "$PROJECT_ROOT/frontend/"

echo "[INFO] Instalando pacotes do frontend (npm install)..."
npm install

echo "[INFO] Executando npm run dev..."
npm run dev &
PID_FRONT=$!

# 5. Aguardar finalização
wait $PID_AGRO $PID_SOIL $PID_BACKEND $PID_FRONT