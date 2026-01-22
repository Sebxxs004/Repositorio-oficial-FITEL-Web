-- =====================================================
-- Script de Triggers - FITEL Web
-- Triggers para automatización y auditoría
-- =====================================================

-- Trigger: Generar CUN automáticamente al crear una PQR
DELIMITER //

CREATE TRIGGER IF NOT EXISTS trg_pqr_generate_cun
BEFORE INSERT ON pqr
FOR EACH ROW
BEGIN
    IF NEW.cun IS NULL OR NEW.cun = '' THEN
        SET NEW.cun = generate_cun();
    END IF;
END //

DELIMITER ;

-- Trigger: Actualizar fecha de resolución cuando cambia el estado a resuelto
DELIMITER //

CREATE TRIGGER IF NOT EXISTS trg_pqr_update_resolution_date
BEFORE UPDATE ON pqr
FOR EACH ROW
BEGIN
    IF NEW.status = 'RESUELTA' AND OLD.status != 'RESUELTA' THEN
        SET NEW.resolution_date = NOW();
    END IF;
END //

DELIMITER ;

-- Trigger: Registrar en auditoría cuando se crea una PQR
DELIMITER //

CREATE TRIGGER IF NOT EXISTS trg_pqr_audit_create
AFTER INSERT ON pqr
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        entity_type,
        entity_id,
        action,
        username,
        new_values,
        created_at
    ) VALUES (
        'PQR',
        NEW.id,
        'CREATE',
        COALESCE(NEW.created_by, 'system'),
        JSON_OBJECT(
            'cun', NEW.cun,
            'type', NEW.type,
            'customer_name', NEW.customer_name,
            'status', NEW.status
        ),
        NOW()
    );
END //

DELIMITER ;

-- Trigger: Registrar en auditoría cuando se actualiza una PQR
DELIMITER //

CREATE TRIGGER IF NOT EXISTS trg_pqr_audit_update
AFTER UPDATE ON pqr
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        entity_type,
        entity_id,
        action,
        username,
        old_values,
        new_values,
        created_at
    ) VALUES (
        'PQR',
        NEW.id,
        'UPDATE',
        COALESCE(NEW.updated_by, 'system'),
        JSON_OBJECT(
            'status', OLD.status,
            'response', OLD.response
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'response', NEW.response
        ),
        NOW()
    );
END //

DELIMITER ;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
