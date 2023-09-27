// http://localgost:3000/create_user

const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_users'
};

const secret = crypto.randomBytes(32).toString('hex');

function checkAuthentication(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/');
    }
}

// Middleware para analisar corpos de solicitação JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/web'));

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web/public/index.html'));
});

app.post('/create_user', async (req, res) => {
    try {
        const { login, email, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 8);

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO Usuarios (user_name, email, pwdHash) VALUES (?, ?, ?)',
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
        const [users] = await connection.execute('SELECT pkUser, user_name, email, created_at FROM Usuarios');
        connection.end();

        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.post('/authenticate_user', async (req, res) => {
    try {
        const { email, password } = req.body;

        const connection = await mysql.createConnection(dbConfig);

        // Consulta o banco de dados para obter a senha hash para o email fornecido
        const [rows] = await connection.execute('SELECT pwdHash FROM Usuarios WHERE email = ?', [email]);

        if (rows.length > 0) {
            const pwdHashFromDB = rows[0].pwdHash;

            // Usa bcrypt para verificar se a senha fornecida corresponde à senha hash do banco de dados
            const passwordIsValid = bcrypt.compareSync(password, pwdHashFromDB);

            if (passwordIsValid) {
                req.session.isAuthenticated = true;
                req.session.email = email;
                res.redirect('/profile');
            } else {
                res.status(401).send("Senha incorreta!");
            }
        } else {
            res.status(404).send("Usuário não encontrado!");
        }

        connection.end();
    } catch (error) {
        console.error("Erro detalhado:", error);  // Log do erro detalhado
        res.status(500).send("Erro ao autenticar o usuário!");
    }

});

app.get('/user_data', checkAuthentication, async (req, res) => {
    try {
        const email = req.session.email;

        const connection = await mysql.createConnection(dbConfig);
        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [email]);
        const pkUser = pkUserSQL[0][0].pkUser;

        const user = await connection.execute('SELECT User.user_name, User.email, User.pwdHash, Tel.numero as telefone, Ed.estado, Ed.cidade, Ed.cep, Ed.numero FROM Usuarios as User INNER JOIN Telefone as Tel ON Tel.fkUser = User.pkUser INNER JOIN Endereco as Ed ON Ed.fkUser = User.pkUser WHERE pkUser = ?', [pkUser]);

        connection.end();
        res.status(200).send(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Inernal Server error" });
    };
})

app.get('/profile', checkAuthentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'web/public/profile.html'));
});