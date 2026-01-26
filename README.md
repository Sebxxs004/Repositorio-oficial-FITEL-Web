# FITEL Web - Plataforma Oficial

Plataforma web oficial de FITEL, proveedora de servicios de Internet y Televisión en Bogotá.

## 🏗️ Arquitectura

Este proyecto sigue una arquitectura modular basada en principios SOLID:

### Frontend
- **Framework**: Next.js 14 (React + TypeScript)
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **Mapas**: Leaflet.js
- **Estructura**: Componentes modulares y reutilizables

### Backend
- **Framework**: Spring Boot 3.2
- **Base de datos**: MariaDB 10.11
- **Arquitectura**: Modular por dominios (Plans, Coverage, PQR, Auth, Config)
- **Seguridad**: Spring Security + JWT + IP Whitelist
- **Encriptación**: AES-256 para datos sensibles (IPs)
- **Auditoría**: Logback + JPA Auditing

## 📁 Estructura del Proyecto

```
Repositorio-oficial-FITEL-Web/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas y layouts
│   │   │   ├── operaciones-internas/  # Panel de administración
│   │   │   └── pqrs/        # Módulo PQR público
│   │   ├── components/      # Componentes React modulares
│   │   │   ├── admin/       # Componentes del panel admin
│   │   │   ├── pqrs/        # Componentes del módulo PQR
│   │   │   └── sections/     # Secciones de la homepage
│   │   ├── services/        # Servicios y lógica de negocio
│   │   ├── hooks/           # Hooks personalizados
│   │   └── types/           # Tipos TypeScript
│   └── public/              # Assets estáticos
│
├── backend/                  # API Spring Boot
│   └── src/main/java/co/com/fitel/
│       ├── common/          # Configuraciones y utilidades comunes
│       └── modules/         # Módulos de negocio
│           ├── plans/       # Módulo de Planes
│           ├── coverage/    # Módulo de Cobertura
│           ├── pqr/         # Módulo de PQR (crear, consultar, dashboard)
│           ├── auth/        # Módulo de autenticación y gestión de usuarios
│           └── config/      # Módulo de configuración (contacto, carousel)
│
├── database/                 # Scripts SQL
│   └── sql/                 # Scripts de creación y migración
│
└── docker-compose.yml        # Orquestación de servicios
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- Java 17+
- Maven 3.9+
- Docker y Docker Compose

### Desarrollo Local

#### Opción 1: Docker Compose (Recomendado)
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Servicios disponibles:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MariaDB: localhost:3307

#### Opción 2: Desarrollo Manual

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en: http://localhost:3000

**Backend:**
```bash
cd backend
mvn spring-boot:run
```
Backend disponible en: http://localhost:8080

**Base de Datos:**
```bash
# Iniciar solo la base de datos
docker-compose up -d mariadb
```

### 🔌 Conexión a la Base de Datos

**Configuración de conexión:**
- **Host**: `localhost`
- **Puerto**: `3307` (MariaDB)
- **Base de datos**: `fitel_db`
- **Usuario**: `fitel`
- **Contraseña**: `fiteladmin123`

**Scripts SQL:**
```bash
# Ejecutar todos los scripts
docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db < database/sql/00_run_all.sql
```

## 📋 Características

### Público (Frontend)

#### Homepage
- ✅ Carousel de imágenes con degradado
- ✅ Presentación de planes de Internet y TV (500+ Mbps)
- ✅ Sección "¿Por qué elegir a FITEL?"
- ✅ Consulta de cobertura por zonas (mapa interactivo)
- ✅ Sección "Sobre FITEL" (identidad profesional)
- ✅ Formulario de contacto

#### Módulo PQR
- ✅ Consultar PQR por CUN o documento
- ✅ Realizar nueva PQR
- ✅ Generación automática de CUN con número de convenio

### Panel de Administración

#### Dashboard
- ✅ Estadísticas en tiempo real:
  - PQRs Pendientes
  - Planes Activos
  - Usuarios Activos
- ✅ Gráfico estadístico de PQRs recibidas (últimos 30 días)

#### Gestión de PQRs
- ✅ Listar y gestionar PQRs
- ✅ Cambiar estados
- ✅ Ver detalles completos

#### Gestión de Planes
- ✅ CRUD completo de planes
- ✅ Activar/desactivar planes

#### Configuración
- ✅ **Información de Contacto**: Actualizar WhatsApp, teléfono, email
- ✅ **Gestión de Carousel**: Ver, reordenar, eliminar y agregar imágenes

#### Usuarios e IPs
- ✅ **Gestión de Usuarios**: 
  - Modificar contraseña
  - Modificar nombre
  - Activar/desactivar usuarios
  - Eliminar usuarios
- ✅ **Gestión de IPs**: 
  - Agregar IPs permitidas (encriptadas con AES-256)
  - Activar/desactivar IPs
  - IP Whitelist para acceso al panel admin

### Seguridad

- ✅ Autenticación JWT
- ✅ IP Whitelist para panel admin
- ✅ Encriptación AES-256 para IPs almacenadas
- ✅ Middleware de protección de rutas
- ✅ Validación de datos en todas las capas
- ✅ Auditoría completa de operaciones

## 🔒 Seguridad y Cumplimiento

- **Autenticación**: JWT con tokens seguros
- **IP Whitelist**: Control de acceso por IP al panel admin
- **Encriptación**: AES-256 para datos sensibles
- **Auditoría**: Logs estructurados para trazabilidad
- **Cumplimiento**: Preparado para SIC/CRC
- **CUN**: Generación automática con número de convenio de la empresa

## 🎨 Identidad Visual

- **Colores principales**: 
  - Rojo primario: `#dc2626` (primary-red)
  - Azul: `#2196F3`
  - Grises neutros para fondos y texto
- **Estilo**: Limpio, moderno, profesional y accesible
- **Contraste**: Alto contraste para accesibilidad WCAG

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev:frontend      # Iniciar frontend en desarrollo
npm run dev:backend       # Iniciar backend en desarrollo

# Build
npm run build:frontend    # Compilar frontend para producción
npm run build:backend     # Compilar backend (JAR)

# Docker
npm run docker:up         # Iniciar servicios con Docker
npm run docker:down       # Detener servicios
npm run docker:logs       # Ver logs de servicios
```

## 🗄️ Base de Datos

### Tablas Principales
- `plans` - Planes de servicio
- `coverage_areas` - Áreas de cobertura
- `pqr` - Peticiones, Quejas y Recursos
- `admin_users` - Usuarios administradores
- `allowed_admin_ips` - IPs permitidas (encriptadas)
- `contact_config` - Configuración de contacto
- `carousel_images` - Imágenes del carousel
- `system_config` - Configuración del sistema

### Funciones SQL
- `generate_cun()` - Genera CUN automáticamente con formato: `[CONVENIO][AÑO][SECUENCIA]`

### Triggers
- `trg_pqr_generate_cun` - Genera CUN automáticamente al crear PQR

## 🔐 Acceso al Panel Admin

1. **Requisitos**:
   - IP debe estar en la whitelist
   - Credenciales de administrador

2. **Login por defecto**:
   - Usuario: `admin`
   - Contraseña: `admin123`

3. **Agregar IP a whitelist**:
   - Acceder desde IP permitida
   - Ir a "Usuarios e IPs" > "Gestión de IPs"
   - Agregar nueva IP (se encripta automáticamente)

## 📝 Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
ALLOWED_ADMIN_IPS=127.0.0.1,::1,192.168.1.5
```

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mariadb://mariadb:3306/fitel_db
    username: fitel
    password: fiteladmin123
```

## 🧪 Testing

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

## 📚 Documentación Adicional

- [Documentación del Panel Admin](database/sql/README_ADMIN.md)
- [Guía de IP Whitelist](docs/WHITELIST_IP_ADMIN.md)
- [Encriptación de IPs](docs/ENCRIPTACION_IPS.md)

## 🛠️ Tecnologías Utilizadas

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Leaflet.js
- Lucide React

### Backend
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- MariaDB
- JWT (jjwt)
- Lombok
- MapStruct

### DevOps
- Docker
- Docker Compose
- Maven
- npm

## 📝 Licencia

Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

Desarrollado con principios SOLID y arquitectura modular para facilitar el mantenimiento y escalabilidad.

## 🚧 Roadmap

- [ ] Tests automatizados (Jest, JUnit)
- [ ] CI/CD Pipeline
- [ ] Documentación API (Swagger/OpenAPI)
- [ ] Notificaciones por email
- [ ] Dashboard de métricas avanzadas
- [ ] Exportación de reportes (PDF, Excel)

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo de FITEL.

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2026
