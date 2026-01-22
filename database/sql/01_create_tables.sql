-- =====================================================
-- Script de Creación de Tablas - FITEL Web
-- Base de Datos: fitel_db
-- =====================================================

-- =====================================================
-- 1. TABLA: plans (Planes de Internet y TV)
-- =====================================================
CREATE TABLE IF NOT EXISTS plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    internet_speed_mbps INT NOT NULL,
    tv_channels INT NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    popular BOOLEAN NOT NULL DEFAULT FALSE,
    plan_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_plans_active (active),
    INDEX idx_plans_popular (popular),
    INDEX idx_plans_type (plan_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. TABLA: coverage_zones (Zonas de Cobertura)
-- =====================================================
CREATE TABLE IF NOT EXISTS coverage_zones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    locality VARCHAR(100) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_coverage_available (available),
    INDEX idx_coverage_locality (locality),
    INDEX idx_coverage_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. TABLA: installation_requests (Solicitudes de Instalación)
-- =====================================================
CREATE TABLE IF NOT EXISTS installation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_document_type VARCHAR(20),
    customer_document_number VARCHAR(50),
    address VARCHAR(500) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    coverage_zone_id BIGINT,
    selected_plan_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_date TIMESTAMP NULL,
    completed_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    FOREIGN KEY (coverage_zone_id) REFERENCES coverage_zones(id),
    FOREIGN KEY (selected_plan_id) REFERENCES plans(id),
    INDEX idx_installation_status (status),
    INDEX idx_installation_date (requested_date),
    INDEX idx_installation_coverage (coverage_zone_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TABLA: pqr (Peticiones, Quejas y Recursos)
-- =====================================================
CREATE TABLE IF NOT EXISTS pqr (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cun VARCHAR(50) UNIQUE COMMENT 'Código Único Numérico',
    type VARCHAR(20) NOT NULL COMMENT 'PETICION, QUEJA, RECURSO',
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_document_type VARCHAR(20) NOT NULL,
    customer_document_number VARCHAR(50) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'RECIBIDA',
    priority VARCHAR(20) DEFAULT 'NORMAL',
    assigned_to VARCHAR(100),
    response TEXT,
    response_date TIMESTAMP NULL,
    resolution_date TIMESTAMP NULL,
    parent_pqr_id BIGINT COMMENT 'Para recursos que referencian una PQR anterior',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    FOREIGN KEY (parent_pqr_id) REFERENCES pqr(id),
    INDEX idx_pqr_cun (cun),
    INDEX idx_pqr_type (type),
    INDEX idx_pqr_status (status),
    INDEX idx_pqr_document (customer_document_number),
    INDEX idx_pqr_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TABLA: pqr_appeals (Apelaciones)
-- =====================================================
CREATE TABLE IF NOT EXISTS pqr_appeals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pqr_id BIGINT NOT NULL,
    appeal_type VARCHAR(50) NOT NULL COMMENT 'REPOSICION, APELACION',
    appeal_reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    response TEXT,
    response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    FOREIGN KEY (pqr_id) REFERENCES pqr(id) ON DELETE CASCADE,
    INDEX idx_appeal_pqr (pqr_id),
    INDEX idx_appeal_status (status),
    INDEX idx_appeal_type (appeal_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TABLA: contact_messages (Mensajes de Contacto)
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) COMMENT 'EMAIL, WHATSAPP, PHONE, FORM',
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    responded BOOLEAN DEFAULT FALSE,
    response TEXT,
    response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_contact_status (status),
    INDEX idx_contact_created (created_at),
    INDEX idx_contact_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TABLA: users (Usuarios del Sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. TABLA: audit_logs (Logs de Auditoría)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, VIEW',
    user_id BIGINT,
    username VARCHAR(100),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. TABLA: system_config (Configuración del Sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'STRING',
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
