-- =====================================================
-- Script para crear tabla de usuarios administradores
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_users_username (username),
    INDEX idx_admin_users_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Usuario administrador inicial
-- Usuario: admin
-- Contraseña: admin123 (debe cambiarse en producción)
-- =====================================================
-- La contraseña 'admin123' hasheada con BCrypt (cost 10)
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =====================================================

INSERT INTO admin_users (username, password_hash, full_name, role, active) 
VALUES (
    'admin',
    '$2a$12$JZJFs040VKjwjEkJ/FZps.Q20USu7FWjybtk9g.i2MUK80YjtWyVG',
    'Administrador Principal',
    'ADMIN',
    TRUE
) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
