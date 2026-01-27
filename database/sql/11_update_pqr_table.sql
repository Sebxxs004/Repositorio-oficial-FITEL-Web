-- =====================================================
-- Script de Actualización de Tabla PQR
-- Agrega campos necesarios para el flujo completo de PQRs
-- Este script usa procedimientos almacenados para verificar existencia
-- =====================================================

USE fitel_db;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS update_pqr_table_columns()
BEGIN
    -- Verificar y agregar columnas si no existen
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'sla_deadline'
    ) THEN
        ALTER TABLE pqr ADD COLUMN sla_deadline TIMESTAMP NULL COMMENT 'Fecha límite de respuesta según SLA';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'responsible_area'
    ) THEN
        ALTER TABLE pqr ADD COLUMN responsible_area VARCHAR(100) NULL COMMENT 'Área responsable (soporte, facturación, técnica)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'internal_notes'
    ) THEN
        ALTER TABLE pqr ADD COLUMN internal_notes TEXT NULL COMMENT 'Notas internas para el operador';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'resource_type'
    ) THEN
        ALTER TABLE pqr ADD COLUMN resource_type VARCHAR(50) NULL COMMENT 'Tipo de recurso (si aplica)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'real_type'
    ) THEN
        ALTER TABLE pqr ADD COLUMN real_type VARCHAR(20) NULL COMMENT 'Tipo real asignado por operador';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'customer_address'
    ) THEN
        ALTER TABLE pqr ADD COLUMN customer_address VARCHAR(500) NULL COMMENT 'Dirección del cliente';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'constancy_generated'
    ) THEN
        ALTER TABLE pqr ADD COLUMN constancy_generated BOOLEAN DEFAULT FALSE COMMENT 'Indica si se generó constancia';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND COLUMN_NAME = 'constancy_sent_at'
    ) THEN
        ALTER TABLE pqr ADD COLUMN constancy_sent_at TIMESTAMP NULL COMMENT 'Fecha en que se envió la constancia';
    END IF;

    -- Crear índices si no existen
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND INDEX_NAME = 'idx_pqr_sla_deadline'
    ) THEN
        CREATE INDEX idx_pqr_sla_deadline ON pqr(sla_deadline);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND INDEX_NAME = 'idx_pqr_responsible_area'
    ) THEN
        CREATE INDEX idx_pqr_responsible_area ON pqr(responsible_area);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = 'fitel_db' 
        AND TABLE_NAME = 'pqr' 
        AND INDEX_NAME = 'idx_pqr_real_type'
    ) THEN
        CREATE INDEX idx_pqr_real_type ON pqr(real_type);
    END IF;
END //

DELIMITER ;

-- Ejecutar el procedimiento
CALL update_pqr_table_columns();

-- Limpiar el procedimiento temporal
DROP PROCEDURE IF EXISTS update_pqr_table_columns;

-- Actualizar comentario de status
ALTER TABLE pqr 
    MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'RECIBIDA' 
    COMMENT 'Estados: RECIBIDA, EN_ANALISIS, EN_RESPUESTA, RESUELTA, CERRADA';
