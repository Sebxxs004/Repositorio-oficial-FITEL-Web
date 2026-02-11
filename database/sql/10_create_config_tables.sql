-- Tabla para almacenar la configuración de contacto
CREATE TABLE IF NOT EXISTS contact_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) NOT NULL COMMENT 'Número de teléfono sin formato',
    phone_display VARCHAR(30) NOT NULL COMMENT 'Número de teléfono con formato para mostrar',
    email VARCHAR(255) NOT NULL COMMENT 'Correo electrónico de contacto',
    whatsapp VARCHAR(20) NOT NULL COMMENT 'Número de WhatsApp sin formato',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_config (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar valores por defecto
INSERT INTO contact_config (phone, phone_display, email, whatsapp) 
VALUES ('573108830925', '+57 310 883 0925', 'contacto@fitel.com.co', '573108830925')
ON DUPLICATE KEY UPDATE 
    phone = VALUES(phone),
    phone_display = VALUES(phone_display),
    email = VALUES(email),
    whatsapp = VALUES(whatsapp);

-- Tabla para almacenar las imágenes del carrusel
CREATE TABLE IF NOT EXISTS carousel_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL COMMENT 'Nombre del archivo',
    file_path VARCHAR(500) NOT NULL COMMENT 'Ruta del archivo en el servidor',
    order_index INT NOT NULL DEFAULT 0 COMMENT 'Orden de visualización',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Si la imagen está activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (order_index),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar las imágenes existentes del carrusel
INSERT INTO carousel_images (filename, file_path, order_index) VALUES
('carrousel1.png', '/assets/carrousel1.png', 1),
('carrousel2.png', '/assets/carrousel2.png', 2),
('carrousel3.png', '/assets/carrousel3.png', 3),
('carrousel4.png', '/assets/carrousel4.png', 4),
('carrousel5.png', '/assets/carrousel5.png', 5)
ON DUPLICATE KEY UPDATE 
    order_index = VALUES(order_index);
