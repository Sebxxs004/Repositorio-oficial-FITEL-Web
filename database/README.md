# Base de Datos FITEL Web

Este directorio contiene todos los scripts SQL para la configuración de la base de datos MariaDB.

## 📁 Estructura de Scripts

```
database/
├── sql/
│   ├── 00_run_all.sql          # Script maestro (ejecuta todos)
│   ├── 01_create_tables.sql    # Creación de tablas
│   ├── 02_insert_initial_data.sql  # Datos iniciales
│   ├── 03_create_indexes.sql   # Índices adicionales
│   ├── 04_create_views.sql     # Vistas útiles
│   ├── 05_create_functions.sql # Funciones personalizadas
│   └── 06_create_triggers.sql  # Triggers de auditoría
└── README.md                    # Este archivo
```

## 🚀 Uso

### Opción 1: Ejecutar desde DBeaver

1. Abre DBeaver y conéctate a la base de datos `fitel_db`
2. Abre cada archivo `.sql` en orden (01, 02, 03, etc.)
3. Ejecuta cada script (F5 o botón "Execute")

### Opción 2: Ejecutar desde la línea de comandos

```bash
# Desde el directorio database/sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < 01_create_tables.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < 02_insert_initial_data.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < 03_create_indexes.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < 04_create_views.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < 05_create_functions.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < 06_create_triggers.sql
```

### Opción 3: Ejecutar todo de una vez

```bash
# Desde el directorio raíz del proyecto
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/01_create_tables.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/02_insert_initial_data.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/03_create_indexes.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/04_create_views.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/05_create_functions.sql
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/06_create_triggers.sql
```

## 📊 Tablas Creadas

### Tablas Principales

1. **plans** - Planes de Internet y TV
2. **coverage_zones** - Zonas de cobertura en Bogotá
3. **installation_requests** - Solicitudes de instalación
4. **pqr** - Peticiones, Quejas y Recursos
5. **pqr_appeals** - Apelaciones de PQR
6. **contact_messages** - Mensajes de contacto
7. **users** - Usuarios del sistema
8. **audit_logs** - Logs de auditoría
9. **system_config** - Configuración del sistema

## 🔍 Vistas Disponibles

- `v_pqr_summary` - Resumen de PQR
- `v_installation_requests_detail` - Detalle de solicitudes de instalación
- `v_pqr_statistics` - Estadísticas de PQR
- `v_plans_active` - Planes activos

## ⚙️ Funciones Disponibles

- `generate_cun()` - Genera Código Único Numérico para PQR
- `business_days(start_date, end_date)` - Calcula días hábiles entre fechas

## 🔔 Triggers Configurados

- `trg_pqr_generate_cun` - Genera CUN automáticamente
- `trg_pqr_update_resolution_date` - Actualiza fecha de resolución
- `trg_pqr_audit_create` - Auditoría al crear PQR
- `trg_pqr_audit_update` - Auditoría al actualizar PQR

## 📝 Notas Importantes

1. **Orden de ejecución**: Los scripts deben ejecutarse en orden numérico
2. **Tabla plans**: Ya existe (creada por Hibernate), el script la crea solo si no existe
3. **CUN**: Se genera automáticamente mediante trigger
4. **Auditoría**: Todos los cambios en PQR se registran automáticamente

## 🔄 Reiniciar Base de Datos

Si necesitas reiniciar completamente la base de datos:

```bash
# Eliminar todas las tablas (CUIDADO: Esto borra todos los datos)
docker exec fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db -e "DROP DATABASE fitel_db; CREATE DATABASE fitel_db;"

# Luego ejecutar los scripts de nuevo
```

## ✅ Verificación

Después de ejecutar los scripts, verifica:

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE pqr;

-- Ver datos iniciales
SELECT * FROM plans;
SELECT * FROM coverage_zones;
SELECT * FROM system_config;

-- Probar función
SELECT generate_cun() AS nuevo_cun;
```

## 📚 Documentación Adicional

- Ver `docs/PROXIMOS_PASOS.md` para más información sobre el desarrollo
- Ver `docs/CONEXION_DBEAVER_MARIADB.md` para conexión desde DBeaver
