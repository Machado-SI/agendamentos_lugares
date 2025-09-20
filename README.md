# Sistema de Agendamento de Locais

## Descrição

Este projeto é um sistema completo de agendamento de locais que permite aos usuários visualizar espaços disponíveis, realizar reservas e gerenciar seus agendamentos. O sistema inclui autenticação de usuários para acesso personalizado e seguro. É composto por um backend em Node.js com Express e um frontend em React.

## Tecnologias Utilizadas

### Backend
- Node.js - Ambiente de execução JavaScript
- Express.js - Framework web para Node.js
- PostgreSQL - Banco de dados relacional
- Cors - Middleware para controle de acesso
- Dotenv - Gerenciamento de variáveis de ambiente
- jsonwebtoken - Autenticação via tokens JWT
- yup - Validação de dados e esquemas
- node-pg-migrate - Gerenciamento de migrações do PostgreSQL
- bcryptjs - Criptografia de senhas

### Frontend
- React - Biblioteca JavaScript para interfaces
- Tailwind CSS - Framework CSS para estilização
- Fetch API - Para requisições HTTP
- react-router-dom - Gerencia rotas react

## Funcionalidades

### Backend API

#### Endpoints Disponíveis:

- **GET `/lugares`** - Retorna todos os locais disponíveis
- **POST `/agendar`** - Cria um novo agendamento
- **GET `/agendamentos`** - Retorna todos os agendamentos
- **POST `/register`** - Registra um novo usuário no banco de dados
- **POST `/login`** - Permite o usuário logar para conseguir um token de acesso
- **DELETE `/agendamentos/:id`** - Deleta um agendamento específico

### Frontend Interface

- Lista de locais disponíveis com informações detalhadas
- Formulário para agendamento de locais
- Visualização de agendamentos existentes
- Funcionalidade de exclusão de agendamentos