-- =====================================================
-- Script de Actualización de Tabla PQR
-- Agrega campo para adjuntos en la respuesta
-- =====================================================

USE fitel_db;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS add_response_attachment_path()
BEGIN
    -- Verificar y agregar columna response_attachment_path si no existe
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'response_attachment_path'
    ) THEN
        ALTER TABLE pqr ADD COLUMN response_attachment_path VARCHAR(500) NULL COMMENT 'Ruta/URL del archivo adjunto a la respuesta';
    END IF;
END //

DELIMITER ;

-- Ejecutar el procedimiento
CALL add_response_attachment_path();

-- Eliminar el procedimiento
DROP PROCEDURE IF EXISTS add_response_attachment_path;
