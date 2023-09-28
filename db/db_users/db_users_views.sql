SELECT pkUser FROM Usuarios WHERE email = '';

SELECT User.user_name, User.email, User.pwdHash, Tel.numero, Ed.estado, Ed.cidade, Ed.cep, Ed.numero FROM Usuarios as User
INNER JOIN Telefone as Tel ON Tel.fkUser = User.pkUser
INNER JOIN Endereco as Ed ON Ed.fkUser = User.pkUser
WHERE pkUser = 2; 

UPDATE Telefone SET numero = ? WHERE fkUser = ?;
UPDATE Endereco SET estado = "MG", cidade = "Belo Horizonte", cep = "22333444", numero = 999 WHERE fkUser = 2;