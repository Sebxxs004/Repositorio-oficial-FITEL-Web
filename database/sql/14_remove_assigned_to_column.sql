-- =====================================================
-- Script para eliminar la columna assigned_to de la tabla pqr
-- Base de Datos: fitel_db
-- =====================================================

-- Eliminar la columna assigned_to de la tabla pqr
ALTER TABLE pqr DROP COLUMN IF EXISTS assigned_to;
