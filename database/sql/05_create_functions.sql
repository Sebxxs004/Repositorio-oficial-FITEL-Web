-- =====================================================
-- Script de Funciones - FITEL Web
-- Funciones útiles para el sistema
-- =====================================================

-- Función: Generar Código Único Numérico (CUN) para PQR
-- Formato: Número de Convenio + Año (2 dígitos) + Secuencia (6 dígitos)
-- Ejemplo: 1234524000001 (Convenio 12345, Año 2024, Secuencia 000001)
DELIMITER //

CREATE FUNCTION IF NOT EXISTS generate_cun() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE new_cun VARCHAR(50);
    DECLARE convenio_number VARCHAR(20);
    DECLARE year_code VARCHAR(2);
    DECLARE sequence_num INT;
    DECLARE cun_pattern VARCHAR(100);
    
    -- Obtener el número de convenio de la configuración del sistema
    SELECT COALESCE(config_value, '00000') INTO convenio_number
    FROM system_config
    WHERE config_key = 'pqr_convenio_number'
    LIMIT 1;
    
    -- Si no existe, usar un valor por defecto
    IF convenio_number IS NULL OR convenio_number = '' THEN
        SET convenio_number = '00000';
    END IF;
    
    SET year_code = RIGHT(YEAR(NOW()), 2);
    
    -- Construir el patrón para buscar el último CUN del año actual
    -- El patrón será: convenio_number + year_code + secuencia
    SET cun_pattern = CONCAT(convenio_number, year_code, '%');
    
    -- Obtener el siguiente número de secuencia para este año y convenio
    -- Extraer la secuencia desde la posición después del convenio + año (2 dígitos)
    -- La secuencia empieza en: LENGTH(convenio_number) + LENGTH(year_code) + 1
    -- Como year_code siempre tiene 2 dígitos: LENGTH(convenio_number) + 3
    SELECT COALESCE(MAX(CAST(SUBSTRING(cun COLLATE utf8mb4_unicode_ci, LENGTH(convenio_number) + 3) AS UNSIGNED)), 0) + 1
    INTO sequence_num
    FROM pqr
    WHERE cun COLLATE utf8mb4_unicode_ci LIKE cun_pattern COLLATE utf8mb4_unicode_ci
    AND LENGTH(cun) >= LENGTH(convenio_number) + 8  -- Mínimo: convenio + año (2) + secuencia (6)
    AND cun COLLATE utf8mb4_unicode_ci REGEXP CONCAT('^', convenio_number COLLATE utf8mb4_unicode_ci, '[0-9]{2}[0-9]{6}$') COLLATE utf8mb4_unicode_ci;
    
    -- Formato: Número de Convenio + Año (2 dígitos) + Secuencia (6 dígitos)
    SET new_cun = CONCAT(convenio_number, year_code, LPAD(sequence_num, 6, '0'));
    
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
