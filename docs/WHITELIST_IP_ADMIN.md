# Configuración de Whitelist de IPs para Panel de Administración

## 🔒 Seguridad por IP

El panel de administración puede configurarse para que solo sea accesible desde IPs específicas. Esto añade una capa adicional de seguridad.

## ⚙️ Configuración

### Opción 1: Variables de Entorno (Recomendado)

Agrega la variable de entorno `ALLOWED_ADMIN_IPS` con las IPs permitidas separadas por comas:

**En `docker-compose.yml` (frontend):**
```yaml
frontend:
  environment:
    ALLOWED_ADMIN_IPS: "192.168.1.100,10.0.0.50,203.0.113.0/24"
```

**En `.env.local` (desarrollo local):**
```
ALLOWED_ADMIN_IPS=127.0.0.1,::1,192.168.1.100
```

### Opción 2: Deshabilitar Whitelist (Desarrollo)

Si no configuras `ALLOWED_ADMIN_IPS` o la dejas vacía, **todas las IPs serán permitidas** (solo para desarrollo).

## 📝 Formato de IPs

### IPs Individuales
```
ALLOWED_ADMIN_IPS=192.168.1.100,10.0.0.50,203.0.113.45
```

### Rangos CIDR (Básico)
```
ALLOWED_ADMIN_IPS=192.168.1.0/24,10.0.0.0/16
```

### Comodín (Permitir todas)
```
ALLOWED_ADMIN_IPS=*
```

## 🔍 Cómo Obtener tu IP

### En Windows:
```powershell
ipconfig
```
Busca "IPv4 Address" en la sección de tu adaptador de red.

### En Linux/Mac:
```bash
ifconfig
# o
ip addr
```

### IP Pública (si accedes desde internet):
Visita: https://whatismyipaddress.com/

## ⚠️ Consideraciones Importantes

1. **Localhost siempre permitido**: `127.0.0.1` y `::1` deberían estar en la lista para desarrollo local.

2. **IPs Dinámicas**: Si tu IP cambia (DHCP), necesitarás actualizar la lista.

3. **VPN/Proxy**: Si usas VPN o proxy, la IP visible será la del servidor proxy, no tu IP real.

4. **Headers de Proxy**: El middleware intenta obtener la IP real desde headers comunes:
   - `x-forwarded-for`
   - `x-real-ip`
   - `cf-connecting-ip` (Cloudflare)

5. **Producción**: En producción con Nginx/Proxy, configura los headers correctamente:
   ```nginx
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   ```

## 🚀 Ejemplo de Configuración Completa

### Desarrollo Local:
```env
ALLOWED_ADMIN_IPS=127.0.0.1,::1
```

### Producción (IPs específicas):
```env
ALLOWED_ADMIN_IPS=203.0.113.45,203.0.113.46,198.51.100.0/24
```

### Deshabilitado (Desarrollo):
```env
# No configurar ALLOWED_ADMIN_IPS o dejarlo vacío
```

## 🔐 Seguridad Adicional

La whitelist de IPs es una capa adicional de seguridad. También deberías:

1. ✅ Usar HTTPS en producción
2. ✅ Cambiar contraseñas por defecto
3. ✅ Implementar rate limiting
4. ✅ Monitorear accesos
5. ✅ Rotar tokens periódicamente
