# FITEL Web — Official Platform

Full-stack web platform for FITEL, an ISP and TV provider in Bogotá, Colombia.
Beyond a landing page — includes a PQRS complaint system integrated with 
Colombia's SIC government API, an admin panel, and automated email notifications.

🌐 **Live:** [fitelcolombia.com](https://fitelcolombia.com)

---

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 14 (React + TypeScript)
- **Styles:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Maps:** Leaflet.js

### Backend
- **Framework:** Spring Boot 3.2
- **Database:** MariaDB 10.11
- **Architecture:** Domain-modular (Plans, Coverage, PQR, Auth, Config)
- **Security:** Spring Security + JWT + IP Whitelist
- **Encryption:** AES-256 for sensitive data
- **Auditing:** Logback + JPA Auditing

---

## 📁 Project Structure

```text
Repositorio-oficial-FITEL-Web/
├── frontend/                 # Next.js application
│   └── src/
│       ├── app/              # Pages & layouts
│       │   ├── operaciones-internas/  # Admin panel
│       │   └── pqrs/         # Public complaint module
│       ├── components/       # Modular React components
│       ├── services/         # Business logic & API calls
│       ├── hooks/            # Custom hooks
│       └── types/            # TypeScript types
│
├── backend/                  # Spring Boot API
│   └── src/main/java/co/com/fitel/
│       └── modules/          # Business modules
│           ├── plans/
│           ├── coverage/
│           ├── pqr/
│           ├── auth/
│           └── config/
│
├── database/                 # SQL scripts & migrations
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Java 17+
- Maven 3.9+
- Docker & Docker Compose

### Run with Docker (Recommended)

```bash
cp .env.example .env   # Fill in your credentials
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Manual Setup

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && mvn spring-boot:run
```

---

## ✨ Features

**Public**
- Homepage with interactive coverage map (Leaflet.js)
- Internet & TV plans display
- PQRS module — file and track complaints via CUN or document ID
- SIC SOAP API integration for government-side complaint tracking

**Admin Panel**
- Real-time dashboard (pending PQRs, active plans, active users)
- PQRS management with status updates and automated user email notifications
- Full CRUD for plans and service configuration
- CMS-like controls: carousel images, contact info, TV channel grid
- User management and IP whitelist (AES-256 encrypted)

**Security**
- JWT authentication
- IP Whitelist for admin access
- AES-256 encryption for stored IPs
- Full audit logging

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Zod |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | MariaDB 10.11 |
| DevOps | Docker, Docker Compose, Maven |

---

## 📝 Environment Variables

Copy `.env.example` and fill in your values before running.

---

## 📚 Additional Docs

- [Admin Panel Guide](database/sql/README_ADMIN.md)
- [IP Whitelist Guide](docs/WHITELIST_IP_ADMIN.md)

---

## 🚧 Roadmap

- [ ] Automated tests (Jest, JUnit)
- [ ] CI/CD Pipeline
- [ ] API docs (Swagger/OpenAPI)
- [ ] Advanced metrics dashboard
