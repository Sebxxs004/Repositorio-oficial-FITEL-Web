-- =====================================================
-- Script de Creación de Tabla de Configuración de Email
-- =====================================================

USE fitel_db;

-- Tabla para almacenar la configuración de email
CREATE TABLE IF NOT EXISTS email_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL COMMENT 'Email de Gmail para envío de correos',
    app_password VARCHAR(100) NOT NULL COMMENT 'Contraseña de aplicación de Gmail (encriptada)',
    smtp_host VARCHAR(100) DEFAULT 'smtp.gmail.com' COMMENT 'Servidor SMTP',
    smtp_port INT DEFAULT 587 COMMENT 'Puerto SMTP',
    enabled BOOLEAN DEFAULT TRUE COMMENT 'Si el envío de correos está habilitado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email_config (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar valores por defecto
INSERT INTO email_config (email, app_password, smtp_host, smtp_port, enabled) 
VALUES ('sebastincano12560@gmail.com', 'zspgebdrjeoducpz', 'smtp.gmail.com', 587, TRUE)
ON DUPLICATE KEY UPDATE 
    email = VALUES(email),
    app_password = VALUES(app_password),
    smtp_host = VALUES(smtp_host),
    smtp_port = VALUES(smtp_port),
    enabled = VALUES(enabled);
