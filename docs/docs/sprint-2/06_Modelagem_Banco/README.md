---
sidebar_position: 1
---

# Modelagem do Banco de Dados

Esta seção apresenta a modelagem e estrutura do banco de dados do sistema.

## Objetivo

Documentar a estrutura de dados que suporta todas as funcionalidades da plataforma, incluindo entidades, relacionamentos e constraints.

## Principais Entidades

- **Usuários**: Informações de autenticação e perfil
- **Propriedades**: Dados das propriedades rurais cadastradas
- **Áreas**: Delimitações geográficas para análise
- **Métricas**: Dados coletados de vegetação e solo
- **Métricas Preditivas**: Previsões geradas pelos modelos
- **Relatórios**: Relatórios consolidados para visualização

## Tecnologias

- PostgreSQL como SGBD
- SQLAlchemy como ORM
- Migrations para controle de versão do schema
