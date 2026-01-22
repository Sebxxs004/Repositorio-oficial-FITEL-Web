-- =====================================================
-- Script de Funciones - FITEL Web
-- Funciones útiles para el sistema
-- =====================================================

-- Función: Generar Código Único Numérico (CUN) para PQR
DELIMITER //

CREATE FUNCTION IF NOT EXISTS generate_cun() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE new_cun VARCHAR(50);
    DECLARE year_code VARCHAR(2);
    DECLARE sequence_num INT;
    
    SET year_code = RIGHT(YEAR(NOW()), 2);
    
    -- Obtener el siguiente número de secuencia
    SELECT COALESCE(MAX(CAST(SUBSTRING(cun, 5) AS UNSIGNED)), 0) + 1
    INTO sequence_num
    FROM pqr
    WHERE cun LIKE CONCAT('CUN', year_code, '%')
    AND cun REGEXP '^CUN[0-9]{2}[0-9]+$';
    
    -- Formato: CUN + Año (2 dígitos) + Secuencia (6 dígitos)
    SET new_cun = CONCAT('CUN', year_code, LPAD(sequence_num, 6, '0'));
    
    RETURN new_cun;
END //

DELIMITER ;

-- Función: Calcular días hábiles entre dos fechas (excluyendo fines de semana)
DELIMITER //

CREATE FUNCTION IF NOT EXISTS business_days(start_date DATE, end_date DATE)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE days_count INT DEFAULT 0;
    DECLARE curr_date DATE;
    
    SET curr_date = start_date;
    
    WHILE curr_date <= end_date DO
        -- Excluir sábados (6) y domingos (0)
        IF DAYOFWEEK(curr_date) NOT IN (1, 7) THEN
            SET days_count = days_count + 1;
        END IF;
        SET curr_date = DATE_ADD(curr_date, INTERVAL 1 DAY);
    END WHILE;
    
    RETURN days_count;
END //

DELIMITER ;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
