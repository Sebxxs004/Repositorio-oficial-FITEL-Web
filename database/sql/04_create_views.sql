-- =====================================================
-- Script de Vistas - FITEL Web
-- Vistas útiles para reportes y consultas
-- =====================================================

-- Vista: PQR con información resumida
CREATE OR REPLACE VIEW v_pqr_summary AS
SELECT 
    p.id,
    p.cun,
    p.type,
    p.customer_name,
    p.customer_email,
    p.customer_phone,
    p.subject,
    p.status,
    p.priority,
    p.created_at,
    p.response_date,
    p.resolution_date,
    DATEDIFF(COALESCE(p.resolution_date, NOW()), p.created_at) AS days_pending,
    (SELECT COUNT(*) FROM pqr_appeals WHERE pqr_id = p.id) AS appeals_count
FROM pqr p;

-- Vista: Solicitudes de instalación con información de plan y zona
CREATE OR REPLACE VIEW v_installation_requests_detail AS
SELECT 
    ir.id,
    ir.customer_name,
    ir.customer_email,
    ir.customer_phone,
    ir.address,
    ir.locality,
    cz.name AS coverage_zone_name,
    cz.code AS coverage_zone_code,
    p.name AS plan_name,
    p.internet_speed_mbps,
    p.tv_channels,
    p.monthly_price,
    ir.status,
    ir.requested_date,
    ir.scheduled_date,
    ir.completed_date,
    DATEDIFF(COALESCE(ir.completed_date, NOW()), ir.requested_date) AS days_pending
FROM installation_requests ir
LEFT JOIN coverage_zones cz ON ir.coverage_zone_id = cz.id
LEFT JOIN plans p ON ir.selected_plan_id = p.id;

-- Vista: Estadísticas de PQR por tipo y estado
CREATE OR REPLACE VIEW v_pqr_statistics AS
SELECT 
    type,
    status,
    COUNT(*) AS count,
    MIN(created_at) AS first_created,
    MAX(created_at) AS last_created,
    AVG(DATEDIFF(COALESCE(resolution_date, NOW()), created_at)) AS avg_days_pending
FROM pqr
GROUP BY type, status;

-- Vista: Planes activos con información completa
CREATE OR REPLACE VIEW v_plans_active AS
SELECT 
    id,
    name,
    description,
    internet_speed_mbps,
    tv_channels,
    monthly_price,
    plan_type,
    popular,
    created_at
FROM plans
WHERE active = TRUE
ORDER BY 
    popular DESC,
    monthly_price ASC;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
