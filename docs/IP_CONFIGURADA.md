# IPs Configuradas para Panel de Administración

## ✅ IPs Actualmente Permitidas

Las siguientes IPs están configuradas en `docker-compose.yml` para acceder al panel de administración:

### IPs Individuales:
- `127.0.0.1` - Localhost IPv4
- `::1` - Localhost IPv6
- `192.168.1.5` - Tu IP de Wi-Fi
- `172.31.176.1` - IP de WSL (Hyper-V)

### Rangos de Red:
- `192.168.1.0/24` - Toda la red local (192.168.1.0 - 192.168.1.255)

## 🔧 Cómo Modificar las IPs

### Opción 1: Editar docker-compose.yml

Edita la línea `ALLOWED_ADMIN_IPS` en `docker-compose.yml`:

```yaml
ALLOWED_ADMIN_IPS: 127.0.0.1,::1,192.168.1.5,192.168.1.0/24,172.31.176.1
```

Luego reinicia el frontend:
```bash
docker-compose restart frontend
```

### Opción 2: Variable de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
ALLOWED_ADMIN_IPS=127.0.0.1,::1,192.168.1.5,192.168.1.0/24
```

Y en `docker-compose.yml` usa:
```yaml
ALLOWED_ADMIN_IPS: ${ALLOWED_ADMIN_IPS}
```

## 📝 Agregar Nuevas IPs

Para agregar una nueva IP, simplemente agrégala separada por coma:

```yaml
ALLOWED_ADMIN_IPS: 127.0.0.1,::1,192.168.1.5,192.168.1.0/24,172.31.176.1,NUEVA_IP_AQUI
```

## ⚠️ Notas Importantes

1. **Rango 192.168.1.0/24**: Permite acceso desde cualquier dispositivo en tu red local (192.168.1.x)
2. **IPs Dinámicas**: Si tu IP cambia (DHCP), el rango `/24` te cubrirá automáticamente
3. **Producción**: En producción, usa IPs específicas en lugar de rangos amplios
4. **Seguridad**: Solo agrega IPs que realmente necesiten acceso

## 🔍 Verificar tu IP Actual

Para ver tu IP actual:
```powershell
ipconfig
```

Busca "Dirección IPv4" en la sección de tu adaptador activo.
