---
sidebar_position: 3
slug: /sprint-5/analise-financeira
description: "Análise financeira detalhada dos custos operacionais da solução Effatha"
---

# Análise Financeira

## Visão Geral

Este documento apresenta a análise financeira detalhada dos custos operacionais da plataforma Effatha, considerando dois cenários de implantação: **Custo-Benefício** (para validação e fase inicial) e **Premium** (para escala e produção comercial). A análise contempla custos de infraestrutura, deploy, processamento de dados geoespaciais e manutenção.

## 1. Cenários de Implantação

### 1.1 Cenário Custo-Benefício

Cenário destinado à fase de validação do produto e operação com volume controlado de usuários (até 10 membros da equipe).


#### Composição de Custos - Cenário Custo-Benefício

| Serviço | Plano | Valor Mensal | Finalidade |
|---------|-------|--------------|------------|
| Supabase | Pro | US$ 25,00 | Banco de dados PostgreSQL gerenciado |
| Render | Pro | US$ 19,00 | Deploy e hospedagem da aplicação |
| Google Earth Engine | Enterprise Basic | US$ 500,00 | Processamento de dados geoespaciais |
| Manutenção | - | US$ 250,00 | Suporte técnico e ajustes |
| **TOTAL** | - | **US$ 794,00** | - |

### 1.2 Cenário Premium

Cenário destinado à operação comercial em escala, com garantias de performance, segurança aprimorada e suporte prioritário.

#### Composição de Custos - Cenário Premium

| Serviço | Plano | Valor Mensal | Finalidade |
|---------|-------|--------------|------------|
| Supabase | Pro | US$ 25,00 | Banco de dados PostgreSQL gerenciado |
| Render | Organization | US$ 29,00 | Deploy e hospedagem com conformidade |
| Google Earth Engine | Professional | US$ 2.000,00 | Processamento enterprise com SLA |
| Manutenção | - | US$ 250,00 | Suporte técnico especializado |
| **TOTAL** | - | **US$ 2.304,00** | - |

## 2. Detalhamento dos Serviços

### 2.1 Supabase (Database)

#### Plano Pro - US$ 25,00/mês

**Recursos Incluídos:**

- **100.000 usuários ativos mensais** (MAU)
  - Escalável conforme demanda
  - Autenticação integrada

- **8 GB de espaço em disco por projeto**
  - Compartilhado entre dados e arquivos
  - Expansão: US$ 0,125/GB adicional

- **250 GB de egress**
  - Transferência de dados mensal
  - Adicional: US$ 0,09/GB

- **650 GB de cached egress**
  - Cache CDN para performance
  - Adicional: US$ 0,03/GB

- **100 GB de armazenamento de arquivos**
  - Para uploads e mídia
  - Adicional: US$ 0,021/GB

- **Suporte via email**
- **Backups diários por 7 dias**
- **Retenção de logs de 7 dias**

**Justificativa de Uso:**

O Supabase Pro atende adequadamente ambos os cenários (Custo-Benefício e Premium) devido à:

1. **Escalabilidade natural**: comporta desde a fase de validação até operação com milhares de usuários
2. **Custo-benefício**: oferece recursos enterprise a preço acessível
3. **Integração com PostgreSQL**: permite queries complexas necessárias para análises agropecuárias
4. **Backup automatizado**: garantia de segurança dos dados sem custos adicionais

### 2.2 Render (Deploy e Hospedagem)

#### Plano Pro - US$ 19,00/mês (Custo-Benefício)

**Recursos Incluídos:**

- **Colaboração com 10 membros da equipe**
- **500 GB de bandwidth incluído**
- **Projetos e ambientes ilimitados**
- **Autoscaling horizontal**
- **Ambientes de teste com preview**
- **Conexões de link privado**
- **Ambientes isolados**
- **Suporte via chat**

**Casos de Uso:**

- Validação do produto
- Desenvolvimento colaborativo
- Testes A/B
- Ambientes de staging

#### Plano Organization - US$ 29,00/mês (Premium)

**Recursos Adicionais:**

- **1 TB de bandwidth incluído** (2x do plano Pro)
- **Membros ilimitados de equipe**
- **Logs de auditoria**
- **Certificado SOC 2 Type II**
- **Certificado ISO 27001**

**Diferenciais Enterprise:**

1. **Conformidade**: certificações necessárias para clientes corporativos
2. **Segurança avançada**: logs de auditoria para rastreabilidade
3. **Escalabilidade de equipe**: sem limite de colaboradores
4. **Maior capacidade**: 1 TB de transferência mensal

**Justificativa de Upgrade:**

O upgrade para Organization no cenário Premium se justifica por:

- Requisitos de conformidade de grandes produtores rurais
- Necessidade de logs de auditoria para operações comerciais
- Maior volume de tráfego esperado em produção
- Certificações ISO e SOC 2 exigidas em contratos B2B

### 2.3 Google Earth Engine (GEE)

#### Plano Enterprise Basic - US$ 500,00/mês (Custo-Benefício)

**Recursos Incluídos:**

- **Taxa mensal da plataforma: US$ 500,00**

- **Crédito de EECU em lote:**
  - 100 horas de EECU por mês incluídas
  - Processamento batch de grandes volumes

- **Crédito de EECU on-line:**
  - 33 horas de EECU por mês incluídas
  - Processamento em tempo real via API

- **Crédito de Cloud Storage para Earth Engine:**
  - 100 GB incluídos
  - Armazenamento de assets personalizados

- **Solicitações simultâneas de API de alto volume:**
  - 20 requisições por projeto
  - Para aplicações em tempo real

- **Tarefas simultâneas de exportação em lote:**
  - Até 8 por conta de faturamento
  - Processamento paralelo otimizado

- **SLA (Service Level Agreement):**
  - Indisponível no plano Básico
  - Disponível mediante upgrade para Professional ou Premium

- **VPC Service Controls:**
  - Indisponível no plano Básico
  - Disponível mediante upgrade para Professional ou Premium

**Modelo de Cobrança:**

- **Taxa fixa mensal**: US$ 500,00
- **Custos adicionais** (conforme consumo):
  - EECU em lote: além das 100h incluídas
  - EECU on-line: além das 33h incluídas
  - Cloud Storage: além dos 100 GB incluídos

**Justificativa de Investimento:**

O plano Enterprise Basic é adequado para a fase inicial devido a:

1. **Viabilidade comercial**: licença para uso comercial da plataforma
2. **Créditos incluídos**: 100h batch + 33h online para operação inicial
3. **Escalabilidade**: 20 requisições simultâneas adequadas para 10-20 clientes
4. **Processamento batch**: 8 tarefas paralelas suficientes para validação
5. **Armazenamento**: 100 GB para dados processados iniciais
6. **Custo controlado**: base fixa acessível para validação comercial

**Estimativa de Consumo:**

Para uma operação com 50 propriedades monitoradas:

- **EECU on-line**: ~20h/mês (análises em tempo real)
- **EECU em lote**: ~70h/mês (processamento histórico)
- **Storage**: ~50 GB (assets e resultados processados)

*Consumo dentro dos créditos incluídos, sem custos adicionais esperados.*

#### Plano Professional - US$ 2.000,00/mês (Premium)

**Recursos Incluídos:**

- **Taxa mensal da plataforma: US$ 2.000,00**

- **Crédito de EECU em lote:**
  - 500 horas de EECU por mês incluídas
  - Processamento batch de grandes volumes

- **Crédito de EECU on-line:**
  - 166 horas de EECU por mês incluídas
  - Processamento em tempo real via API

- **Crédito de Cloud Storage para Earth Engine:**
  - 1 TB de crédito incluído
  - Armazenamento de assets personalizados e dados processados

- **Solicitações simultâneas de API de alto volume:**
  - Até 500 requisições por projeto
  - Para aplicações em tempo real e alta demanda

- **Tarefas simultâneas de exportação em lote:**
  - Até 20 por conta de faturamento
  - Processamento paralelo otimizado para grandes operações

- **SLA (Service Level Agreement):**
  - Incluído no plano Professional
  - Garantias de uptime e performance

- **VPC Service Controls:**
  - Compatível
  - Controles de segurança avançados para ambientes enterprise

**Modelo de Cobrança:**

- **Taxa fixa mensal**: US$ 2.000,00
- **Custos adicionais** (conforme consumo):
  - EECU em lote: além das 500h incluídas
  - EECU on-line: além das 166h incluídas
  - Cloud Storage: além de 1 TB incluído

**Justificativa de Investimento:**

O upgrade para Professional no cenário Premium se justifica por:

1. **Viabilidade comercial**: licença para uso comercial sem restrições
2. **SLA garantido**: uptime e performance assegurados contratualmente
3. **Escalabilidade robusta**: 500 requisições simultâneas para alta demanda
4. **Processamento massivo**: 20 tarefas batch paralelas para múltiplas propriedades
5. **Armazenamento enterprise**: 1 TB para assets, modelos e resultados processados
6. **Créditos generosos**: 500h batch + 166h online incluídos mensalmente
7. **Previsibilidade de custos**: base fixa com margem ampla para crescimento

**Estimativa de Consumo:**

Para uma operação com 200 propriedades monitoradas:

- **EECU on-line**: ~120h/mês (análises em tempo real)
- **EECU em lote**: ~350h/mês (processamento histórico)
- **Storage**: ~400 GB (assets e resultados processados)

*Consumo confortavelmente dentro dos créditos incluídos, com margem de 30% para picos sazonais.*

### 2.4 Manutenção

#### Custo-Benefício e Premium - US$ 250,00/mês

**Atividades Incluídas:**

- Monitoramento 24/7 com alertas automatizados
- Correção de bugs críticos em até 24h
- Atualizações de segurança proativas
- Suporte técnico via chat e email (resposta em 4-8h)
- Backup automatizado e verificação de integridade
- Otimização contínua de performance
- Relatórios mensais de saúde do sistema
- Planejamento de capacidade
- Análise de custos operacionais

**Equipe:**

- 1 desenvolvedor backend sênior (12h/mês)
- 1 DevOps especializado (8h/mês)
- 1 especialista GEE (5h/mês)

**Justificativa do Investimento:**

O valor unificado de US$ 250/mês garante suporte profissional contínuo para ambos os cenários, proporcionando:

- Uptime superior a 99,5%
- Tempo de resposta rápido para incidentes
- Otimização proativa de custos de infraestrutura
- Expertise técnica em todas as camadas da stack

## 3. Análise Comparativa

### 3.1 Resumo Executivo

| Aspecto | Custo-Benefício | Premium | Diferencial |
|---------|-----------------|---------|-------------|
| **Investimento Mensal** | US$ 794,00 | US$ 2.304,00 | +190% |
| **Usuários Suportados** | Até 10.000 MAU | Ilimitado | Escalável |
| **Bandwidth** | 500 GB | 1 TB | +100% |
| **Créditos GEE Batch** | 100h/mês | 500h/mês | +400% |
| **Créditos GEE Online** | 33h/mês | 166h/mês | +403% |
| **Requisições GEE** | 20 simultâneas | 500 simultâneas | +2.400% |
| **SLA GEE** | Não | Sim | Enterprise |
| **Uso Comercial** | Sim | Sim | Viabilidade legal |
| **Certificações** | Não | ISO 27001, SOC 2 | Compliance |
| **Suporte** | Email/Chat | Prioritário | +Velocidade |

### 3.2 ROI (Return on Investment)

#### Cenário Custo-Benefício

**Investimento Anual:** US$ 9.528,00

**Retorno Esperado:**

- Validação técnica da solução com uso comercial
- 10-15 clientes iniciais
- Operação comercial em pequena escala
- Base para expansão

**Break-even:** 14-16 clientes (considerando ticket médio de R$ 300/mês ou US$ 60)

#### Cenário Premium

**Investimento Anual:** US$ 27.648,00

**Retorno Esperado:**

Considerando modelo de negócio SaaS:

- **Plano Básico**: R$ 150/mês por propriedade
- **Plano Profissional**: R$ 350/mês por propriedade
- **Plano Enterprise**: R$ 750/mês por propriedade

**Projeção de Receita (Ano 1):**

| Mês | Clientes | Receita Média | Receita Total (R$) | Receita (US$)* |
|-----|----------|---------------|-------------------|----------------|
| 1-3 | 5 | R$ 250 | R$ 1.250 | US$ 250 |
| 4-6 | 15 | R$ 300 | R$ 4.500 | US$ 900 |
| 7-9 | 30 | R$ 350 | R$ 10.500 | US$ 2.100 |
| 10-12 | 50 | R$ 400 | R$ 20.000 | US$ 4.000 |

*Conversão: R$ 5,00 = US$ 1,00

**Break-even:** Mês 11-12 (45-50 clientes)

### 3.3 Escalabilidade dos Custos

#### Crescimento Projetado - Cenário Premium

| Métrica | Mês 6 | Mês 12 | Mês 24 | Observações |
|---------|-------|--------|--------|-------------|
| Clientes | 15 | 50 | 150 | Crescimento orgânico |
| Propriedades | 30 | 100 | 350 | Média 2 props/cliente |
| Usuários ativos | 1.500 | 5.000 | 15.000 | 50 usuários/prop |
| Custo Supabase | US$ 25 | US$ 50 | US$ 125 | +MAU, +storage |
| Custo Render | US$ 29 | US$ 58 | US$ 87 | +bandwidth |
| Custo GEE | US$ 2.000 | US$ 2.500 | US$ 3.200 | +processamento |
| Manutenção | US$ 250 | US$ 400 | US$ 600 | +equipe |
| **TOTAL** | **US$ 2.304** | **US$ 3.008** | **US$ 4.012** | +74% em 24 meses |

**Análise:**

- Custos crescem 74% em 24 meses (de US$ 2.304 para US$ 4.012)
- Receita cresce ~1.500% no mesmo período
- Margem de lucro aumenta significativamente com escala
- Manutenção profissional garante uptime e otimização contínua
- Premium oferece melhor ROI em escala devido a créditos mais generosos do GEE

## 4. Recomendações

### 4.1 Fase Inicial (Meses 1-6)

**Cenário:** Custo-Benefício (US$ 794/mês)

**Justificativa:**

1. Licença comercial desde o início (GEE Enterprise Basic)
2. Investimento controlado para validação de mercado
3. Recursos adequados para operação com 10-20 clientes iniciais
4. Créditos GEE suficientes para até 50 propriedades monitoradas

**Ações:**

- Implementar solução completa
- Validar com 3-5 parceiros
- Coletar métricas de uso
- Ajustar arquitetura

### 4.2 Fase de Crescimento (Meses 7-12)

**Cenário:** Premium (US$ 2.304/mês)

**Justificativa:**

1. Necessidade de certificações de conformidade para clientes enterprise
2. Maior capacidade de bandwidth (1 TB vs 500 GB)
3. Logs de auditoria e compliance
4. Suporte prioritário para operação crítica

**Ações:**

- Upgrade para Render Organization
- Implementar certificações ISO 27001 e SOC 2
- Estruturar equipe de suporte 24/7
- Estabelecer processos de compliance

### 4.3 Otimizações Futuras

#### Curto Prazo (3-6 meses)

1. **Otimização de queries GEE**
   - Reduzir consumo de EECU em 20-30%
   - Implementar cache de resultados
   - Processamento batch noturno

2. **Compressão de dados**
   - Reduzir egress do Supabase
   - Otimizar armazenamento de rasters

3. **CDN para assets estáticos**
   - Reduzir bandwidth do Render
   - Melhorar performance global

#### Médio Prazo (6-12 meses)

1. **Arquitetura multi-tenant otimizada**
   - Compartilhamento eficiente de recursos
   - Redução de custos por cliente

2. **Machine Learning on-premise**
   - Treinar modelos localmente
   - Reduzir dependência de processamento GEE

3. **Negociação de contratos enterprise**
   - Descontos por volume (Supabase, Render)
   - SLA customizado com GEE

## 5. Análise de Riscos Financeiros

### 5.1 Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Aumento de preços dos serviços | Média | Alto | Contratos anuais com desconto |
| Consumo acima do previsto (GEE) | Alta | Alto | Monitoring e alertas de budget |
| Variação cambial (USD/BRL) | Alta | Médio | Precificação dinâmica em R$ |
| Custos de escala não previstos | Média | Médio | Margem de segurança de 20% |
| Falha em atingir break-even | Baixa | Alto | Validação rigorosa de PoC |

### 5.2 Estratégias de Contingência

1. **Budget Cap no GEE**
   - Custo-Benefício: Limite de US$ 900/mês no primeiro ano
   - Premium: Limite de US$ 3.500/mês no primeiro ano
   - Alertas em 70% e 90% dos limites
   - Throttling automático se necessário para evitar overages

2. **Reserva de Emergência**
   - Custo-Benefício: 3 meses (US$ 2.382)
   - Premium: 3 meses (US$ 6.912)
   - Para cobrir imprevistos, picos sazonais e overages

3. **Plano de Downgrade**
   - Possibilidade de retornar ao plano Custo-Benefício
   - Sem lock-in contratual

## 6. Conclusão

A análise financeira demonstra que a solução Effatha possui dois cenários operacionais viáveis e bem estruturados:

### Cenário Custo-Benefício (US$ 794/mês)

- **Ideal para:** Operação inicial, validação comercial, até 20 clientes
- **Vantagens:** Licença comercial, manutenção profissional, créditos GEE adequados
- **Limitações:** Sem SLA GEE, 20 requisições simultâneas, menor bandwidth, sem certificações

### Cenário Premium (US$ 2.304/mês)

- **Ideal para:** Operação enterprise, escala, clientes B2B exigentes
- **Vantagens:** Certificações ISO/SOC2, maior bandwidth, logs de auditoria, manutenção profissional 24/7
- **ROI:** Break-even em 11-12 meses com 45-50 clientes

### Recomendação Final

**Fase 1 (0-6 meses):** Iniciar com Custo-Benefício (US$ 794/mês) para validação comercial com 10-20 clientes

**Fase 2 (7-12 meses):** Migrar para Premium (US$ 2.304/mês) ao atingir 20-30 clientes pagantes e necessidade de:

- SLA garantido do GEE
- Maior capacidade de processamento (500 requisições simultâneas)
- Certificações de compliance (ISO 27001, SOC 2)
- Créditos generosos (500h batch + 166h online)

**Fase 3 (12+ meses):** Escalar organicamente, mantendo margem de lucro crescente (75%+ após 24 meses)

O modelo oferece **flexibilidade inicial com US$ 794/mês e escalabilidade para US$ 2.304/mês**, ambos com uso comercial irrestrito e manutenção profissional incluída. ROI atrativo desde o 14º-16º cliente no Custo-Benefício e 11º-12º mês (45-50 clientes) no Premium.

---

## Referências

1. **Supabase Pricing.** Disponível em: [https://supabase.com/pricing](https://supabase.com/pricing). Acesso em: 22 nov. 2025.

2. **Render Pricing.** Disponível em: [https://render.com/pricing](https://render.com/pricing). Acesso em: 22 nov. 2025.

3. **Google Earth Engine Pricing.** Disponível em: [https://cloud.google.com/earth-engine/pricing?hl=pt-br#enterprise](https://cloud.google.com/earth-engine/pricing?hl=pt-br#enterprise). Acesso em: 22 nov. 2025.

---
