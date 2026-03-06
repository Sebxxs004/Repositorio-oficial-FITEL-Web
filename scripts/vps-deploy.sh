#!/bin/bash
# ============================================================
# Script de despliegue de FITEL Web en VPS
# Ejecutar desde /opt/fitel-web/ después de crear el .env
# ============================================================

set -e

echo "======================================================"
echo "  FITEL Web - Desplegando en producción"
echo "======================================================"

# Verificar que existe el .env
if [ ! -f ".env" ]; then
    echo "ERROR: No existe el archivo .env"
    echo "Copia el .env.example y rellena los valores:"
    echo "  cp .env.example .env && nano .env"
    exit 1
fi

# Cargar variables y validar las críticas
source .env
if [ -z "$SERVER_IP" ] || [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
    echo "ERROR: Faltan variables obligatorias en .env (SERVER_IP, DB_PASSWORD, JWT_SECRET)"
    exit 1
fi

echo ""
echo "[1/4] Pulling cambios del repositorio..."
git pull origin main

echo ""
echo "[2/4] Deteniendo contenedores anteriores (si existen)..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

echo ""
echo "[3/4] Construyendo e iniciando contenedores..."
docker-compose -f docker-compose.prod.yml up --build -d

echo ""
echo "[4/4] Verificando estado..."
sleep 10
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "======================================================"
echo "  Despliegue completado!"
echo "  Frontend: http://${SERVER_IP}"
echo "  Backend:  http://${SERVER_IP}:8080/api"
echo ""
echo "  Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "======================================================"
