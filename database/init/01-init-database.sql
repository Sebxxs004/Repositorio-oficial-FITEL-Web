-- =====================================================
-- Script de Inicialización de Base de Datos
-- Este script se ejecuta automáticamente al iniciar MariaDB
-- Crea la base de datos si no existe
-- =====================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS fitel_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE fitel_db;

-- =====================================================
-- FIN DEL SCRIPT DE INICIALIZACIÓN
-- =====================================================
