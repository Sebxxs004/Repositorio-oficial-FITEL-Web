-- =====================================================
-- Script de Migración: Agregar columna background_image a plans
-- =====================================================

USE fitel_db;

-- Agregar columna background_image a la tabla plans
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS background_image VARCHAR(500) NULL 
AFTER plan_type;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
