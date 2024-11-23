DELIMITER //

CREATE PROCEDURE sp_criar_avaliacao (
    IN p_cd_cnpj VARCHAR(19),
    IN p_avaliacao DECIMAL(3, 1),
    IN p_ds_comentario TEXT,
    IN p_id INT
)
BEGIN

    IF NOT EXISTS (SELECT 1 FROM Empresas WHERE cd_cnpj = p_cd_cnpj) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CNPJ da empresa não encontrado';
    END IF;


    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ID do usuário não encontrado';
    END IF;


    IF p_avaliacao < 0 OR p_avaliacao > 5 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Avaliação deve estar entre 0 e 5';
    END IF;

    INSERT INTO Avaliacoes (cd_cnpj, avaliacao, ds_comentario, id)
    VALUES (p_cd_cnpj, p_avaliacao, p_ds_comentario, p_id);
END //

	CREATE TRIGGER antes_criar_avaliacao
	BEFORE INSERT ON Avaliacoes
	FOR EACH ROW
	BEGIN
		-- Inserir na tabela de log
		INSERT INTO LogAvaliacoes (log_action, cd_avaliacao, cd_cnpj, avaliacao, ds_comentario, id)
		VALUES ('INSERT', NEW.cd_avaliacao, NEW.cd_cnpj, NEW.avaliacao, NEW.ds_comentario, NEW.id);
	END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_editar_avaliacao (
    IN p_cd_avaliacao INT,
    IN p_cd_cnpj VARCHAR(19),
    IN p_avaliacao DECIMAL(3, 1),
    IN p_ds_comentario TEXT,
    IN p_id INT
)
BEGIN

    IF NOT EXISTS (SELECT 1 FROM Empresas WHERE cd_cnpj = p_cd_cnpj) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CNPJ da empresa não encontrado';
    END IF;


    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ID do usuário não encontrado';
    END IF;


    IF p_avaliacao < 0 OR p_avaliacao > 5 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Avaliação deve estar entre 0 e 5';
    END IF;

    UPDATE Avaliacoes
    SET cd_cnpj = p_cd_cnpj,
        avaliacao = p_avaliacao,
        ds_comentario = p_ds_comentario,
        id = p_id
    WHERE cd_avaliacao = p_cd_avaliacao;
END //


CREATE TRIGGER antes_editar_avaliacao
BEFORE UPDATE ON Avaliacoes
FOR EACH ROW
BEGIN
	-- Inserir na tabela de log
	INSERT INTO LogAvaliacoes (log_action, cd_avaliacao, cd_cnpj, avaliacao, ds_comentario, id)
	VALUES ('UPDATE', OLD.cd_avaliacao, NEW.cd_cnpj, NEW.avaliacao, NEW.ds_comentario, NEW.id);
END //

DELIMITER //

CREATE PROCEDURE sp_ver_avaliacao(
    IN p_cd_avaliacao INT
)
BEGIN
    SELECT cd_avaliacao, cd_cnpj, avaliacao, ds_comentario, id
    FROM Avaliacoes
    WHERE cd_avaliacao = p_cd_avaliacao;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_delete_avaliacao (
    IN p_cd_avaliacao INT
)
BEGIN
    DELETE FROM Avaliacoes
    WHERE cd_avaliacao = p_cd_avaliacao;
END //

CREATE TRIGGER antes_deletar_avaliacao
BEFORE DELETE ON Avaliacoes
FOR EACH ROW
BEGIN
    -- Inserir na tabela de log
    INSERT INTO LogAvaliacoes (log_action, cd_avaliacao, cd_cnpj, avaliacao, ds_comentario, id)
    VALUES ('DELETE', OLD.cd_avaliacao, OLD.cd_cnpj, OLD.avaliacao, OLD.ds_comentario, OLD.id);
END //

DELIMITER ;
