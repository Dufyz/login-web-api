const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
const port = 3000;

//Funções
function checkAuthentication(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/');
    }
}

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'app',
    password: 'Senha_app@2',
    database: 'db_users'
};

//Segredo do encript
const secret = crypto.randomBytes(32).toString('hex');

// Middleware para analisar corpos de solicitação JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(__dirname + '/web'));

//Criando porta do servidor
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

//Requisições GET
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web/public/index.html'));
});

app.get('/profile', checkAuthentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'web/public/profile.html'));
});

app.get('/user_data', checkAuthentication, async (req, res) => {
    try {
        const email = req.session.email;
        const connection = await mysql.createConnection(dbConfig);

        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [email]);
        const pkUser = pkUserSQL[0][0].pkUser;

        user = {
            user_name: "",
            email: "",
            telefone: "",
            rua: "",
            estado: "",
            cidade: "",
            cep: "",
            numero: ""
        }

        sql = await connection.execute('SELECT user_name, email FROM Usuarios WHERE pkUser = ?', [pkUser]);
        user.user_name = sql[0][0].user_name;
        user.email = sql[0][0].email;

        sql = await connection.execute('SELECT numero FROM Telefone WHERE fkUser = ?', [pkUser]);
        if (sql[0][0]?.numero) {
            user.telefone = sql[0][0].numero;
        }


        sql = await connection.execute('SELECT rua, estado, cidade, cep, numero FROM Endereco WHERE fkUser = ?', [pkUser]);
        if (sql[0][0]?.numero) {
            user.rua = sql[0][0].rua;
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

//Requisições POST
app.post('/create_user', async (req, res) => {
    try {
        const { create_user_name, create_email, create_password } = req.body;

        const hashedPassword = bcrypt.hashSync(create_password, 8);

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO Usuarios (user_name, email, pwdHash) VALUES (?, ?, ?)',
            [create_user_name, create_email, hashedPassword]
        );

        connection.end();
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error', success: false });
    }
});

app.post('/authenticate_user', async (req, res) => {
    try {
        const { login_email, login_password } = req.body;
        const connection = await mysql.createConnection(dbConfig);

        // Consulta o banco de dados para obter a senha hash para o email fornecido
        const [rows] = await connection.execute('SELECT pwdHash FROM Usuarios WHERE email = ?', [login_email]);

        if (rows.length > 0) {
            const pwdHashFromDB = rows[0].pwdHash;

            // Usa bcrypt para verificar se a senha fornecida corresponde à senha hash do banco de dados
            const passwordIsValid = bcrypt.compareSync(login_password, pwdHashFromDB);

            if (passwordIsValid) {
                req.session.isAuthenticated = true;
                req.session.email = login_email;
                res.redirect('/profile');
            } else {
                res.status(401).send("Senha incorreta!");
            }
        } else {
            res.status(404).send("Usuário não encontrado!");
        }

        connection.end();
    } catch (error) {
        console.error("Erro detalhado:", error);  
        res.status(500).send("Erro ao autenticar o usuário!");
    }
});

app.post('/logout', async (req, res) => {
    try {
        req.session.isAuthenticated = false;
        res.redirect('/');
    } catch (error) {
        console.error("Erro detalhado:", error);  
        res.status(500).send("Erro ao efetuar logout!");
    }
});

app.post('/recover_password', async (req, res) => {
    try {
        const {recover_email, recover_password} = req.body;
        const connection = await mysql.createConnection(dbConfig);

        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [recover_email]);
        const pkUser = pkUserSQL[0][0].pkUser;

        const hashedPassword = bcrypt.hashSync(recover_password, 8);
        const sql = await connection.execute("UPDATE Usuarios SET pwdHash = ? WHERE pkUser = ?", [hashedPassword, pkUser]);

        connection.end();

        res.redirect("/")
    } catch(error) {
        console.error("Erro detalhado:", error);  
        res.status(500).send("Erro ao resetar senha!");
    }
});

//Requisições UPDATE
app.put('/update_user', async (req, res) => {
    try {
        const { update_telefone, update_rua, update_estado, update_cidade, update_cep, update_numero } = req.body;
        const email = req.session.email;
        const connection = await mysql.createConnection(dbConfig);

        const pkUserSQL = await connection.execute('SELECT pkUser FROM Usuarios WHERE email = ?', [email]);
        const pkUser = pkUserSQL[0][0].pkUser;

        const [rows_telefone] = await connection.execute('SELECT numero FROM Telefone WHERE fkUser = ?', [pkUser]);

        if(update_telefone != null) {
            if (rows_telefone.length > 0) {
                sql = await connection.execute(
                    'UPDATE Telefone SET numero = ? WHERE fkUser = ?',
                    [update_telefone, pkUser]
                );
            } else {
                sql = await connection.execute('INSERT INTO Telefone VALUES(NULL, ?, ?)', [update_telefone, pkUser]);
                
            }   
        }

        const [rows_endereco] = await connection.execute('SELECT estado FROM Endereco WHERE fkUser = ?', [pkUser]);

        if(update_rua != null && update_estado != null && update_cidade != null && update_cep != null && update_numero){
            if (rows_endereco.length > 0) {
                sql = await connection.execute('UPDATE Endereco SET rua = ?, estado = ?, cidade = ?, numero = ?, cep = ? WHERE fkUser = ?', [update_rua, update_estado, update_cidade, update_numero, update_cep, pkUser]);
            } else {
                sql = await connection.execute('INSERT INTO Endereco VALUES(NULL, ?, ?, ?, ?, ?, ?)', [update_rua, update_estado, update_cidade, update_numero, update_cep, pkUser]);
            }
        }

        connection.end();
        res.status(201).send({ message: 'Updated!' });
    } catch (error) {
        console.error("Erro detalhado:", error);  
        res.status(500).send("Erro ao efetuar update!");
    }
});


//Requisições DELETE
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

        connection.end();7

        res.status(200).send({ success: true });
    } catch (error) {
        console.error("Erro detalhado:", error);  
        res.status(500).send("Erro ao excluir usuário!");
    }
})