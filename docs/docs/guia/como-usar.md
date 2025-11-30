---
sidebar_position: 1
slug: /guia/como-usar
description: "Guia prático para utilizar a solução"
---

# Como Usar a solução

# Como usar a solução

Este manual descreve passo a passo como usar a solução (frontend e backend), quais respostas esperar do sistema, mensagens de erro comuns e fluxos de exemplo. Destina-se a usuários finais (agricultores, técnicos), integradores e testadores.

## Sumário

- Visão geral
- Requisitos
- Instalação e execução
- Configuração inicial
- Autenticação e permissões
- Navegação e funcionalidades do Frontend
- Importar KML e gerenciar áreas
- Gerenciar projetos
- Gerar e visualizar relatórios
- Endpoints da API (exemplos)
- Mensagens e comportamento esperado do sistema
- Fluxos de uso (passo a passo)
- Troubleshooting e FAQ

---

## Visão geral

Esta solução ajuda a gerenciar áreas agrícolas, projetos e relatórios derivados de modelos preditivos (ex.: SARIMA) e integrações com o Google Earth Engine. O sistema tem um frontend web (em React/Vite/TypeScript) e um backend Python (APIs Flask/FastAPI para autenticação e endpoints de dados/modelos).

Objetivos do manual:

- Explicar como instalar e executar o sistema localmente.
- Descrever como usar as principais funcionalidades do frontend.
- Documentar endpoints da API mais relevantes e exemplos de requisição/resposta.
- Listar mensagens e comportamentos esperados para facilitar testes e integração.

## Requisitos

- Sistema operacional: Linux, macOS ou Windows.
- Node.js (versão 16+ recomendada) e bun (se usado). O projeto usa Vite.
- Python 3.8+ (para APIs e scripts). Recomenda-se criar um virtualenv.
- Ferramentas: git, npm ou yarn.

Dependências principais (indicativas):

- Frontend: React, Vite, Tailwind CSS.
- Backend: Flask (ou FastAPI), bibliotecas para SARIMA, pandas, numpy.

Consulte os arquivos `package.json` (frontend) e `requirements.txt` (backend / auth / CRUD) para versões exatas.

## Instalação e execução

Observação: execute cada bloco no diretório apropriado do repositório.

1. Backend (autenticação e APIs)

- Entre na pasta do backend de autenticação:

```bash
cd src/auth
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
# Ajuste variáveis de ambiente/arquivo de configuração se necessário
python app.py  # ou o comando configurado para rodar o servidor
```

- Para outros serviços backend (ex.: CRUD, metrics, sarima_api): entre nas respectivas pastas e instale `requirements.txt` e rode o módulo principal (ex.: `python main.py` ou `python -m uvicorn app:app --reload` para FastAPI).

2. Frontend

```bash
cd frontend
# instale dependências (npm ou yarn)
npm install
# ou: bun install
npm run dev
# ou: npm run build && npm run preview
```

3. Notas sobre execução

- Certifique-se de configurar variáveis de ambiente (ex.: Firebase config, keys) conforme `src/auth/static/firebase-config.js` ou arquivos de configuração equivalentes.
- Se o servidor backend escuta em porta diferente, atualize o `vite` proxy ou variáveis do frontend para apontar ao endereço correto.

## Configuração inicial

1. Firebase / autenticação (se aplicável)

- Configure o projeto Firebase e copie as credenciais para `src/auth/static/firebase-config.js` ou para variáveis de ambiente apropriadas.
- Se a autenticação usa tokens JWT, verifique o segredo e o tempo de expiração nas configurações do backend.

2. Banco de dados

- Se houver Firestore ou outro banco, crie as coleções/estruturas mínimas usadas pelo app (users, projects, areas, reports).

3. Chaves e serviços externos

- Google Earth Engine: certifique-se de ter permissões e chaves (se aplicável) e que os scripts/notebooks (`google_earth_engine.ipynb`) funcionam com a conta configurada.

## Autenticação e permissões

Fluxo de autenticação:

- Cadastro: usuário cria conta com e-mail/senha (ou via provedor externo).
- Login: frontend envia credenciais para endpoint de login; backend retorna token JWT ou cookie de sessão.
- Rotas protegidas: frontend inclui token `Authorization: Bearer <token>` nas requisições.

Comportamento esperado do sistema (exemplos):

- Login bem-sucedido:
  - Status HTTP: 200
  - Body: `{ "token": "JWT_TOKEN", "user": { "id": "...", "email": "...", "name": "..." } }`
- Credenciais inválidas:
  - Status HTTP: 401
  - Body: `{ "error": "Credenciais inválidas" }`
- Token expirado:
  - Status HTTP: 401
  - Body: `{ "error": "Token expirado" }`

## Navegação e principais funcionalidades do Frontend

Páginas principais (arquivo relacionado / comportamento):

- Home (`src/pages/Home.tsx`): visão geral, acesso rápido a projetos e áreas.
- Projetos (`src/pages/Projetos.tsx`): lista de projetos; permite criar/editar/excluir.
- Projetos - detalhe (`src/pages/ProjetoDetalhes.tsx`): visualiza informações do projeto, áreas relacionadas, e botão para gerar relatórios.
- Áreas (`src/pages/Areas.tsx`): lista de áreas importadas ou criadas manualmente; cada área possui métricas e histórico.
- Relatórios (`src/pages/Relatorios.tsx`, `RelatorioDetalhes.tsx`): lista e detalhes de relatórios preditivos.
- Login (`src/pages/Login.tsx`): formulário de autenticação.

Comportamento esperado ao interagir:

- Ao criar um projeto com dados válidos: notificação "Projeto criado com sucesso" e redirecionamento para a página de detalhes.
- Ao importar um KML válido: notificação "KML importado com sucesso" e a(s) área(s) aparecem na lista de áreas.
- Ao solicitar geração de relatório: feedback visual de processamento (spinner) e notificação quando pronto; relatório pode ser baixado ou visualizado.

## Importar KML e gerenciar áreas

Importar KML (arquivo .kml) permite criar áreas geográficas para análise.

Passo a passo (usuário):

1. Acesse a página de `Áreas`.
2. Clique em `Importar KML` (componente `KmlImporter.tsx`).
3. Escolha o arquivo `.kml` no seu computador.
4. O sistema valida o arquivo e cria as áreas; em caso de sucesso exibe "KML importado com sucesso".

Validações e mensagens esperadas:

- Arquivo inválido/sem polígonos:
  - Status: cliente exibe erro "Arquivo KML inválido ou sem polígonos".
- Área muito grande / limites de geometria:
  - Aviso: o sistema pode recusar áreas acima de X hectares (se aplicável) com mensagem de orientação.

## Gerenciar projetos

Funcionalidades:

- Criar/editar/excluir projeto.
- Associar áreas a um projeto.
- Visualizar histórico de relatórios por projeto.

Comportamento esperado:

- Criação: formulario com nome, descrição, e seleção de áreas; ao salvar, status 201 com objeto do projeto.
- Edição: alterações válidas retornam 200 e atualizam a visualização.
- Exclusão: confirmação obrigatória; ao confirmar, 204 No Content e remoção da lista.

## Gerar e visualizar relatórios

O sistema suporta gerar relatórios preditivos (ex.: séries temporais com SARIMA) para áreas selecionadas.

Fluxo resumido:

1. Na página do projeto ou área, clique em `Gerar Relatório`.
2. Escolha parâmetros (período histórico, horizonte de previsão, métricas).
3. Submeta; o backend enfileira/gerencia a tarefa e retorna um ID de relatório.
4. Quando pronto, o frontend mostra link para visualizar/baixar.

Respostas e status:

- Requisição aceita para processamento: 202 Accepted
  - Body: `{ "report_id": "<id>", "status": "processing" }`
- Relatório pronto: 200 OK
  - Body: `{ "report_id": "<id>", "status": "ready", "url": "https://.../download" }`

## Endpoints da API (exemplos)

> Observação: ajuste caminhos e exemplos conforme implementação real.

1. Autenticação — POST /api/auth/login

Request:

```json
{ "email": "user@example.com", "password": "senha" }
```

Success (200):

```json
{ "token": "JWT_TOKEN_HERE", "user": { "id": "u1", "email": "user@example.com" } }
```

2. Criar projeto — POST /api/projects

Request:

```json
{
  "name": "Safra 2025",
  "description": "Projeto piloto",
  "areas": ["areaId1", "areaId2"]
}
```

Success (201):

```json
{ "id": "proj1", "name": "Safra 2025", "created_at": "..." }
```

3. Importar KML — POST /api/areas/import-kml

FormData com arquivo `kml`.

Success (200):

```json
{ "imported": 3, "areas": [{"id":"a1","name":"Área 1"}, ...] }
```

4. Gerar relatório — POST /api/reports

Request:

```json
{ "project_id": "proj1", "area_ids": ["a1"], "horizon": 30 }
```

Accepted (202):

```json
{ "report_id": "r123", "status": "processing" }
```

5. Consultar status do relatório — GET /api/reports/:report_id

Ready (200):

```json
{
  "report_id": "r123",
  "status": "ready",
  "result": {
    /* url, summary */
  }
}
```

## Mensagens e comportamento esperado do sistema

Padrões gerais:

- Sucesso: 200/201/204 com mensagem clara (ex.: "Projeto criado com sucesso").
- Erro de validação (dados inválidos): 400 Bad Request com campo `errors` detalhando problemas.
- Não autorizado: 401 Unauthorized com `{ "error": "Não autorizado" }`.
- Não encontrado: 404 Not Found com `{ "error": "Recurso não encontrado" }`.
- Erro interno do servidor: 500 Internal Server Error com ID do log para rastreio.

Exemplos de mensagens que o frontend deve exibir:

- Operação bem-sucedida: "Operação realizada com sucesso." (tom verde/sucesso)
- Erro de validação: mostrar campos com mensagens específicas (ex.: "Nome é obrigatório").
- Falha de rede: "Não foi possível conectar ao servidor. Verifique sua conexão.".

## Fluxos de uso (exemplos passo a passo)

1. Cadastro e primeiro acesso

- Acesse `/login` → clique em "Criar conta" → preencha nome, e-mail e senha → confirmar e fazer login.
- Ao entrar, o painel inicial mostra projetos e áreas (vazio para novo usuário).

2. Importar área e gerar relatório

- Vá para `Áreas` → `Importar KML` → selecione arquivo → aguarde validação → mensagem de sucesso.
- Vá para `Projetos` → `Criar projeto` → associe a(s) área(s) importada(s) → salvar.
- Na página do projeto, clique `Gerar relatório` → selecione parâmetros → enviar.
- Aguarde notificação de conclusão e visualize o relatório em `Relatórios`.

3. Caso de erro comum: KML inválido

- Mensagem esperada: "Arquivo KML inválido ou sem polígonos".
- Ações sugeridas ao usuário: verificar arquivo no Google Earth, exportar novamente e tentar reimportar.

## Troubleshooting (Problemas comuns)

- Erro: "Credenciais inválidas"

  - Verifique e-mail/senha; redefina senha via fluxo de "Esqueci a senha" se disponível.

- Erro: 500 ao gerar relatório

  - Verificar logs do backend; anotar o `request_id`/`log_id` retornado e contatar o responsável.

- Problemas de CORS no frontend

  - Ajustar configurações do servidor backend para permitir origem do frontend (ex.: http://localhost:5173).

- Importação KML falha por tamanho
  - Tentar dividir o KML em arquivos menores ou reduzir precisão das geometrias.

## FAQ (perguntas frequentes)

- Posso usar arquivos GeoJSON em vez de KML?

  - Atualmente o fluxo principal é KML; se GeoJSON for suportado, haverá um botão/rota específica `Importar GeoJSON`.

- Quanto tempo leva para gerar um relatório?

  - Depende do tamanho dos dados e carga do servidor; geralmente de segundos a minutos. O sistema retorna um ID para acompanhamento.

- Onde encontro logs de erro?
  - No servidor backend (diretório de logs ou serviço de observabilidade configurado). Peça ao time dev o `log_id` retornado em caso de 500.

---
