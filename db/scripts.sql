UPDATE Usuarios SET user_name = "guilherme.thomaz@email.com" WHERE pkUser = 2;

UPDATE Usuarios SET user_name = "guilherme.thomaz", email = "guilherme.thomaz@email.com" WHERE pkUser = 2;

DELETE FROM Usuarios WHERE pkUser = 3;

INSERT INTO Telefone VALUES(NULL, "62111111111", 1);
INSERT INTO Endereco VALUES(NULL, "GO", "Goiania", 1, "74000000", 1);
