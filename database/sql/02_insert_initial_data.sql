-- =====================================================
-- Script de Datos Iniciales - FITEL Web
-- =====================================================

-- =====================================================
-- 1. INSERTAR PLANES INICIALES
-- =====================================================
INSERT INTO plans (name, description, internet_speed_mbps, tv_channels, monthly_price, active, popular, plan_type, created_by, created_at)
VALUES 
    ('Basico', 'Plan basico de Internet y TV para uso familiar', 50, 80, 49900.00, TRUE, FALSE, 'BASIC', 'system', NOW()),
    ('Familiar', 'Plan familiar con mas velocidad y canales premium', 100, 120, 79900.00, TRUE, TRUE, 'FAMILY', 'system', NOW()),
    ('Empresarial', 'Plan empresarial con velocidad dedicada e IP estatica', 200, 150, 129900.00, TRUE, FALSE, 'BUSINESS', 'system', NOW())
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 2. INSERTAR ZONAS DE COBERTURA INICIALES
-- =====================================================
INSERT INTO coverage_zones (name, code, locality, available, description, created_by)
VALUES 
    ('Chapinero', 'CHAP', 'Chapinero', TRUE, 'Cobertura en la localidad de Chapinero', 'system'),
    ('Usaquén', 'USAQ', 'Usaquén', TRUE, 'Cobertura en la localidad de Usaquén', 'system'),
    ('Suba', 'SUBA', 'Suba', TRUE, 'Cobertura en la localidad de Suba', 'system'),
    ('Engativá', 'ENGA', 'Engativá', TRUE, 'Cobertura en la localidad de Engativá', 'system'),
    ('Kennedy', 'KENN', 'Kennedy', TRUE, 'Cobertura en la localidad de Kennedy', 'system'),
    ('Fontibón', 'FONT', 'Fontibón', TRUE, 'Cobertura en la localidad de Fontibón', 'system'),
    ('Bosa', 'BOSA', 'Bosa', TRUE, 'Cobertura en la localidad de Bosa', 'system'),
    ('Ciudad Bolívar', 'CIBO', 'Ciudad Bolívar', TRUE, 'Cobertura en la localidad de Ciudad Bolívar', 'system'),
    ('San Cristóbal', 'SANC', 'San Cristóbal', TRUE, 'Cobertura en la localidad de San Cristóbal', 'system'),
    ('Rafael Uribe Uribe', 'RAUR', 'Rafael Uribe Uribe', TRUE, 'Cobertura en la localidad de Rafael Uribe Uribe', 'system')
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 3. INSERTAR CONFIGURACIÓN INICIAL DEL SISTEMA
-- =====================================================
INSERT INTO system_config (config_key, config_value, config_type, description, updated_by)
VALUES 
    ('company_name', 'FITEL', 'STRING', 'Nombre de la empresa', 'system'),
    ('company_slogan', 'Uniendo Familias', 'STRING', 'Eslogan de la empresa', 'system'),
    ('support_phone', '+57 300 123 4567', 'STRING', 'Teléfono de soporte', 'system'),
    ('support_email', 'contacto@fitel.com.co', 'STRING', 'Email de contacto', 'system'),
    ('whatsapp_number', '+573001234567', 'STRING', 'Número de WhatsApp', 'system'),
    ('business_hours', 'Lunes a Viernes: 8:00 AM - 8:00 PM', 'STRING', 'Horarios de atención', 'system'),
    ('pqr_enabled', 'true', 'BOOLEAN', 'Habilitar módulo PQR', 'system'),
    ('installation_request_enabled', 'true', 'BOOLEAN', 'Habilitar solicitudes de instalación', 'system'),
    ('pqr_convenio_number', '12345', 'STRING', 'Número de convenio de la empresa para PQRs (SIC)', 'system')
ON DUPLICATE KEY UPDATE 
    config_value = VALUES(config_value),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
