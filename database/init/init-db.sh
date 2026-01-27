#!/bin/bash
# Script de inicialización que se ejecuta siempre al iniciar el contenedor
# Verifica y crea solo lo que falta

set -e

echo "🔧 Inicializando base de datos FITEL..."

# Esperar a que MariaDB esté listo
until mysqladmin ping -h localhost --silent; do
  echo "⏳ Esperando a que MariaDB esté listo..."
  sleep 2
done

echo "✅ MariaDB está listo"

# Ejecutar script de actualización siempre
mysql -u root -p"$MYSQL_ROOT_PASSWORD" < /docker-entrypoint-initdb.d/always-run.sql 2>/dev/null || true

# Ejecutar scripts de inicialización solo si la base de datos está vacía
if [ ! -f /var/lib/mysql/.db_initialized ]; then
  echo "📦 Primera inicialización - Ejecutando todos los scripts..."
  
  # Ejecutar todos los scripts SQL
  for script in /docker-entrypoint-initdb.d/sql/*.sql; do
    if [ -f "$script" ]; then
      echo "📄 Ejecutando: $(basename $script)"
      mysql -u root -p"$MYSQL_ROOT_PASSWORD" fitel_db < "$script" 2>/dev/null || true
    fi
  done
  
  # Marcar como inicializado
  touch /var/lib/mysql/.db_initialized
  echo "✅ Base de datos inicializada"
else
  echo "🔄 Base de datos ya existe - Solo actualizando cambios..."
  # Ejecutar solo el script de actualización
  mysql -u root -p"$MYSQL_ROOT_PASSWORD" fitel_db < /docker-entrypoint-initdb.d/always-run.sql 2>/dev/null || true
fi

echo "✅ Inicialización completada"
