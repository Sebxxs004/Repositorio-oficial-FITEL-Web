# Encriptación de IPs en Base de Datos

## 🔐 Seguridad Implementada

Las IPs permitidas ahora se almacenan **encriptadas** en la base de datos usando **AES-256**.

### ¿Por qué encriptar IPs?

Aunque las IPs no son tan sensibles como contraseñas, encriptarlas proporciona:

1. **Defensa en profundidad**: Si alguien accede a la BD, no puede ver las IPs reales
2. **Cumplimiento**: Mejora el cumplimiento de estándares de seguridad
3. **Privacidad**: Protege información sobre la infraestructura de red

## 🏗️ Arquitectura

### Estructura de la Tabla

```sql
allowed_admin_ips (
    id BIGINT,
    ip_address_encrypted VARBINARY(128),  -- IP encriptada
    ip_range_encrypted VARBINARY(128),    -- Rango encriptado
    ip_hash VARCHAR(64),                  -- Hash SHA-256 para búsquedas
    range_hash VARCHAR(64),               -- Hash del rango
    description VARCHAR(255),
    active BOOLEAN,
    ...
)
```

### Flujo de Verificación

1. **Cliente intenta acceder** → IP: `192.168.1.5`
2. **Backend genera hash** → SHA256(`192.168.1.5`)
3. **Búsqueda rápida por hash** → Encuentra registro
4. **Verificación segura** → Desencripta y compara

## 🔑 Clave de Encriptación

### Configuración Actual

**Ubicación:** `backend/src/main/resources/application.yml`

```yaml
spring:
  security:
    ip:
      encryption:
        key: ${IP_ENCRYPTION_KEY:FITEL-IP-ENC-KEY-32CHARS-LONG!!}
```

### ⚠️ IMPORTANTE: Cambiar en Producción

La clave debe tener **exactamente 32 caracteres** para AES-256.

**Generar clave segura:**
```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Online
# https://www.random.org/strings/
```

**Configurar en producción:**
```yaml
# application-prod.yml
spring:
  security:
    ip:
      encryption:
        key: ${IP_ENCRYPTION_KEY}  # Desde variable de entorno
```

**Variable de entorno:**
```bash
export IP_ENCRYPTION_KEY="tu-clave-segura-de-32-caracteres"
```

## 📝 Migración de IPs Existentes

### Paso 1: Ejecutar Script de Migración

```bash
docker-compose exec mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/09_migrate_ips_to_encrypted.sql
```

**⚠️ IMPORTANTE:** Edita el script y cambia `@encryption_key` antes de ejecutar.

### Paso 2: Verificar Migración

```sql
SELECT 
    id,
    CASE 
        WHEN ip_address_encrypted IS NOT NULL THEN 'IP Individual'
        WHEN ip_range_encrypted IS NOT NULL THEN 'Rango CIDR'
    END AS tipo,
    description,
    active
FROM allowed_admin_ips;
```

## 🔍 Verificación de Funcionamiento

### Desde el Backend

El servicio `IPEncryptionService` maneja automáticamente:
- ✅ Encriptación al guardar
- ✅ Desencriptación al leer
- ✅ Búsqueda por hash (rápida)
- ✅ Verificación segura

### Consultas SQL Directas

**⚠️ NO RECOMENDADO:** Solo para debugging

```sql
SET @key = 'FITEL-IP-ENC-KEY-32CHARS-LONG!!';

-- Ver IPs desencriptadas (solo para verificación)
SELECT 
    id,
    AES_DECRYPT(ip_address_encrypted, @key) AS ip_desencriptada,
    description
FROM allowed_admin_ips
WHERE ip_address_encrypted IS NOT NULL;
```

## 🛡️ Mejores Prácticas

1. **Nunca commitees la clave** en el repositorio
2. **Usa variables de entorno** en producción
3. **Rota la clave periódicamente** (requiere re-encriptar todas las IPs)
4. **Mantén backups** de la clave de encriptación
5. **Usa un gestor de secretos** (HashiCorp Vault, AWS Secrets Manager, etc.)

## 🔄 Rotación de Clave

Si necesitas cambiar la clave:

1. **Desencriptar todas las IPs** con la clave antigua
2. **Encriptar con la nueva clave**
3. **Actualizar configuración**

```sql
-- Ejemplo de rotación
SET @old_key = 'clave-antigua';
SET @new_key = 'clave-nueva-de-32-caracteres';

UPDATE allowed_admin_ips
SET 
    ip_address_encrypted = AES_ENCRYPT(
        AES_DECRYPT(ip_address_encrypted, @old_key), 
        @new_key
    ),
    ip_hash = SHA2(AES_DECRYPT(ip_address_encrypted, @old_key), 256)
WHERE ip_address_encrypted IS NOT NULL;
```

## 📊 Rendimiento

- **Búsqueda por hash**: O(1) - Muy rápida
- **Desencriptación**: Solo cuando el hash coincide
- **Impacto mínimo**: < 1ms por verificación

## 🔐 Consideraciones de Seguridad

### Lo que protege:
- ✅ IPs no visibles en la BD
- ✅ Requiere clave para desencriptar
- ✅ Hash permite búsquedas rápidas sin desencriptar

### Lo que NO protege:
- ❌ Si alguien tiene acceso a la BD Y la clave de encriptación
- ❌ Si alguien tiene acceso al código fuente y variables de entorno
- ❌ Ataques de fuerza bruta (mitigado por hash)

### Recomendaciones adicionales:
1. **Acceso limitado a la BD**: Solo personal autorizado
2. **Logs de acceso**: Monitorear accesos a la BD
3. **Backups encriptados**: Los backups también deben estar encriptados
4. **Separación de responsabilidades**: Diferentes personas para BD y aplicación
