# ==================================================================================
# Script de Despliegue a Azure (Versión Compatible con Azure for Students)
# ==================================================================================

# Detener el script inmediatamente si ocurre un error
$ErrorActionPreference = "Stop"

# --- Configuración ---
$appName = "fitel-demo"
$location = "eastus"
$rgName = "rg-$appName"
$acrName = "acr$appName".Replace("-", "") # Solo letras y números
$envName = "env-$appName"
$logAnalyticsName = "logs-$appName"
$dbRootPass = "ChangeMeRoot123!"
$dbUserPass = "fiteladmin123"
$jwtSecret = "ThisIsASecretKeyForJWTTokenGenerationAndItShouldBeLongEnough"

# Asegurarnos de usar la codificación correcta para caracteres especiales
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Función auxiliar para comprobar errores de comandos externos (Docker)
function Check-LastExitCode {
    param([string]$Message = "Ocurrió un error en el paso anterior.")
    if ($LASTEXITCODE -ne 0) {
        Write-Error "FATAL: $Message (Código de salida: $LASTEXITCODE)"
        exit $LASTEXITCODE
    }
}

# --- 0. Validación de Contexto ---
$scriptPath = $PSScriptRoot
# Si se ejecuta desde la carpeta scripts, subir un nivel
if (Test-Path "$scriptPath\..\docker-compose.yml") {
    Set-Location "$scriptPath\.."
}
if (-not (Test-Path ".\docker-compose.yml")) {
    Write-Error "ERROR: Debes ejecutar este script desde la raíz del proyecto."
    exit 1
}
Write-Host "Directorio de trabajo: $(Get-Location)" -ForegroundColor Green

# --- 0.1 Validación de Docker ---
# ... (resto igual)

# --- 1. Registrar Proveedores (Robustez mejorada) ---
function Register-Provider ($namespace) {
    $state = az provider show --namespace $namespace --query registrationState -o tsv
    if ($state -ne "Registered") {
        Write-Host "Registrando $namespace..." -ForegroundColor Yellow
        az provider register --namespace $namespace
        $retries = 0
        do {
            Start-Sleep -Seconds 10
            $state = az provider show --namespace $namespace --query registrationState -o tsv
            Write-Host "  > Esperando registro de $namespace ($state)..." -ForegroundColor Gray
            $retries++
        } until ($state -eq "Registered" -or $retries -gt 60)
    } else {
        Write-Host "$namespace ya está registrado." -ForegroundColor Green
    }
}

Write-Host "Validando proveedores de recursos..." -ForegroundColor Cyan
Register-Provider "Microsoft.ContainerRegistry"
Register-Provider "Microsoft.App"
Register-Provider "Microsoft.OperationalInsights"

# --- 2. Crear Grupo de Recursos ---
Write-Host "Creando Grupo de Recursos '$rgName'..." -ForegroundColor Cyan
az group create --name $rgName --location $location

# --- 3. Crear Container Registry (ACR) ---
Write-Host "Creando Container Registry '$acrName'..." -ForegroundColor Cyan
$acrExists = az acr show --name $acrName --resource-group $rgName --query id -o tsv 2>$null
if (-not $acrExists) {
    az acr create --resource-group $rgName --name $acrName --sku Basic --admin-enabled true
}
$acrLoginServer = az acr show --name $acrName --resource-group $rgName --query loginServer -o tsv
Write-Host "ACR creado: $acrLoginServer" -ForegroundColor Green

# Login local de Docker al ACR
Write-Host "Iniciando sesión de Docker en ACR..." -ForegroundColor Cyan
az acr login --name $acrName

# --- 4. Construir y Subir Imágenes (LOCALMENTE) ---

# --- Base de Datos ---
Write-Host "==== [Base de Datos] Construyendo y Subiendo ====" -ForegroundColor Magenta
docker build -t "$acrLoginServer/fitel-db:latest" ./database
Check-LastExitCode "Falló la construcción de la imagen de Base de Datos"
docker push "$acrLoginServer/fitel-db:latest"
Check-LastExitCode "Falló la subida de la imagen de Base de Datos"

# --- Backend ---
Write-Host "==== [Backend] Construyendo y Subiendo ====" -ForegroundColor Magenta
docker build -t "$acrLoginServer/fitel-backend:latest" ./backend
Check-LastExitCode "Falló la construcción de la imagen de Backend"
docker push "$acrLoginServer/fitel-backend:latest"
Check-LastExitCode "Falló la subida de la imagen de Backend"

# --- 5. Crear Entorno de Apps ---
# ... (resto igual)
Write-Host "Creando Log Analytics Workspace..." -ForegroundColor Cyan
$logWsId = az monitor log-analytics workspace show --resource-group $rgName --workspace-name $logAnalyticsName --query customerId -o tsv 2>$null
if (-not $logWsId) {
    az monitor log-analytics workspace create --resource-group $rgName --workspace-name $logAnalyticsName
    $logWsId = az monitor log-analytics workspace show --resource-group $rgName --workspace-name $logAnalyticsName --query customerId -o tsv
    $logWsKey = az monitor log-analytics workspace get-shared-keys --resource-group $rgName --workspace-name $logAnalyticsName --query primarySharedKey -o tsv
}

Write-Host "Creando Container Apps Environment..." -ForegroundColor Cyan
az containerapp env create `
    --name $envName `
    --resource-group $rgName `
    --location $location `
    --logs-workspace-id $logWsId `
    --logs-workspace-key $logWsKey

# --- 6. Desplegar Base de Datos ---
Write-Host "Desplegando Container: Base de Datos..." -ForegroundColor Cyan
az containerapp create `
  --name fitel-db `
  --resource-group $rgName `
  --environment $envName `
  --image "$acrLoginServer/fitel-db:latest" `
  --registry-server $acrLoginServer `
  --env-vars MYSQL_ROOT_PASSWORD=$dbRootPass MYSQL_USER=fitel MYSQL_PASSWORD=$dbUserPass MYSQL_DATABASE=fitel_db `
  --ingress internal `
  --target-port 3306 `
  --transport tcp `
  --min-replicas 1 --max-replicas 1

# --- 7. Desplegar Backend ---
Write-Host "Desplegando Container: Backend..." -ForegroundColor Cyan
az containerapp create `
  --name fitel-backend `
  --resource-group $rgName `
  --environment $envName `
  --image "$acrLoginServer/fitel-backend:latest" `
  --registry-server $acrLoginServer `
  --env-vars "SPRING_PROFILES_ACTIVE=prod" "DATABASE_URL=jdbc:mariadb://fitel-db:3306/fitel_db" "DATABASE_USERNAME=fitel" "DATABASE_PASSWORD=$dbUserPass" "JWT_SECRET=$jwtSecret" `
  --ingress external `
  --target-port 8080 `
  --min-replicas 1 --max-replicas 1

$backendUrl = az containerapp show --name fitel-backend --resource-group $rgName --query properties.configuration.ingress.fqdn -o tsv
$backendFullUrl = "https://$backendUrl/api"
Write-Host "Backend disponible en: $backendFullUrl" -ForegroundColor Green

# --- 8. Construir Frontend (con URL real) y Desplegar ---
Write-Host "==== [Frontend] Construyendo con URL: $backendFullUrl ====" -ForegroundColor Magenta
docker build `
  --build-arg "NEXT_PUBLIC_API_URL=$backendFullUrl" `
  -t "$acrLoginServer/fitel-frontend:latest" `
  ./frontend
Check-LastExitCode "Falló la construcción de la imagen de Frontend"

Write-Host "Subiendo imagen de Frontend..."
docker push "$acrLoginServer/fitel-frontend:latest"
Check-LastExitCode "Falló la subida de la imagen de Frontend"

Write-Host "Desplegando Container: Frontend..." -ForegroundColor Cyan
az containerapp create `
  --name fitel-frontend `
  --resource-group $rgName `
  --environment $envName `
  --image "$acrLoginServer/fitel-frontend:latest" `
  --registry-server $acrLoginServer `
  --ingress external `
  --target-port 3000 `
  --min-replicas 1 --max-replicas 1


$frontendUrl = az containerapp show --name fitel-frontend --resource-group $rgName --query properties.configuration.ingress.fqdn -o tsv

Write-Host ""
Write-Host "================ DESPLIEGUE FINALIZADO ================" -ForegroundColor Green
Write-Host "Frontend: https://$frontendUrl" -ForegroundColor Yellow
Write-Host "Backend:  https://$backendUrl" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Green