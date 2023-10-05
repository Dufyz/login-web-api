# 🌐 Login WEB API

Um sistema web que permite a criação de usuários, autenticação de login com banco de dados e consumo de API.

## ℹ️ Sobre o Projeto

Este é um projeto pessoal criado com o objetivo de desenvolver e aprimorar habilidades de programação relacionadas à construção de sites e à implementação de sistemas de autenticação, bancos de dados e consumo de API.

## 📝 Tecnologias

- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [MySQL](https://www.mysql.com/)
- [HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS)

## 👨‍🏫 Como Usar

Para utilizar a aplicação, siga os seguintes passos:

### 1. Configuração Inicial

- Clone o repositório em seu ambiente local.
- Configure um servidor local, como o [WAMP SERVER](https://www.wampserver.com/en/).
- Certifique-se de ter um banco de dados relacional, como o [MySQL](https://www.mysql.com/), configurado e em execução.
- Garanta que o [Node.js](https://nodejs.org/pt-br) esteja instalado.

### 2. Configuração do Banco de Dados

- Execute os scripts da pasta "db" no seu terminal MySQL na seguinte ordem: "db_users.sql" > "db_users_triggers.sql" > "db_users_logs.sql".

### 3. Instalação de Dependências

- No diretório raiz do projeto, execute o seguinte comando para iniciar o projeto:

```bash
npm init
```

- No diretório raiz do projeto, execute o seguinte comando para instalar todas as bibliotecas Node.js necessárias:

```bash
npm install express express-session mysql2-promise bcryptjs 
```

### 4. Execução da Aplicação

- Execute o arquivo main.js para iniciar o servidor da aplicação:
- Abra o arquivo index.html em seu navegador web.

### 5. Utilização

Na página inicial da aplicação (`index.html`), você encontrará as seguintes funcionalidades:

#### Autenticação de Usuário

- Na aba "Login", você pode autenticar seu usuário com suas credenciais.
- Após a autenticação, você será redirecionado para a página do seu perfil.

#### Registro de Novo Usuário

- Na aba "Registro", é possível criar um novo usuário preenchendo as informações necessárias.
- Após o registro, você poderá usar as credenciais recém-criadas para fazer login.

#### Recuperação de Senha

- A aba "Recuperar Senha" permite que você redefina a senha do seu usuário, caso a tenha esquecido ou deseje alterá-la.
- Siga as instruções fornecidas para redefinir sua senha com segurança.

#### Gerenciamento de Perfil

- Após fazer login, você será redirecionado para a página do seu perfil.
- Aqui, você pode adicionar informações extras, como telefone e endereço, se desejar.

Aproveite a aplicação e explore suas funcionalidades! Sinta-se à vontade para contribuir com melhorias ou relatar problemas por meio de issues no repositório.
