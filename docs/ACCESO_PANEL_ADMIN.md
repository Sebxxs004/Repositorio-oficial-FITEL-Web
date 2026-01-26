# Acceso al Panel de Administración

## 🚀 Cómo Acceder al Panel

### Paso 1: Acceder a la URL de Login

Abre tu navegador y ve a:

```
http://localhost:3000/operaciones-internas/login
```

⚠️ **Importante:** Esta ruta no aparece en ningún lugar público. Solo es accesible si conoces la URL.

### Paso 2: Credenciales de Acceso

**Usuario por defecto:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

⚠️ **IMPORTANTE DE SEGURIDAD:** 
- Cambia la contraseña del usuario `admin` en producción
- Crea usuarios adicionales con permisos específicos
- No compartas estas credenciales públicamente

### Paso 3: Iniciar Sesión

1. Ingresa el usuario: `admin`
2. Ingresa la contraseña: `admin123`
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido automáticamente al dashboard

## 🔒 Seguridad del Panel

### Características de Seguridad Implementadas:

1. **Ruta No Obvia:** `/operaciones-internas` (no `/admin`)
2. **Middleware de Protección:** 
   - Sin autenticación → Devuelve 404 (no revela que existe)
   - Con autenticación → Permite acceso
3. **Autenticación JWT:** Tokens seguros con expiración
4. **Cookies HttpOnly:** Las cookies no son accesibles desde JavaScript
5. **Verificación en Servidor:** El backend valida cada solicitud

### Rutas Protegidas:

- `/operaciones-internas/login` - Página de login (pública)
- `/operaciones-internas/dashboard` - Dashboard principal (protegida)
- Todas las rutas bajo `/operaciones-internas/*` están protegidas

## 📋 Funcionalidades del Panel

### Dashboard Principal

El dashboard incluye:

1. **Estadísticas:**
   - PQRs Pendientes
   - Usuarios Activos
   - Planes Activos
   - Solicitudes

2. **Secciones de Gestión:**
   - Gestión de PQRs
   - Gestión de Planes
   - Configuración del Sistema

## 🛠️ Crear Nuevos Usuarios Administradores

### Opción 1: Desde DBeaver

1. Conéctate a la base de datos `fitel_db`
2. Ejecuta este SQL (reemplaza los valores):

```sql
INSERT INTO admin_users (username, password_hash, full_name, role, active) 
VALUES (
    'nuevo_usuario',
    '$2a$10$TU_HASH_BCRYPT_AQUI',  -- Genera con BCrypt
    'Nombre Completo',
    'ADMIN',
    TRUE
);
```

### Opción 2: Generar Hash de Contraseña

Para generar el hash BCrypt de una contraseña:

**Opción A - Online:**
- Visita: https://bcrypt-generator.com/
- Ingresa tu contraseña
- Copia el hash generado

**Opción B - Java/Spring Boot:**
```java
@Autowired
private PasswordEncoder passwordEncoder;

String hash = passwordEncoder.encode("tu_contraseña");
```

## 🔧 Solución de Problemas

### Error: "Credenciales inválidas"

1. Verifica que el usuario existe en la base de datos:
```sql
SELECT * FROM admin_users WHERE username = 'admin';
```

2. Verifica que el backend está corriendo:
```bash
docker-compose logs backend
```

3. Verifica que la tabla existe:
```sql
SHOW TABLES LIKE 'admin_users';
```

### Error: 404 al acceder a `/operaciones-internas`

Esto es **normal** si no estás autenticado. El middleware devuelve 404 para ocultar la ruta.

**Solución:** Accede directamente a `/operaciones-internas/login`

### El backend no inicia

1. Verifica los logs:
```bash
docker-compose logs backend
```

2. Verifica que la base de datos está corriendo:
```bash
docker-compose ps mariadb
```

3. Reinicia los servicios:
```bash
docker-compose restart backend mariadb
```

## 📝 Notas Importantes

- El panel está completamente separado del sitio público
- No aparece en el navbar ni en ningún enlace público
- Solo es accesible si conoces la URL exacta
- Todas las acciones están auditadas (cuando se implemente el sistema de auditoría completo)

## 🔐 Mejores Prácticas

1. **Cambiar contraseña por defecto** inmediatamente en producción
2. **Usar contraseñas fuertes** (mínimo 12 caracteres, mayúsculas, números, símbolos)
3. **Limitar acceso por IP** (configurar en producción)
4. **Habilitar HTTPS** en producción
5. **Rotar tokens** periódicamente
6. **Monitorear accesos** al panel
