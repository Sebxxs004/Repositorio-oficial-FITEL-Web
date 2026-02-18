-- ===============================================
-- Script para agregar campos de recuperación de contraseña
-- ===============================================
-- Fecha: 2024
-- Descripción: Agrega campos para el sistema de recuperación de contraseña
-- Campos: email, password_reset_token, password_reset_token_expires_at
-- ===============================================

USE fitel_db;

-- Agregar columna email a la tabla admin_users (si no existe)
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) DEFAULT NULL AFTER username;

-- Agregar columna password_reset_token a la tabla admin_users (si no existe)
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255) DEFAULT NULL AFTER email;

-- Agregar columna password_reset_token_expires_at a la tabla admin_users (si no existe)
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS password_reset_token_expires_at DATETIME DEFAULT NULL AFTER password_reset_token;

-- Crear índice para búsqueda rápida por email
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Crear índice para búsqueda rápida por token de recuperación
CREATE INDEX IF NOT EXISTS idx_admin_users_reset_token ON admin_users(password_reset_token);

-- Actualizar usuarios existentes con emails de ejemplo (OPCIONAL - AJUSTAR SEGÚN NECESIDAD)
-- UPDATE admin_users SET email = CONCAT(username, '@fitel.local') WHERE email IS NULL;

-- Mostrar estructura actualizada
DESCRIBE admin_users;

-- ===============================================
-- Fin del script
-- ===============================================
