-- =====================================================
-- Script para migrar IPs existentes a formato encriptado
-- =====================================================
-- IMPORTANTE: Cambia 'your-encryption-key-here' por una clave segura
-- La clave debe tener exactamente 16, 24 o 32 caracteres para AES-128, AES-192 o AES-256
-- =====================================================

SET @encryption_key = 'FITEL-IP-ENC-KEY-32CHARS-LONG!!'; -- ⚠️ CAMBIAR EN PRODUCCIÓN

-- Eliminar datos antiguos si existen
TRUNCATE TABLE allowed_admin_ips;

-- Insertar IPs encriptadas
INSERT INTO allowed_admin_ips (
    ip_address_encrypted, 
    ip_hash, 
    description, 
    active
) VALUES 
    (
        AES_ENCRYPT('127.0.0.1', @encryption_key),
        SHA2('127.0.0.1', 256),
        'Localhost IPv4',
        TRUE
    ),
    (
        AES_ENCRYPT('::1', @encryption_key),
        SHA2('::1', 256),
        'Localhost IPv6',
        TRUE
    ),
    (
        AES_ENCRYPT('192.168.1.5', @encryption_key),
        SHA2('192.168.1.5', 256),
        'IP Wi-Fi del administrador',
        TRUE
    ),
    (
        AES_ENCRYPT('172.31.176.1', @encryption_key),
        SHA2('172.31.176.1', 256),
        'IP WSL (Hyper-V)',
        TRUE
    );

-- Insertar rango encriptado
INSERT INTO allowed_admin_ips (
    ip_range_encrypted,
    range_hash,
    description,
    active
) VALUES (
    AES_ENCRYPT('192.168.1.0/24', @encryption_key),
    SHA2('192.168.1.0/24', 256),
    'Rango completo de red local',
    TRUE
);

-- Verificar que se insertaron correctamente
SELECT 
    id,
    CASE 
        WHEN ip_address_encrypted IS NOT NULL THEN 'IP Individual'
        WHEN ip_range_encrypted IS NOT NULL THEN 'Rango CIDR'
    END AS tipo,
    description,
    active
FROM allowed_admin_ips;
