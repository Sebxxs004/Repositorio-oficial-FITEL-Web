# Configuración de Usuarios Administradores

## Crear Usuario Administrador

Para crear un usuario administrador, ejecuta el script SQL:

```sql
-- Ejecutar en MariaDB
source database/sql/07_create_admin_users.sql;
```

O desde DBeaver:
1. Abre el archivo `database/sql/07_create_admin_users.sql`
2. Ejecuta el script completo

## Usuario por Defecto

**Usuario inicial creado:**
- **Username:** `admin`
- **Contraseña:** `admin123`
- **Rol:** `ADMIN`

⚠️ **IMPORTANTE:** Cambia la contraseña del usuario `admin` en producción.

## Crear Nuevo Usuario Administrador

Para crear un nuevo usuario administrador, usa este SQL (reemplaza los valores):

```sql
INSERT INTO admin_users (username, password_hash, full_name, role, active) 
VALUES (
    'tu_usuario',
    '$2a$10$TU_HASH_AQUI',  -- Genera el hash con BCrypt
    'Nombre Completo',
    'ADMIN',
    TRUE
);
```

### Generar Hash de Contraseña

Puedes generar el hash BCrypt usando:
- Online: https://bcrypt-generator.com/
- Java: `BCryptPasswordEncoder().encode("tu_contraseña")`
- Spring Boot: Inyecta `PasswordEncoder` y usa `encode()`

## Acceso al Panel

1. Ve a: `http://localhost:3000/operaciones-internas/login`
2. Ingresa:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. Serás redirigido al dashboard
