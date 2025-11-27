# start_all.ps1

# 1. Criar ambiente virtual Python e instalar dependências
Write-Host "[INFO] Criando ambiente virtual Python..."
if (!(Test-Path "venv")) {
    python -m venv venv
}

Write-Host "[INFO] Ativando ambiente virtual..."
. ./venv/Scripts/Activate.ps1

Write-Host "[INFO] Instalando dependências Python..."
pip install -r requirements.txt

# 2. Executar scripts de métricas
Write-Host "[INFO] Executando agro_metrics.py..."
Start-Process powershell -ArgumentList "python ./backend/metrics/agro_metrics.py" -WindowStyle Minimized

Write-Host "[INFO] Executando soil_metrics.py..."
Start-Process powershell -ArgumentList "python ./backend/metrics/soil_metrics.py" -WindowStyle Minimized

# 3. Subir backend principal
Write-Host "[INFO] Subindo backend CRUD..."
Start-Process powershell -ArgumentList "python -m CRUD.main" -WorkingDirectory "./backend" -WindowStyle Minimized

# 4. Subir frontend
Write-Host "[INFO] Instalando dependências do frontend..."
Set-Location ./frontend
npm install

Write-Host "[INFO] Executando npm run dev..."
Start-Process powershell -ArgumentList "npm run dev" -WorkingDirectory (Get-Location) -WindowStyle Normal

Write-Host "[INFO] Todos os serviços foram iniciados."