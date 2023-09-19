// http://localgost:3000/create_user

const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_usuarios'
};

// Middleware para analisar corpos de solicitação JSON
app.use(bodyParser.json());

app.post('/create_user', async (req, res) => {
    try {
        const { login, email, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 8);

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO Usuarios (login, email, pwdHash) VALUES (?, ?, ?)',
            [login, email, hashedPassword]
        );

        connection.end();

        res.status(201).send({ message: 'New user created!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

