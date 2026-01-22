# Script PowerShell para iniciar solo la base de datos PostgreSQL en Docker
# Útil cuando solo necesitas la BD para desarrollo o conexión con DBeaver

Write-Host "🚀 Iniciando PostgreSQL en Docker..." -ForegroundColor Cyan
docker-compose up -d postgres

Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "✅ Verificando estado del contenedor..." -ForegroundColor Green
docker-compose ps postgres

Write-Host ""
Write-Host "📊 Información de conexión:" -ForegroundColor Cyan
Write-Host "   Host: localhost"
Write-Host "   Port: 5432"
Write-Host "   Database: fitel_db"
Write-Host "   Username: fitel"
Write-Host "   Password: fiteladmin123"
Write-Host ""
Write-Host "💡 Puedes conectarte desde DBeaver usando estos datos" -ForegroundColor Yellow
Write-Host "💡 Para ver los logs: docker-compose logs -f postgres" -ForegroundColor Yellow
