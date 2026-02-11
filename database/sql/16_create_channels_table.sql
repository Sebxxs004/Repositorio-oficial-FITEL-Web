-- =====================================================
-- Script de Creaci�n de Tabla Channels - FITEL Web
-- =====================================================

CREATE TABLE IF NOT EXISTS channels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    number INT NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    INDEX idx_channels_number (number),
    INDEX idx_channels_category (category),
    INDEX idx_channels_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Limpiar tabla antes de insertar
TRUNCATE TABLE channels;

-- =====================================================
-- Insertar datos iniciales (Basado en assets)
-- =====================================================

-- NACIONALES
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Canal Capital', 2, 'NACIONALES', '/assets/canales/capital.png', TRUE),
('Canal Uno', 7, 'NACIONALES', '/assets/canales/canal-1.png', TRUE),
('Canal Institucional', 8, 'NACIONALES', '/assets/canales/canal-institucional.png', TRUE),
('Canal RCN', 9, 'NACIONALES', '/assets/canales/rcn.png', TRUE),
('Caracol TV', 10, 'NACIONALES', '/assets/canales/caracol.png', TRUE),
('Se�al Colombia', 11, 'NACIONALES', '/assets/canales/senal-colombia.png', TRUE),
('Canal 13', 13, 'NACIONALES', '/assets/canales/canal-13.png', TRUE),
('City TV', 21, 'NACIONALES', '/assets/canales/citytv.png', TRUE),
('Canal TRO', 22, 'NACIONALES', '/assets/canales/canal-tro.png', TRUE),
('Teleantioquia', 23, 'NACIONALES', '/assets/canales/teleantioquia.png', TRUE),
('Telecaribe', 24, 'NACIONALES', '/assets/canales/telecaribe.png', TRUE),
('Telepac�fico', 25, 'NACIONALES', '/assets/canales/telepacifico.png', TRUE),
('Telecaf�', 26, 'NACIONALES', '/assets/canales/telecafe.png', TRUE),
('Teleislas', 27, 'NACIONALES', '/assets/canales/teleislas.png', TRUE),
('Telemedell�n', 28, 'NACIONALES', '/assets/canales/telemedellin.png', TRUE),
('Caracol HD', 98, 'NACIONALES', '/assets/canales/caracol-hd.png', TRUE),
('RCN HD', 99, 'NACIONALES', '/assets/canales/rcn-hd.png', TRUE);

-- TELENOVELAS Y VARIEDADES
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Tlnovelas', 3, 'TELENOVELAS', '/assets/canales/tlnovelas.png', TRUE),
('Univisi�n', 4, 'TELENOVELAS', '/assets/canales/univision.png', TRUE),
('Las Estrellas', 5, 'TELENOVELAS', '/assets/canales/las-estrellas.png', TRUE),
('Ve Plus TV', 35, 'VARIEDADES', '/assets/canales/ve-plus-tv.png', TRUE),
('Hogar TV', 36, 'VARIEDADES', '/assets/canales/hogar-tv.png', TRUE),
('TV Agro', 37, 'VARIEDADES', '/assets/canales/tvagro.png', TRUE);

-- DEPORTES
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Fox Sports', 14, 'DEPORTES', '/assets/canales/fox-sports.png', TRUE),
('Fox Sports 2', 15, 'DEPORTES', '/assets/canales/fox-sports-2.png', TRUE),
('Fox Sports 3', 16, 'DEPORTES', '/assets/canales/fox-sports-3.png', TRUE),
('ESPN', 17, 'DEPORTES', '/assets/canales/espn.png', TRUE),
('ESPN 2', 18, 'DEPORTES', '/assets/canales/espn2.png', TRUE),
('ESPN 3', 19, 'DEPORTES', '/assets/canales/espn3.png', TRUE),
('America Sports', 20, 'DEPORTES', '/assets/canales/america-sports.png', TRUE);

-- INFANTIL
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Discovery Kids', 40, 'INFANTIL', '/assets/canales/discovery-kids.png', TRUE),
('Disney Channel', 41, 'INFANTIL', '/assets/canales/disney-channel.png', TRUE),
('Disney Junior', 42, 'INFANTIL', '/assets/canales/disney-junior.png', TRUE),
('Disney XD', 43, 'INFANTIL', '/assets/canales/disney-xd.png', TRUE),
('Cartoon Network', 44, 'INFANTIL', '/assets/canales/cartoon-network.png', TRUE),
('Boomerang', 45, 'INFANTIL', '/assets/canales/boomerang.png', TRUE),
('Nat Geo Kids', 46, 'INFANTIL', '/assets/canales/nat-geo-kids.png', TRUE),
('Baby TV', 47, 'INFANTIL', '/assets/canales/baby-tv.png', TRUE),
('ZooMoo', 48, 'INFANTIL', '/assets/canales/zoomoo.png', TRUE),
('Tooncast', 49, 'INFANTIL', '/assets/canales/tooncast.png', TRUE),
('Canal Infantil', 50, 'INFANTIL', '/assets/canales/canal_infantil.png', TRUE);

-- CINE Y PEL�CULAS
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('TNT', 60, 'PELICULAS', '/assets/canales/tnt.png', TRUE),
('Space', 61, 'PELICULAS', '/assets/canales/space.png', TRUE),
('Cinecanal', 62, 'PELICULAS', '/assets/canales/cine-canal.png', TRUE),
('Studio Universal', 63, 'PELICULAS', '/assets/canales/cine-premium.png', TRUE), 
('Cine Latino', 64, 'PELICULAS', '/assets/canales/cine-latino.png', TRUE),
('De Pel�cula', 65, 'PELICULAS', '/assets/canales/de-pelicula.png', TRUE),
('Golden', 66, 'PELICULAS', '/assets/canales/golden.png', TRUE),
('AMC', 67, 'PELICULAS', '/assets/canales/amc.png', TRUE),
('Multipremier', 68, 'PELICULAS', '/assets/canales/mp-multipremier.png', TRUE),
('TCM', 69, 'PELICULAS', '/assets/canales/tcm.png', TRUE),
('Cine Familiar', 70, 'PELICULAS', '/assets/canales/cine-familiar.png', TRUE),
('Cine Hispano', 71, 'PELICULAS', '/assets/canales/cine-hispano.png', TRUE),
('Cinema Plus', 72, 'PELICULAS', '/assets/canales/cinema-plus.png', TRUE);

-- SERIES Y ENTRETENIMIENTO
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Fox Channel', 80, 'SERIES', '/assets/canales/fox-channel.png', TRUE),
('FX', 81, 'SERIES', '/assets/canales/fx.png', TRUE),
('FXM', 82, 'SERIES', '/assets/canales/fxm.png', TRUE),
('TNT Series', 83, 'SERIES', '/assets/canales/tnt-series.png', TRUE),
('DHE', 84, 'SERIES', '/assets/canales/dhe.png', TRUE),
('Fox Life', 85, 'SERIES', '/assets/canales/fox-life.png', TRUE);

-- DOCUMENTALES Y MUNDO
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Discovery Channel', 100, 'DOCUMENTALES', '/assets/canales/discovery-channel.png', TRUE),
('Animal Planet', 101, 'DOCUMENTALES', '/assets/canales/animal-planet.png', TRUE),
('National Geographic', 102, 'DOCUMENTALES', '/assets/canales/nat-geo.png', TRUE),
('Nat Geo Wild', 103, 'DOCUMENTALES', '/assets/canales/nat-geo-wild.png', TRUE),
('Discovery H&H', 104, 'DOCUMENTALES', '/assets/canales/discovery-hh.png', TRUE),
('Discovery Turbo', 105, 'DOCUMENTALES', '/assets/canales/discovery-turbo.png', TRUE),
('ID Investigation', 106, 'DOCUMENTALES', '/assets/canales/id.png', TRUE),
('TLC', 107, 'DOCUMENTALES', '/assets/canales/tlc.png', TRUE);

-- NOTICIAS
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('CNN en Espa�ol', 6, 'NOTICIAS', '/assets/canales/cnn.png', TRUE),
('Cable Noticias', 120, 'NOTICIAS', '/assets/canales/cablenoticias.png', TRUE),
('NTN24', 121, 'NOTICIAS', '/assets/canales/ntn24.png', TRUE),
('Teleamazonas', 122, 'NOTICIAS', '/assets/canales/teleamazonas.png', TRUE);

-- M�SICA
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('HTV', 130, 'MUSICA', '/assets/canales/htv.png', TRUE),
('La Kalle', 131, 'MUSICA', '/assets/canales/la-kalle.png', TRUE),
('Rumba TV', 132, 'MUSICA', '/assets/canales/rumba.png', TRUE),
('Mi Gente TV', 133, 'MUSICA', '/assets/canales/mi-gente-tv.png', TRUE),
('Mi M�sica Hits', 134, 'MUSICA', '/assets/canales/mimusica-hits.png', TRUE),
('Mi M�sica Popular', 135, 'MUSICA', '/assets/canales/mimusica-popular.png', TRUE),
('Mi M�sica Reggaeton', 136, 'MUSICA', '/assets/canales/mimusica-reggaeton.png', TRUE),
('Mi M�sica Salsa', 137, 'MUSICA', '/assets/canales/mimusica-salsa.png', TRUE);

-- RELIGIOSOS
INSERT INTO channels (name, number, category, logo_url, active) VALUES 
('Cristovisi�n', 140, 'RELIGIOSOS', '/assets/canales/cristovision.png', TRUE),
('EWTN', 141, 'RELIGIOSOS', '/assets/canales/enlace.png', TRUE),
('Teleamiga', 142, 'RELIGIOSOS', '/assets/canales/teleamiga.png', TRUE),
('ABN', 143, 'RELIGIOSOS', '/assets/canales/abn.png', TRUE);
