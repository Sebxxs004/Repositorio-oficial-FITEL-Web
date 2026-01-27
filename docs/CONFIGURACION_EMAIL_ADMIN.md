# Configuración de Email desde el Panel de Administración

## Descripción

El sistema permite configurar el email y la contraseña de aplicación de Gmail directamente desde el panel de administración, sin necesidad de editar archivos de configuración o variables de entorno.

## Ubicación

**Panel de Administración → Configuración → Configuración de Email**

## Funcionalidades

### 1. Configuración de Email de Gmail
- **Email**: Dirección de Gmail desde la cual se enviarán los correos
- **Contraseña de Aplicación**: Contraseña de 16 caracteres generada desde Google Account
- **Servidor SMTP**: Por defecto `smtp.gmail.com`
- **Puerto SMTP**: Por defecto `587`

### 2. Habilitar/Deshabilitar Envío
- Checkbox para habilitar o deshabilitar el envío de correos
- Cuando está deshabilitado, no se enviarán correos aunque se creen PQRs

### 3. Seguridad
- La contraseña de aplicación **no se muestra** al cargar la configuración
- Solo se actualiza si se ingresa una nueva contraseña
- La contraseña se almacena en la base de datos (sin encriptar, ya que es una contraseña de aplicación específica)

## Cómo Obtener una Contraseña de Aplicación

1. **Habilitar Verificación en Dos Pasos**
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en dos pasos" si no está activa

2. **Generar Contraseña de Aplicación**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona:
     - **Aplicación**: "Correo"
     - **Dispositivo**: "Otro (nombre personalizado)" → "FITEL Web"
   - Haz clic en "Generar"
   - Copia la contraseña de 16 caracteres (sin espacios)

3. **Configurar en el Panel**
   - Ingresa al panel de administración
   - Ve a Configuración → Configuración de Email
   - Ingresa tu email de Gmail
   - Pega la contraseña de aplicación (sin espacios)
   - Guarda los cambios

## Valores por Defecto

Al instalar el sistema, se crea una configuración por defecto:
- **Email**: `sebastincano12560@gmail.com`
- **Contraseña**: `zspgebdrjeoducpz`
- **SMTP Host**: `smtp.gmail.com`
- **SMTP Port**: `587`
- **Habilitado**: `true`

## Uso Automático

El sistema utiliza automáticamente esta configuración para:
- Enviar constancias de radicación de PQRs
- Enviar notificaciones (futuras funcionalidades)

## Cambios en Tiempo Real

Los cambios en la configuración de email se aplican **inmediatamente** sin necesidad de reiniciar el servidor. El sistema lee la configuración desde la base de datos cada vez que se envía un correo.

## Troubleshooting

### Error: "Configuración de email no encontrada"
- Verifica que la tabla `email_config` exista en la base de datos
- Ejecuta el script `12_create_email_config.sql` si es necesario

### Error: "El envío de correos está deshabilitado"
- Ve a Configuración → Configuración de Email
- Marca el checkbox "Habilitar envío de correos electrónicos"
- Guarda los cambios

### Error: "Authentication failed"
- Verifica que la contraseña de aplicación sea correcta (sin espacios)
- Asegúrate de que la verificación en dos pasos esté activa
- Genera una nueva contraseña de aplicación si es necesario

### No llegan los correos
- Revisa la carpeta de spam
- Verifica que el email de destino sea válido
- Revisa los logs del backend para errores específicos
- Verifica que el envío esté habilitado en la configuración

## Base de Datos

La configuración se almacena en la tabla `email_config`:

```sql
CREATE TABLE email_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    app_password VARCHAR(100) NOT NULL,
    smtp_host VARCHAR(100) DEFAULT 'smtp.gmail.com',
    smtp_port INT DEFAULT 587,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET `/api/config/email`
Obtiene la configuración actual (sin la contraseña)

### PUT `/api/config/email`
Actualiza la configuración de email

**Request Body:**
```json
{
  "email": "tu-email@gmail.com",
  "appPassword": "nuevacontraseña", // Opcional, solo si quieres cambiarla
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "enabled": true
}
```
