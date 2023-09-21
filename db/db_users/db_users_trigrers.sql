USE db_users;

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