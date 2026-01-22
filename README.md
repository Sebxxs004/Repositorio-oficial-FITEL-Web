# FITEL Web - Plataforma Oficial

Plataforma web oficial de FITEL, proveedora de servicios de Internet y Televisión en Bogotá.

## 🏗️ Arquitectura

Este proyecto sigue una arquitectura modular basada en principios SOLID:

### Frontend
- **Framework**: Next.js 14 (React + TypeScript)
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **Estructura**: Componentes modulares y reutilizables

### Backend
- **Framework**: Spring Boot 3.2
- **Base de datos**: PostgreSQL
- **Arquitectura**: Modular por dominios (Plans, Coverage, PQR, etc.)
- **Seguridad**: Spring Security + JWT
- **Auditoría**: Logback + JPA Auditing

## 📁 Estructura del Proyecto

```
Repositorio-oficial-FITEL-Web/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas y layouts
│   │   ├── components/      # Componentes React modulares
│   │   ├── services/        # Servicios y lógica de negocio
│   │   └── lib/             # Utilidades
│   └── public/              # Assets estáticos
│
├── backend/                  # API Spring Boot
│   └── src/main/java/co/com/fitel/
│       ├── common/          # Configuraciones y utilidades comunes
│       └── modules/         # Módulos de negocio
│           ├── plans/       # Módulo de Planes
│           ├── coverage/    # Módulo de Cobertura
│           └── pqr/         # Módulo de PQR (futuro)
│
└── docker-compose.yml        # Orquestación de servicios
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- Java 17+
- Maven 3.9+
- Docker y Docker Compose (opcional)

### Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en: http://localhost:3000

#### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend disponible en: http://localhost:8080

### Docker Compose
```bash
docker-compose up -d
```

### 🔌 Conexión a la Base de Datos con DBeaver

La base de datos PostgreSQL corre en Docker y está lista para conectarse desde DBeaver.

**Configuración de conexión:**
- **Host**: `localhost`
- **Puerto**: `5432`
- **Base de datos**: `fitel_db`
- **Usuario**: `fitel`
- **Contraseña**: `fiteladmin123`

📖 **Guía completa**: Ver [docs/CONEXION_DBEAVER.md](docs/CONEXION_DBEAVER.md)

**Scripts útiles:**
```bash
# Iniciar solo la base de datos
.\scripts\start-database.ps1

# Verificar estado de la base de datos
.\scripts\check-database.ps1
```

## 📋 Características

### Comercial
- ✅ Presentación de planes de Internet y TV
- ✅ Consulta de cobertura por zonas
- ✅ Solicitud de instalación
- ✅ Canales de contacto (WhatsApp, teléfono, formulario)

### Operativa y Regulatoria
- ✅ Sección de información para usuarios
- ✅ Base para módulos de PQR
- ✅ Preparado para cumplimiento SIC/CRC
- ✅ Auditoría y trazabilidad

## 🎨 Identidad Visual

- **Colores principales**: Rojo (#FF1744) y Azul (#2196F3)
- **Estilo**: Limpio, cercano, familiar, profesional
- **Contraste**: Alto contraste para accesibilidad

## 🔒 Seguridad y Cumplimiento

- Auditoría completa de operaciones
- Logs estructurados para trazabilidad
- Preparado para cumplimiento regulatorio (SIC/CRC)
- Validación de datos en todas las capas

## 📝 Licencia

Propietario - FITEL

## 👥 Equipo

Desarrollado con principios SOLID y arquitectura modular para facilitar el mantenimiento y escalabilidad.
