CREATE DATABASE db_users_logs;
ALTER DATABASE db_users_logs CHARACTER SET = utf8mb3;

USE db_users_logs;

CREATE TABLE Usuarios(
    pkUser_log INT PRIMARY KEY AUTO_INCREMENT,
    pkUser INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pwdHash VARCHAR(255) NOT NULL,
    ALT ENUM('I', 'U', 'D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Endereco(
    pkEndereco_log INT PRIMARY KEY AUTO_INCREMENT,
    pkEndereco INT NOT NULL,
    rua VARCHAR(255) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    numero INT NOT NULL,
    cep VARCHAR(8) NOT NULL,
    fkUser INT NOT NULL,
    ALT ENUM('I', 'U', 'D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Telefone(
    pkTelefone_log INT PRIMARY KEY AUTO_INCREMENT,
    pkTelefone INT NOT NULL,
    numero VARCHAR(255) NOT NULL,
    fkUser INT NOT NULL,
    ALT ENUM('I', 'U', 'D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
