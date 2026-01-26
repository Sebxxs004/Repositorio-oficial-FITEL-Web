-- =====================================================
-- Script para crear tabla de IPs permitidas para panel admin
-- =====================================================

CREATE TABLE IF NOT EXISTS allowed_admin_ips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    -- IPs encriptadas (usar AES_ENCRYPT/AES_DECRYPT)
    ip_address_encrypted VARBINARY(128) NULL UNIQUE COMMENT 'IPv4 o IPv6 encriptada (NULL si es rango)',
    ip_range_encrypted VARBINARY(128) NULL UNIQUE COMMENT 'Rango CIDR encriptado (ej: 192.168.1.0/24)',
    -- Hash para búsquedas rápidas (SHA256 de la IP/rango)
    ip_hash VARCHAR(64) NULL UNIQUE COMMENT 'Hash SHA256 para búsquedas sin desencriptar',
    range_hash VARCHAR(64) NULL UNIQUE COMMENT 'Hash SHA256 del rango para búsquedas',
    description VARCHAR(255) NULL COMMENT 'Descripción de la IP/rango',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NULL COMMENT 'Usuario que creó el registro',
    INDEX idx_allowed_admin_ips_active (active),
    INDEX idx_allowed_admin_ips_hash (ip_hash),
    INDEX idx_allowed_admin_ips_range_hash (range_hash),
    -- Constraint: debe tener al menos ip_address_encrypted o ip_range_encrypted
    CONSTRAINT chk_ip_or_range CHECK (ip_address_encrypted IS NOT NULL OR ip_range_encrypted IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- IPs iniciales permitidas (ENCRIPTADAS)
-- =====================================================
-- IMPORTANTE: Usa el script 09_migrate_ips_to_encrypted.sql
-- para insertar las IPs con encriptación
-- =====================================================
-- Esta tabla se crea vacía. Las IPs se insertan usando
-- el servicio de encriptación del backend o el script
-- de migración que incluye la encriptación.
-- =====================================================
