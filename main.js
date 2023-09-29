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

app.get('/user_data', checkAuthentication, async (req, res) => {
    try {
        const email = req.session.email;

        const connection = await mysql.createConnection(dbConfig);
        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [email]);
        const pkUser = pkUserSQL[0][0].pkUser;

        user = {
            user_name: "#",
            email: "#",
            telefone: "#",
            // pwdHash: "*********",
            estado: "#",
            cidade: "#",
            cep: "#",
            numero: "#"
        }

        sql = await connection.execute('SELECT user_name, email FROM Usuarios WHERE pkUser = ?', [pkUser]);
        user.user_name = sql[0][0].user_name;
        user.email = sql[0][0].email;

        sql = await connection.execute('SELECT numero FROM Telefone WHERE fkUser = ?', [pkUser]);

        if (sql[0][0]?.numero) {
            user.telefone = sql[0][0].numero;
        }


        sql = await connection.execute('SELECT estado, cidade, cep, numero FROM Endereco WHERE fkUser = ?', [pkUser]);

        if (sql[0][0]?.numero) {
            user.estado = sql[0][0].estado;
            user.cidade = sql[0][0].cidade;
            user.cep = sql[0][0].cep;
            user.numero = sql[0][0].numero;
        }

        connection.end();
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Inernal Server error" });
    };
})

app.get('/profile', checkAuthentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'web/public/profile.html'));
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

        res.status(201).send({ message: 'New user created!', success: true});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error', success: false });
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

app.post('/logout', async (req, res) => {
    try {
        req.session.isAuthenticated = false;
        res.redirect('/');
    } catch (error) {
        console.error("Erro detalhado:", error);  // Log do erro detalhado
        res.status(500).send("Erro ao efetuar logout!");
    }
});

app.put('/update_user', async (req, res) => {
    try {
        const { telefone, estado, cidade, cep, numero    } = req.body;
        const email = req.session.email;
        const connection = await mysql.createConnection(dbConfig);

        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [email]);
        const pkUser = pkUserSQL[0][0].pkUser;

        const [rows_telefone] = await connection.execute('SELECT numero FROM Telefone WHERE fkUser = ?', [pkUser]);

        if (rows_telefone.length > 0) {
            sql = await connection.execute(
                'UPDATE Telefone SET numero = ? WHERE fkUser = ?',
                [telefone, pkUser]
            );
        } else {
            sql = await connection.execute('INSERT INTO Telefone VALUES(NULL, ?, ?)', [telefone, pkUser]);
        }

        const [rows_endereco] = await connection.execute('SELECT estado FROM Endereco WHERE fkUser = ?', [pkUser]);

        if (rows_endereco.length > 0) {
            sql = await connection.execute('UPDATE Endereco SET estado = ?, cidade = ?, cep = ?, numero = ? WHERE fkUser = ?', [estado, cidade, numero, cep, pkUser]);
        } else {
            sql = await connection.execute('INSERT INTO Endereco VALUES(NULL, ?, ?, ?, ?, ?)', [estado, cidade, numero, cep, pkUser]);
        }

        connection.end();
        res.status(201).send({ message: 'Updated!' });
    } catch (error) {
        console.error("Erro detalhado:", error);  // Log do erro detalhado
        res.status(500).send("Erro ao efetuar update!");
    }
});

app.delete('/delete_user', async (req, res) => {
    try {
        const email = req.session.email;
        const connection = await mysql.createConnection(dbConfig);

        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [email]);
        const pkUser = pkUserSQL[0][0].pkUser;


        sql = await connection.execute('SELECT numero From Telefone WHERE fkUser = ?', [pkUser]);
        if (sql.length > 0) {
            sql = await connection.execute('DELETE From Telefone WHERE fkUser = ?', [pkUser]);
        }

        sql = await connection.execute('SELECT numero From Endereco WHERE fkUser = ?', [pkUser]);
        if (sql.length > 0) {
            sql = await connection.execute('DELETE From Endereco WHERE fkUser = ?', [pkUser]);
        }

        sql = await connection.execute('DELETE From Usuarios WHERE pkUser = ?', [pkUser]);

        connection.end();

        res.status(200).send({ success: true });
    } catch (error) {
        console.error("Erro detalhado:", error);  // Log do erro detalhado
        res.status(500).send("Erro ao excluir usuário!");
    }
})