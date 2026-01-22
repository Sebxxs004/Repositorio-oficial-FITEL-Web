# Script PowerShell para ejecutar todos los scripts SQL
# FITEL Web Database Setup

Write-Host "🚀 Ejecutando scripts SQL para configurar la base de datos..." -ForegroundColor Cyan
Write-Host ""

$scripts = @(
    "01_create_tables.sql",
    "02_insert_initial_data.sql",
    "03_create_indexes.sql",
    "04_create_views.sql",
    "05_create_functions.sql",
    "06_create_triggers.sql"
)

$scriptPath = Join-Path $PSScriptRoot "database\sql"

foreach ($script in $scripts) {
    $fullPath = Join-Path $scriptPath $script
    Write-Host "📄 Ejecutando: $script" -ForegroundColor Yellow
    
    try {
        Get-Content $fullPath | docker exec -i fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db
        Write-Host "   ✅ $script ejecutado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Error al ejecutar $script : $_" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "🔍 Verificando tablas creadas..." -ForegroundColor Cyan
docker exec fitel-mariadb mysql -u fitel -pfiteladmin123 fitel_db -e "SHOW TABLES;"

Write-Host ""
Write-Host "✅ Proceso completado!" -ForegroundColor Green
