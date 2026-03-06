-- Migración: Notificación de login y revocación de sesiones
-- Agrega campos para revocar sesiones y tokens de alerta de seguridad

ALTER TABLE admin_users
    ADD COLUMN IF NOT EXISTS session_revoked_at TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS security_alert_token VARCHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS security_alert_token_expires_at TIMESTAMP NULL;
