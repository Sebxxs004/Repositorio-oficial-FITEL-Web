#!/bin/bash
# ============================================================
# Script de instalación inicial para VPS Hostinger KVM
# Instala Docker, Docker Compose y clona el repositorio
# Ejecutar como root: bash vps-setup.sh
# ============================================================

set -e

echo "======================================================"
echo "  FITEL Web - Instalación inicial en VPS"
echo "======================================================"

# 1. Actualizar sistema
echo ""
echo "[1/6] Actualizando el sistema..."
apt-get update -y && apt-get upgrade -y

# 2. Instalar dependencias básicas
echo ""
echo "[2/6] Instalando dependencias..."
apt-get install -y \
    git \
    curl \
    wget \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw

# 3. Instalar Docker
echo ""
echo "[3/6] Instalando Docker..."
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 4. Instalar Docker Compose v2
echo ""
echo "[4/6] Instalando Docker Compose..."
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
curl -SL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
    -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"

# 5. Configurar firewall
echo ""
echo "[5/6] Configurando firewall (UFW)..."
ufw allow ssh
ufw allow 80/tcp
ufw allow 8080/tcp
ufw --force enable
ufw status

# 6. Clonar repositorio
echo ""
echo "[6/6] Clonando repositorio..."
cd /opt
git clone https://github.com/$(git config --global user.name 2>/dev/null || echo "TU_USUARIO")/Repositorio-oficial-FITEL-Web fitel-web || true
# Nota: Si el repo es privado, usa: git clone https://TOKEN@github.com/USUARIO/REPO.git

echo ""
echo "======================================================"
echo "  Instalación completada!"
echo "  Siguiente paso: crea el archivo .env en /opt/fitel-web/"
echo "  Luego ejecuta: bash scripts/vps-deploy.sh"
echo "======================================================"
