-- =====================================================
-- Script para Generar Datos de Prueba de la SIC
-- Base de Datos: fitel_db
-- =====================================================

-- Eliminar registros previos con los mismos documentos de prueba para evitar duplicidad
DELETE FROM pqr WHERE customer_document_number IN ('100200300', '900800700', '100400500');

-- 1. CUN Asociado a Persona Natural (Cédula de Ciudadanía - CC)
INSERT INTO pqr (
    type, 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_document_type, 
    customer_document_number, 
    subject, 
    description, 
    status, 
    priority, 
    created_at
) VALUES (
    'PETICION',
    'Juan Perez',
    'juan.perez@example.com',
    '3101234567',
    'CC',
    '100200300',
    'Solicitud de traslado de servicio de internet',
    'Buenas tardes, solicito comedidamente el traslado de mi servicio contratado a mi nueva dirección de residencia.',
    'RECIBIDA',
    'NORMAL',
    '2026-07-30 08:00:00'
);

-- 2. CUN Asociado a Persona Jurídica (NIT)
INSERT INTO pqr (
    type, 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_document_type, 
    customer_document_number, 
    subject, 
    description, 
    status, 
    priority, 
    created_at
) VALUES (
    'QUEJA',
    'Inversiones Ficticias S.A.S.',
    'contacto@inversionesficticias.com',
    '6015551234',
    'NIT',
    '900800700',
    'Intermitencia constante en fibra óptica empresarial',
    'Presentamos queja formal debido a constantes caídas en el servicio de internet en nuestra sede administrativa principal.',
    'RECIBIDA',
    'ALTA',
    '2026-07-30 09:00:00'
);

-- 3. Persona con más de un CUN asignado (CC - 100400500)
-- Primer CUN de la persona
INSERT INTO pqr (
    type, 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_document_type, 
    customer_document_number, 
    subject, 
    description, 
    status, 
    priority, 
    created_at
) VALUES (
    'PETICION',
    'Maria Gomez',
    'maria.gomez@example.com',
    '3209876543',
    'CC',
    '100400500',
    'Reclamo por cobro de servicios no contratados',
    'Solicito la revisión de mi última factura de telefonía ya que me están cobrando cargos adicionales no pactados.',
    'RECIBIDA',
    'NORMAL',
    '2026-07-30 10:00:00'
);

-- Segundo CUN de la misma persona
INSERT INTO pqr (
    type, 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_document_type, 
    customer_document_number, 
    subject, 
    description, 
    status, 
    priority, 
    created_at
) VALUES (
    'RECURSO',
    'Maria Gomez',
    'maria.gomez@example.com',
    '3209876543',
    'CC',
    '100400500',
    'Recurso de reposición sobre facturación de Junio',
    'Interpongo recurso de reposición en subsidio de apelación contra la decisión inicial de la empresa sobre el cobro facturado.',
    'RECIBIDA',
    'ALTA',
    '2026-07-30 11:00:00'
);

-- Mostrar los datos insertados con el CUN generado
SELECT id, cun, customer_name, customer_document_type, customer_document_number, type, subject 
FROM pqr 
WHERE customer_document_number IN ('100200300', '900800700', '100400500');

