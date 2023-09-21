CREATE DATABASE db_usuarios;
ALTER DATABASE db_usuarios CHARACTER SET = utf8mb3;

USE db_usuarios;

CREATE TABLE Usuarios(
	pkUser INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwdHash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modify_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Endereco(
    pkEndereco INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(2) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    fkUser INT NOT NULL UNIQUE
);

ALTER TABLE Endereco 
ADD CONSTRAINT fk_Usuarios_Endereco FOREIGN KEY(fkUser) REFERENCES Usuarios(pkUser);

CREATE TABLE Post(
    pkPost INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    body VARCHAR(255) NOT NULL,
    likes INT,
    fkUser INT NOT NULL
);

ALTER TABLE Post
ADD CONSTRAINT fk_Usuarios_Post FOREIGN KEY(fkUser) REFERENCES Usuarios(pkUser);

