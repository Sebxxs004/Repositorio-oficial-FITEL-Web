-- =====================================================
-- Script de Índices Adicionales - FITEL Web
-- Optimización de consultas frecuentes
-- =====================================================

-- Índices adicionales para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_pqr_customer_email ON pqr(customer_email);
CREATE INDEX IF NOT EXISTS idx_pqr_customer_phone ON pqr(customer_phone);
CREATE INDEX IF NOT EXISTS idx_installation_customer_email ON installation_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_installation_customer_phone ON installation_requests(customer_phone);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_subject ON contact_messages(subject(100));

-- Índices compuestos para consultas complejas
CREATE INDEX IF NOT EXISTS idx_pqr_type_status ON pqr(type, status);
CREATE INDEX IF NOT EXISTS idx_installation_status_date ON installation_requests(status, requested_date);
CREATE INDEX IF NOT EXISTS idx_coverage_locality_available ON coverage_zones(locality, available);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
