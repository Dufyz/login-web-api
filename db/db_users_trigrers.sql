USE db_users;

-- Usuarios Triggers

DELIMITER $

CREATE TRIGGER Usuarios_log_i
AFTER INSERT ON Usuarios
FOR EACH ROW
BEGIN
    INSERT INTO db_users_logs.Usuarios VALUES(NULL, NEW.pkUser, NEW.user_name, NEW.email, NEW.pwdHash, 'I', NOW());
END
$

CREATE TRIGGER Usuarios_log_u
AFTER UPDATE ON Usuarios
FOR EACH ROW
BEGIN
    INSERT INTO db_users_logs.Usuarios VALUES(NULL, NEW.pkUser, NEW.user_name, NEW.email, NEW.pwdHash, 'U', NOW());
END
$

CREATE TRIGGER Usuarios_log_d
BEFORE DELETE ON Usuarios
FOR EACH ROW 
BEGIN   
    INSERT INTO db_users_logs.Usuarios VALUES(NULL, OLD.pkUser, OLD.user_name, OLD.email, OLD.pwdHash, 'D', NOW());
END
$

DELIMITER ;

-- Endereco Triggers

DELIMITER $

CREATE TRIGGER Endereco_log_i
AFTER INSERT ON Endereco
FOR EACH ROW
BEGIN
    INSERT INTO db_users_logs.Endereco VALUES(NULL, NEW.pkEndereco, NEW.rua, NEW.estado, NEW.cidade, NEW.numero, NEW.cep, NEW.fkUser, 'I', NOW());
END
$

CREATE TRIGGER Endereco_log_u
AFTER UPDATE ON Endereco
FOR EACH ROW
BEGIN
    INSERT INTO db_users_logs.Endereco VALUES(NULL, NEW.pkEndereco, NEW.rua, NEW.estado, NEW.cidade, NEW.numero, NEW.cep, NEW.fkUser, 'U', NOW());
END
$

CREATE TRIGGER Endereco_log_d
BEFORE DELETE ON Endereco
FOR EACH ROW 
BEGIN   
    INSERT INTO db_users_logs.Endereco VALUES(NULL, OLD.pkEndereco, OLD.rua, OLD.estado, OLD.cidade, OLD.numero, OLD.cep, OLD.fkUser, 'D', NOW());
END
$

DELIMITER ;

-- Telefone Triggers 

DELIMITER $

CREATE TRIGGER Telefone_log_i
AFTER INSERT ON Telefone
FOR EACH ROW
BEGIN
    INSERT INTO db_users_logs.Telefone VALUES(NULL, NEW.pkTelefone, NEW.numero, NEW.fkUser, 'I', NOW());
END
$

CREATE TRIGGER Telefone_log_u
AFTER UPDATE ON Telefone
FOR EACH ROW
BEGIN
    INSERT INTO db_users_logs.Telefone VALUES(NULL, NEW.pkTelefone, NEW.numero, NEW.fkUser, 'U', NOW());
END
$

CREATE TRIGGER Telefone_log_d
BEFORE DELETE ON Telefone
FOR EACH ROW 
BEGIN   
    INSERT INTO db_users_logs.Telefone VALUES(NULL, OLD.pkTelefone, OLD.numero, OLD.fkUser, 'D', NOW());
END
$

DELIMITER ;