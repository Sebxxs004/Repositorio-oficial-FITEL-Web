-- =====================================================
-- Script de Ejecución de Todos los Scripts
-- Este script se ejecuta después de crear la base de datos
-- Usa IF NOT EXISTS para evitar errores si ya existen
-- =====================================================

USE fitel_db;

-- Ejecutar todos los scripts de creación/actualización
-- Los scripts individuales ya tienen IF NOT EXISTS
SOURCE /docker-entrypoint-initdb.d/sql/01_create_tables.sql;
SOURCE /docker-entrypoint-initdb.d/sql/02_insert_initial_data.sql;
SOURCE /docker-entrypoint-initdb.d/sql/03_create_indexes.sql;
SOURCE /docker-entrypoint-initdb.d/sql/04_create_views.sql;
SOURCE /docker-entrypoint-initdb.d/sql/05_create_functions.sql;
SOURCE /docker-entrypoint-initdb.d/sql/06_create_triggers.sql;
SOURCE /docker-entrypoint-initdb.d/sql/07_create_admin_users.sql;
SOURCE /docker-entrypoint-initdb.d/sql/08_create_allowed_ips.sql;
SOURCE /docker-entrypoint-initdb.d/sql/09_migrate_ips_to_encrypted.sql;
SOURCE /docker-entrypoint-initdb.d/sql/10_create_config_tables.sql;
SOURCE /docker-entrypoint-initdb.d/sql/11_update_pqr_table.sql;
SOURCE /docker-entrypoint-initdb.d/sql/12_create_email_config.sql;

-- Ejecutar script de actualización siempre (verifica y actualiza)
SOURCE /docker-entrypoint-initdb.d/always-run.sql;

SELECT '✅ Base de datos inicializada correctamente' AS status;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
