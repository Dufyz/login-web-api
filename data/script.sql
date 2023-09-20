CREATE DATABASE db_usuarios;
ALTER DATABASE db_usuarios CHARACTER SET = utf8mb3;

USE db_usuarios;

CREATE TABLE Usuarios(
	pkUser INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwdHash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modify_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);
