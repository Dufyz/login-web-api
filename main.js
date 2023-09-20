// http://localgost:3000/create_user

const path = require('path');
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
app.use(express.static(__dirname + '/web'));

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

app.get('/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.execute('SELECT pkUser, login, email, created_at FROM Usuarios');
        connection.end();

        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web/public/index.html'));
});