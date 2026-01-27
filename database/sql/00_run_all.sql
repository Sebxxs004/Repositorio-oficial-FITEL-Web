-- =====================================================
-- Script Maestro - Ejecutar Todos los Scripts
-- FITEL Web Database Setup
-- =====================================================
-- 
-- Este script ejecuta todos los scripts de creación
-- en el orden correcto.
--
-- Orden de ejecución:
-- 1. Crear tablas
-- 2. Insertar datos iniciales
-- 3. Crear índices adicionales
-- 4. Crear vistas
-- 5. Crear funciones
-- 6. Crear triggers
--
-- =====================================================

-- Usar la base de datos
USE fitel_db;

-- Ejecutar scripts en orden
SOURCE 01_create_tables.sql;
SOURCE 02_insert_initial_data.sql;
SOURCE 03_create_indexes.sql;
SOURCE 04_create_views.sql;
SOURCE 05_create_functions.sql;
SOURCE 06_create_triggers.sql;
SOURCE 07_create_admin_users.sql;
SOURCE 08_create_allowed_ips.sql;
SOURCE 09_migrate_ips_to_encrypted.sql;
SOURCE 10_create_config_tables.sql;
SOURCE 11_update_pqr_table.sql;
SOURCE 12_create_email_config.sql;

-- =====================================================
-- Verificación Final
-- =====================================================
SELECT 'Tablas creadas:' AS info;
SHOW TABLES;

SELECT 'Planes insertados:' AS info;
SELECT COUNT(*) AS total FROM plans;

SELECT 'Zonas de cobertura insertadas:' AS info;
SELECT COUNT(*) AS total FROM coverage_zones;

SELECT 'Configuración del sistema:' AS info;
SELECT COUNT(*) AS total FROM system_config;

SELECT 'Configuración de email:' AS info;
SELECT COUNT(*) AS total FROM email_config;

SELECT '✅ Base de datos configurada correctamente' AS status;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
