# Configuración de Email - FITEL Web

## Configuración de Gmail

Para enviar correos electrónicos desde la aplicación (constancias de PQR, notificaciones, etc.), necesitas configurar Gmail con una contraseña de aplicación.

### Pasos para Configurar

1. **Habilitar Verificación en Dos Pasos**
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en dos pasos" si no está activa

2. **Generar Contraseña de Aplicación**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona:
     - Aplicación: "Correo"
     - Dispositivo: "Otro (nombre personalizado)" → "FITEL Web"
   - Haz clic en "Generar"
   - Copia la contraseña de 16 caracteres (sin espacios)

3. **Configurar Variables de Entorno**

   Crea un archivo `.env` en la raíz del proyecto o configura las variables en `docker-compose.yml`:

   ```env
   MAIL_USERNAME=tu-email@gmail.com
   MAIL_PASSWORD=zspg ebdr jeod ucpz
   MAIL_FROM=tu-email@gmail.com
   ```

   **Nota**: La contraseña debe ir sin espacios: `zspgebdrjeoducpz`

4. **Para Docker Compose**

   Edita `docker-compose.yml` y agrega las variables:

   ```yaml
   backend:
     environment:
       MAIL_USERNAME: tu-email@gmail.com
       MAIL_PASSWORD: zspgebdrjeoducpz
       MAIL_FROM: tu-email@gmail.com
   ```

   O usa un archivo `.env` en la raíz del proyecto.

## Funcionalidades de Email

### Constancia de Radicación de PQR

Cuando un usuario crea una PQR, automáticamente se envía un correo con:
- CUN (Código Único Numérico)
- Fecha de radicación
- Fecha máxima de respuesta (SLA)
- Texto de Silencio Administrativo Positivo
- Información completa de la PQR

### Configuración en Código

El servicio de email está en:
- `backend/src/main/java/co/com/fitel/common/service/EmailService.java`

La configuración está en:
- `backend/src/main/resources/application.yml`

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca commitees la contraseña de aplicación en el repositorio
- Usa variables de entorno o archivos `.env` (que estén en `.gitignore`)
- En producción, usa un servicio de email profesional (SendGrid, AWS SES, etc.)

## Pruebas

Para probar el envío de correos:

1. Crea una PQR desde el frontend
2. Verifica que llegue el correo de constancia
3. Revisa los logs del backend para ver si hay errores

## Troubleshooting

### Error: "Authentication failed"
- Verifica que la contraseña de aplicación sea correcta (sin espacios)
- Asegúrate de que la verificación en dos pasos esté activa

### Error: "Connection timeout"
- Verifica que el puerto 587 esté abierto
- Revisa la configuración del firewall

### No llegan los correos
- Revisa la carpeta de spam
- Verifica que el email de destino sea válido
- Revisa los logs del backend para errores específicos
