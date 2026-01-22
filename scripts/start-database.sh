#!/bin/bash

# Script para iniciar solo la base de datos PostgreSQL en Docker
# Útil cuando solo necesitas la BD para desarrollo o conexión con DBeaver

echo "🚀 Iniciando PostgreSQL en Docker..."
docker-compose up -d postgres

echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

echo "✅ Verificando estado del contenedor..."
docker-compose ps postgres

echo ""
echo "📊 Información de conexión:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: fitel_db"
echo "   Username: fitel"
echo "   Password: fiteladmin123"
echo ""
echo "💡 Puedes conectarte desde DBeaver usando estos datos"
echo "💡 Para ver los logs: docker-compose logs -f postgres"
