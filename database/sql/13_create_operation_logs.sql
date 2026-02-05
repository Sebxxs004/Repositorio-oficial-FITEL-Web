-- =====================================================
-- Script de Creación de Tabla de Logs de Operaciones
-- Base de Datos: fitel_db
-- =====================================================

-- =====================================================
-- TABLA: operation_logs (Logs de operaciones del sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL COMMENT 'Tipo de entidad (PQR, PLAN, CONFIG, etc.)',
    entity_id BIGINT COMMENT 'ID de la entidad afectada',
    operation_type VARCHAR(50) NOT NULL COMMENT 'Tipo de operación (CREATE, UPDATE, DELETE, STATUS_CHANGE, etc.)',
    operation_description TEXT NOT NULL COMMENT 'Descripción detallada de la operación',
    performed_by VARCHAR(100) NOT NULL COMMENT 'Usuario que realizó la operación',
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la operación',
    old_values TEXT COMMENT 'Valores anteriores (JSON)',
    new_values TEXT COMMENT 'Valores nuevos (JSON)',
    ip_address VARCHAR(45) COMMENT 'Dirección IP desde donde se realizó la operación',
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_performed_by (performed_by),
    INDEX idx_performed_at (performed_at),
    INDEX idx_operation_type (operation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
