# 2025_01_Effatha
CASE 01 EFFATHA 2025.2 - Ferramenta de Mensuração Agrícola via Imagens de Satélite

## Execução local

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


Se quiser, posso também gerar uma versão *start_all.ps1* para Windows ou adicionar logs e validações extras no script.



