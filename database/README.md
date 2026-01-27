# Base de Datos FITEL

## Estructura

```
database/
├── init/                    # Scripts de inicialización automática
│   ├── 01-init-database.sql    # Crea la base de datos si no existe
│   ├── 02-run-all-scripts.sql  # Ejecuta todos los scripts de creación
│   ├── always-run.sql          # Script que verifica y actualiza siempre
│   └── init-db.sh              # Script shell de inicialización (opcional)
└── sql/                     # Scripts SQL de creación/actualización
    ├── 00_run_all.sql          # Script maestro (ejecutar manualmente)
    ├── 01_create_tables.sql    # Creación de tablas
    ├── 02_insert_initial_data.sql
    ├── 03_create_indexes.sql
    ├── 04_create_views.sql
    ├── 05_create_functions.sql
    ├── 06_create_triggers.sql
    ├── 07_create_admin_users.sql
    ├── 08_create_allowed_ips.sql
    ├── 09_migrate_ips_to_encrypted.sql
    ├── 10_create_config_tables.sql
    └── 11_update_pqr_table.sql  # Actualización de tabla PQR
```

## Inicialización Automática con Docker

Cuando ejecutas `docker-compose up`, MariaDB:

1. **Primera vez (base de datos vacía)**:
   - Ejecuta automáticamente todos los scripts en `/docker-entrypoint-initdb.d/`
   - Crea la base de datos `fitel_db`
   - Crea todas las tablas, funciones, triggers, etc.
   - Inserta datos iniciales

2. **Siguientes veces (base de datos existente)**:
   - NO ejecuta los scripts automáticamente (comportamiento por defecto de MariaDB)
   - El script `always-run.sql` se puede ejecutar manualmente para actualizar

## Actualización Manual

Si necesitas actualizar la base de datos después de cambios:

```bash
# Opción 1: Ejecutar script de actualización
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/init/always-run.sql

# Opción 2: Ejecutar script específico
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/11_update_pqr_table.sql

# Opción 3: Ejecutar todos los scripts
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/00_run_all.sql
```

## Scripts de Actualización

### `always-run.sql`
Este script verifica qué columnas/índices faltan en la tabla `pqr` y los crea. Se puede ejecutar múltiples veces sin errores.

### `11_update_pqr_table.sql`
Agrega los nuevos campos a la tabla PQR:
- `sla_deadline` - Fecha límite de respuesta
- `responsible_area` - Área responsable
- `internal_notes` - Notas internas
- `resource_type` - Tipo de recurso
- `real_type` - Tipo real asignado
- `customer_address` - Dirección del cliente
- `constancy_generated` - Flag de constancia generada
- `constancy_sent_at` - Fecha de envío de constancia

## Notas Importantes

- Todos los scripts usan `IF NOT EXISTS` para evitar errores si ya existen
- Los scripts están ordenados numéricamente para ejecutarse en el orden correcto
- El script `00_run_all.sql` es el script maestro que ejecuta todos los demás
- Los scripts en `init/` se ejecutan automáticamente solo la primera vez
