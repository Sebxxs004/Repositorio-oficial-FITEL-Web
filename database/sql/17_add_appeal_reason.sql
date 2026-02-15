USE fitel_db;

-- Agregar columna para el motivo de reanálisis/apelación
ALTER TABLE pqr ADD COLUMN appeal_reason TEXT DEFAULT NULL;
