# Almacenamiento de IPs Permitidas

## 📍 Ubicación Actual

Actualmente, las IPs permitidas se configuran de **dos formas**:

### 1. Variable de Entorno (Temporal)
**Ubicación:** `docker-compose.yml`
```yaml
ALLOWED_ADMIN_IPS: 127.0.0.1,::1,192.168.1.5,192.168.1.0/24,172.31.176.1
```

**Características:**
- ✅ Fácil de configurar
- ❌ No persistente (se pierde al recrear contenedor)
- ❌ No se puede modificar desde la aplicación
- ❌ No hay historial de cambios

### 2. Base de Datos (Persistente) - **NUEVO**
**Ubicación:** Tabla `allowed_admin_ips` en MariaDB

**Características:**
- ✅ Persistente
- ✅ Se puede modificar desde el panel admin
- ✅ Historial de cambios
- ✅ Descripciones y metadatos

## 🗄️ Estructura de la Tabla

```sql
CREATE TABLE allowed_admin_ips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL UNIQUE,      -- IP individual
    ip_range VARCHAR(50) NULL,                   -- Rango CIDR
    description VARCHAR(255) NULL,                -- Descripción
    active BOOLEAN NOT NULL DEFAULT TRUE,        -- Activa/Inactiva
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NULL                  -- Usuario que la creó
);
```

## 🔄 Migración de IPs

### Paso 1: Crear la tabla
Ejecuta el script SQL:
```bash
docker-compose exec mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/08_create_allowed_ips.sql
```

O desde DBeaver:
1. Abre `database/sql/08_create_allowed_ips.sql`
2. Ejecuta el script completo

### Paso 2: Las IPs actuales se insertan automáticamente
El script incluye las IPs que ya tienes configuradas:
- `127.0.0.1` - Localhost IPv4
- `::1` - Localhost IPv6
- `192.168.1.5` - Tu IP Wi-Fi
- `172.31.176.1` - IP WSL
- `192.168.1.0/24` - Rango de red local

## 📝 Gestión de IPs

### Desde la Base de Datos

**Agregar nueva IP:**
```sql
INSERT INTO allowed_admin_ips (ip_address, description, active) 
VALUES ('203.0.113.45', 'IP de oficina', TRUE);
```

**Agregar rango:**
```sql
INSERT INTO allowed_admin_ips (ip_range, description, active) 
VALUES ('10.0.0.0/16', 'Red interna de la empresa', TRUE);
```

**Desactivar IP:**
```sql
UPDATE allowed_admin_ips 
SET active = FALSE 
WHERE ip_address = '192.168.1.100';
```

**Eliminar IP:**
```sql
DELETE FROM allowed_admin_ips 
WHERE ip_address = '192.168.1.100';
```

### Desde el Panel Admin (Futuro)
Se puede implementar una interfaz en el panel de administración para:
- Ver todas las IPs permitidas
- Agregar nuevas IPs
- Editar/Desactivar IPs existentes
- Ver historial de cambios

## 🔧 Configuración del Middleware

El middleware puede usar ambas fuentes:

1. **Prioridad 1:** Base de datos (si está disponible)
2. **Prioridad 2:** Variable de entorno (fallback)

## ⚙️ Implementación Futura

Para usar la base de datos en el middleware, necesitarías:

1. **Backend API:** Endpoint para obtener IPs permitidas
2. **Cache:** Cachear las IPs en memoria para mejor rendimiento
3. **Panel Admin:** Interfaz para gestionar IPs

¿Quieres que implemente la integración completa con la base de datos?
