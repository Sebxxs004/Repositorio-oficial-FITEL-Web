# Script para verificar el estado de la base de datos PostgreSQL

Write-Host "🔍 Verificando estado de PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Verificar si el contenedor está corriendo
$containerStatus = docker ps --filter "name=fitel-postgres" --format "{{.Status}}"

if ($containerStatus) {
    Write-Host "✅ Contenedor PostgreSQL está corriendo" -ForegroundColor Green
    Write-Host "   Estado: $containerStatus" -ForegroundColor Gray
    Write-Host ""
    
    # Intentar conectar a la base de datos
    Write-Host "🔌 Intentando conectar a la base de datos..." -ForegroundColor Cyan
    $connectionTest = docker exec fitel-postgres pg_isready -U fitel
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Conexión exitosa a PostgreSQL" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Información de conexión para DBeaver:" -ForegroundColor Cyan
        Write-Host "   Host: localhost"
        Write-Host "   Port: 5432"
        Write-Host "   Database: fitel_db"
        Write-Host "   Username: fitel"
        Write-Host "   Password: fiteladmin123"
    } else {
        Write-Host "⚠️  PostgreSQL está corriendo pero no responde aún" -ForegroundColor Yellow
        Write-Host "   Espera unos segundos e intenta de nuevo" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Contenedor PostgreSQL NO está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Para iniciarlo, ejecuta:" -ForegroundColor Yellow
    Write-Host "   docker-compose up -d postgres" -ForegroundColor White
    Write-Host "   o" -ForegroundColor White
    Write-Host "   .\scripts\start-database.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs: docker-compose logs -f postgres" -ForegroundColor Gray
Write-Host "   Detener: docker-compose stop postgres" -ForegroundColor Gray
Write-Host "   Reiniciar: docker-compose restart postgres" -ForegroundColor Gray
