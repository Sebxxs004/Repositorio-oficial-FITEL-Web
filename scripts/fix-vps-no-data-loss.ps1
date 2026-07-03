param(
    [string]$ComposeFile = "docker-compose.prod.yml",
    [string]$EnvFile = ".env",
    [switch]$SkipDbUserRepair
)

$ErrorActionPreference = "Stop"

function Read-EnvValue {
    param(
        [string]$Path,
        [string]$Name
    )

    if (-not (Test-Path $Path)) {
        return $null
    }

    $match = Get-Content $Path | Where-Object {
        $_ -match "^\s*$([regex]::Escape($Name))\s*="
    } | Select-Object -First 1

    if (-not $match) {
        return $null
    }

    $value = ($match -split "=", 2)[1].Trim()
    if ($value.StartsWith('"') -and $value.EndsWith('"') -and $value.Length -ge 2) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    elseif ($value.StartsWith("'") -and $value.EndsWith("'") -and $value.Length -ge 2) {
        $value = $value.Substring(1, $value.Length - 2)
    }

    return $value
}

function Assert-Exists {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path $Path)) {
        throw "$Label no encontrado: $Path"
    }
}

Assert-Exists -Path $ComposeFile -Label "Archivo de Docker Compose"
Assert-Exists -Path $EnvFile -Label "Archivo .env"

$dbRootPassword = Read-EnvValue -Path $EnvFile -Name "DB_ROOT_PASSWORD"
$dbUserPassword = Read-EnvValue -Path $EnvFile -Name "DB_PASSWORD"
$dbUserName = Read-EnvValue -Path $EnvFile -Name "DATABASE_USERNAME"

if (-not $dbUserPassword) {
    $dbUserPassword = Read-EnvValue -Path $EnvFile -Name "DB_PASSWORD"
}

if (-not $dbUserName) {
    $dbUserName = "fitel"
}

if (-not $dbRootPassword) {
    throw "No se encontró DB_ROOT_PASSWORD en $EnvFile"
}

if (-not $dbUserPassword) {
    throw "No se encontró DB_PASSWORD en $EnvFile"
}

Write-Host "Verificando estado del stack de producción..." -ForegroundColor Cyan
docker compose --env-file $EnvFile -f $ComposeFile ps

Write-Host "" 
Write-Host "Levantando y reconstruyendo servicios sin tocar el volumen de MariaDB..." -ForegroundColor Cyan
docker compose --env-file $EnvFile -f $ComposeFile up -d --build mariadb backend frontend

if (-not $SkipDbUserRepair) {
    Write-Host "" 
    Write-Host "Reparando usuario MariaDB dentro de la base existente..." -ForegroundColor Cyan
    $sql = @"
CREATE USER IF NOT EXISTS '$dbUserName'@'%' IDENTIFIED BY '$dbUserPassword';
ALTER USER '$dbUserName'@'%' IDENTIFIED BY '$dbUserPassword';
GRANT ALL PRIVILEGES ON fitel_db.* TO '$dbUserName'@'%';
FLUSH PRIVILEGES;
"@

    $escapedSql = $sql.Replace("`r`n", " ").Replace("`n", " ")
    docker compose --env-file $EnvFile -f $ComposeFile exec -T mariadb mysql -uroot "-p$dbRootPassword" -e $escapedSql
}

Write-Host "" 
Write-Host "Verificación rápida de salud del backend..." -ForegroundColor Cyan
docker compose --env-file $EnvFile -f $ComposeFile logs --tail 80 backend

Write-Host "" 
Write-Host "Hecho. No se borró ningún volumen ni se eliminó la base de datos." -ForegroundColor Green
Write-Host "Si quieres validar desde el VPS, prueba: curl http://localhost:8080/actuator/health" -ForegroundColor Yellow