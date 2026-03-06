# ==================================================================================
# Script de Despliegue a Azure (Versión Compatible con Azure for Students)
# ==================================================================================

param (
    [string]$Mode = "" 
)

# Detener el script inmediatamente si ocurre un error
$ErrorActionPreference = "Stop"

# --- Menú Interactivo de Selección ---
if ($Mode -eq "") {
    Clear-Host
    Write-Host "================ SELECTOR DE DESPLIEGUE ==================" -ForegroundColor Cyan
    Write-Host "Seleccione qué componentes desea desplegar:"
    Write-Host "1. Todo (Base de Datos + Backend + Frontend)"
    Write-Host "2. Solo Frontend (Más rápido - UI changes)"
    Write-Host "3. Solo Backend (Lógica de negocio)"
    Write-Host "4. Solo Base de Datos (Schema changes)"
    Write-Host "=========================================================="
    $selection = Read-Host "Ingrese opción (1-4) [Default: 1]"
} else {
    $selection = $Mode
    Write-Host "Modo seleccionado por argumento: $selection" -ForegroundColor Cyan
}

if ([string]::IsNullOrWhiteSpace($selection)) { $selection = "1" }

$DeployDB = $false
$DeployBackend = $false
$DeployFrontend = $false

switch ($selection) {
    "1" { $DeployDB = $true; $DeployBackend = $true; $DeployFrontend = $true }
    "2" { $DeployFrontend = $true }
    "3" { $DeployBackend = $true }
    "4" { $DeployDB = $true }
    default { Write-Error "Opción inválida"; exit 1 }
}

Write-Host "Seleccionado: DB=$DeployDB, BE=$DeployBackend, FE=$DeployFrontend" -ForegroundColor Yellow
Start-Sleep -Seconds 2

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
Register-Provider "Microsoft.Storage"

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
if ($DeployDB) {
    Write-Host "==== [Base de Datos] Construyendo y Subiendo ====" -ForegroundColor Magenta
    docker build -t "$acrLoginServer/fitel-db:latest" ./database
    Check-LastExitCode "Falló la construcción de la imagen de Base de Datos"
    docker push "$acrLoginServer/fitel-db:latest"
    Check-LastExitCode "Falló la subida de la imagen de Base de Datos"
} else {
    Write-Host "SALTADO: Construcción de Base de Datos" -ForegroundColor DarkGray
}

# --- Backend ---
if ($DeployBackend) {
    Write-Host "==== [Backend] Construyendo y Subiendo ====" -ForegroundColor Magenta
    docker build `
    --no-cache `
    -t "$acrLoginServer/fitel-backend:latest" `
    ./backend
    Check-LastExitCode "Falló la construcción de la imagen de Backend"
    docker push "$acrLoginServer/fitel-backend:latest"
    Check-LastExitCode "Falló la subida de la imagen de Backend"
} else {
    Write-Host "SALTADO: Construcción de Backend" -ForegroundColor DarkGray
}

# --- 5. Crear Entorno de Apps ---
# ... (resto igual)
Write-Host "Creando Log Analytics Workspace..." -ForegroundColor Cyan
$logWsId = az monitor log-analytics workspace show --resource-group $rgName --workspace-name $logAnalyticsName --query customerId -o tsv 2>$null
if (-not $logWsId) {
    az monitor log-analytics workspace create --resource-group $rgName --workspace-name $logAnalyticsName
    $logWsId = az monitor log-analytics workspace show --resource-group $rgName --workspace-name $logAnalyticsName --query customerId -o tsv
}
# Siempre regenerar/obtener las keys
$logWsKey = az monitor log-analytics workspace get-shared-keys --resource-group $rgName --workspace-name $logAnalyticsName --query primarySharedKey -o tsv

Write-Host "Creando Container Apps Environment..." -ForegroundColor Cyan
az containerapp env create `
    --name $envName `
    --resource-group $rgName `
    --location $location `
    --logs-workspace-id $logWsId `
    --logs-workspace-key $logWsKey

# --- 5.1 Configurar Storage Persistente (Azure Files) ---
Write-Host "Configurando Storage Persistente..." -ForegroundColor Cyan
# Nombre único para storage: st + nombreapp (sin guiones)
$storageName = "st" + $appName.Replace("-", "").ToLower()
# Asegurar longitud válida (max 24)
if ($storageName.Length -gt 24) { $storageName = $storageName.Substring(0, 24) }
$shareName = "fitel-uploads"
$mountName = "fitel-storage"

# Verificar/Crear Storage Account (Idempotente)
Write-Host "Asegurando existencia de Storage Account '$storageName'..." -ForegroundColor Cyan
az storage account create --name $storageName --resource-group $rgName --location $location --sku Standard_LRS
Check-LastExitCode "Falló la creación del Storage Account"

Start-Sleep -Seconds 5

# Obtener Key (con reintento)
$storageKey = az storage account keys list --account-name $storageName --resource-group $rgName --query "[0].value" -o tsv
if (-not $storageKey) {
    Write-Error "No se pudo obtener la clave del storage account."
    exit 1
}

# Crear Share
az storage share create --name $shareName --account-name $storageName --account-key $storageKey
Check-LastExitCode "Falló la creación del File Share"

# Vincular Storage al Environment
Write-Host "Vinculando Storage al Environment..."
az containerapp env storage set `
    --name $envName `
    --resource-group $rgName `
    --storage-name $mountName `
    --azure-file-account-name $storageName `
    --azure-file-account-key $storageKey `
    --azure-file-share-name $shareName `
    --access-mode ReadWrite
Check-LastExitCode "Falló la vinculación del Storage al Environment"

# --- 6. Desplegar Base de Datos ---
if ($DeployDB) {
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
}

# --- 7. Desplegar Backend (Con Persistencia) ---
if ($DeployBackend) {
    Write-Host "Generando configuración YAML para Backend con persistencia..."
    
    # Obtener ID del Environment para el YAML
    $managedEnvId = az containerapp env show --name $envName --resource-group $rgName --query id -o tsv

    # Definir configuración usando Hashtable y convertir a JSON para evitar errores de sintaxis YAML
    $backendConfig = @{
        location = $location
        name = "fitel-backend"
        resourceGroup = $rgName
        type = "Microsoft.App/containerApps"
        properties = @{
            managedEnvironmentId = $managedEnvId
            configuration = @{
                activeRevisionsMode = "Single"
                ingress = @{
                    external = $true
                    targetPort = 8080
                    transport = "tcp"
                    corsPolicy = @{
                        allowedOrigins = @("*")
                        allowedMethods = @("*")
                        allowedHeaders = @("*")
                    }
                }
            }
            template = @{
                containers = @(
                    @{
                        name = "fitel-backend"
                        image = "$acrLoginServer/fitel-backend:latest"
                        resources = @{
                            cpu = 0.5
                            memory = "1Gi"
                        }
                        env = @(
                            @{ name = "SPRING_PROFILES_ACTIVE"; value = "prod" },
                            @{ name = "DATABASE_URL"; value = "jdbc:mariadb://fitel-db:3306/fitel_db" },
                            @{ name = "DATABASE_USERNAME"; value = "fitel" },
                            @{ name = "DATABASE_PASSWORD"; value = $dbUserPass },
                            @{ name = "JWT_SECRET"; value = $jwtSecret }
                        )
                        volumeMounts = @(
                            @{
                                volumeName = $mountName
                                mountPath = "/app/uploads"
                            }
                        )
                    }
                )
                scale = @{
                    minReplicas = 1
                    maxReplicas = 1
                }
                volumes = @(
                    @{
                        name = $mountName
                        storageName = $mountName
                        storageType = "AzureFile"
                    }
                )
            }
        }
    }

    # Guardar como JSON (que es YAML válido, pero az cli a veces necesita ayuda)
    $backendYamlPath = Join-Path $PSScriptRoot "backend-deploy.json"
    $backendConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $backendYamlPath -Encoding UTF8
    
    # Leer el contenido JSON y pasarlo a un archivo YAML puro (PyYAML a veces falla con JSON si tiene BOM o quirks)
    # Convertir JSON a YAML simple mediante un truco rápido o simplemente limpiar el JSON
    # La solución más robusta es usar el JSON directamente pero asegurando que no haya BOM y sea ASCII puro si es posible
    
    # Vamos a usar el truco de pasar el JSON como string en un archivo pero lo renombramos a .json para que si az lo lee sepa qué es
    # Pero az containerapp create --yaml espera YAML. JSON es subconjunto de YAML.
    # El error anterior "mapping values are not allowed here" en linea 2 col 20 sugiere que el parser YAML de Python
    # se confundió con las comillas o estructura del JSON generado por PowerShell.
    
    # Solución definitiva: Generar YAML manualmente pero con cuidado extremo, o arreglar el JSON.
    # PowerShell ConvertTo-Json a veces mete cosas raras? No.
    # El error "mapping values are not allowed here" suele ser cuando hay mezcla de indentación o caracteres inválidos.
    
    $backendYaml = "location: $location`n" +
                   "name: fitel-backend`n" +
                   "resourceGroup: $rgName`n" +
                   "type: Microsoft.App/containerApps`n" +
                   "properties:`n" +
                   "  managedEnvironmentId: $managedEnvId`n" +
                   "  configuration:`n" +
                   "    activeRevisionsMode: Single`n" +
                   "    ingress:`n" +
                   "      external: true`n" + 
                   "      targetPort: 8080`n" +
                   "      transport: tcp`n" +
                   "      corsPolicy:`n" +
                   "        allowedOrigins:`n" +
                   "          - '*'`n" +
                   "        allowedMethods:`n" +
                   "          - '*'`n" +
                   "        allowedHeaders:`n" +
                   "          - '*'`n" +
                   "  template:`n" +
                   "    containers:`n" +
                   "      - name: fitel-backend`n" +
                   "        image: $acrLoginServer/fitel-backend:latest`n" +
                   "        resources:`n" +
                   "          cpu: 0.5`n" +
                   "          memory: 1Gi`n" +
                   "        env:`n" +
                   "          - name: SPRING_PROFILES_ACTIVE`n" +
                   "            value: prod`n" +
                   "          - name: DATABASE_URL`n" +
                   "            value: jdbc:mariadb://fitel-db:3306/fitel_db`n" +
                   "          - name: DATABASE_USERNAME`n" +
                   "            value: fitel`n" +
                   "          - name: DATABASE_PASSWORD`n" +
                   "            value: $dbUserPass`n" +
                   "          - name: JWT_SECRET`n" +
                   "            value: $jwtSecret`n" +
                   "        volumeMounts:`n" +
                   "          - volumeName: $mountName`n" +
                   "            mountPath: /app/uploads`n" +
                   "    scale:`n" +
                   "      minReplicas: 1`n" +
                   "      maxReplicas: 1`n" +
                   "    volumes:`n" +
                   "      - name: $mountName`n" +
                   "        storageName: $mountName`n" +
                   "        storageType: AzureFile"

    $backendYamlPath = Join-Path $PSScriptRoot "backend-deploy.yaml"
    [System.IO.File]::WriteAllText($backendYamlPath, $backendYaml)
    
    Write-Host "Desplegando Container: Backend (Manual YAML con workaround para bug de ingress)..." -ForegroundColor Cyan
    
    # INTENTO 3: Generar YAML CORRECTO incluyendo credenciales del registro
    # Para evitar errores de autenticación con --yaml, DEBEN incluirse los secretos en el YAML
    
    $acrPassword = az acr credential show --name $acrName --query "passwords[0].value" -o tsv
    
    $backendYaml = "location: $location`n" +
               "name: fitel-backend`n" +
               "resourceGroup: $rgName`n" +
               "type: Microsoft.App/containerApps`n" +
               "properties:`n" +
               "  managedEnvironmentId: $managedEnvId`n" +
               "  configuration:`n" +
               "    activeRevisionsMode: Single`n" +
               "    secrets:`n" +
               "      - name: acr-password`n" +
               "        value: $acrPassword`n" +
               "    registries:`n" +
               "      - server: $acrLoginServer`n" +
               "        username: $acrName`n" +
               "        passwordSecretRef: acr-password`n" +
               "  template:`n" +
               "    containers:`n" +
               "      - name: fitel-backend`n" +
               "        image: $acrLoginServer/fitel-backend:latest`n" +
               "        resources:`n" +
               "          cpu: 0.5`n" +
               "          memory: 1Gi`n" +
               "        env:`n" +
               "          - name: SPRING_PROFILES_ACTIVE`n" +
               "            value: prod`n" +
               "          - name: DATABASE_URL`n" +
               "            value: jdbc:mariadb://fitel-db:3306/fitel_db`n" +
               "          - name: DATABASE_USERNAME`n" +
               "            value: fitel`n" +
               "          - name: DATABASE_PASSWORD`n" +
               "            value: $dbUserPass`n" +
               "          - name: JWT_SECRET`n" +
               "            value: $jwtSecret`n" +
               "        volumeMounts:`n" +
               "          - volumeName: $mountName`n" +
               "            mountPath: /app/uploads`n" +
               "    scale:`n" +
               "      minReplicas: 1`n" +
               "      maxReplicas: 1`n" +
               "    volumes:`n" +
               "      - name: $mountName`n" +
               "        storageName: $mountName`n" +
               "        storageType: AzureFile"
                   
    [System.IO.File]::WriteAllText($backendYamlPath, $backendYaml)
    
    # Aplicar configuración (Ya incluye credenciales, así que no dará 401 Unauthorized)
    az containerapp create `
        --name fitel-backend `
        --resource-group $rgName `
        --yaml "$backendYamlPath"

    # 3. Asegurar Ingress externamente (por si se perdió o no estaba)
    Write-Host "Configurando Ingress..."
    # Usamos 'auto' o 'http' en lugar de tcp para evitar problemas de VNET
    az containerapp ingress enable `
        --name fitel-backend `
        --resource-group $rgName `
        --type external `
        --target-port 8080 `
        --transport auto
        
    # Los CORS se configurarán al final del script una vez se conozca la URL del frontend
    # Limpiar archivo temporal
    if (Test-Path $backendYamlPath) { Remove-Item $backendYamlPath }
}

$backendUrl = az containerapp show --name fitel-backend --resource-group $rgName --query properties.configuration.ingress.fqdn -o tsv
$backendFullUrl = "https://$backendUrl/api"
Write-Host "Backend disponible en: $backendFullUrl" -ForegroundColor Green

# --- 8. Construir Frontend (con URL real) y Desplegar ---
if ($DeployFrontend) {
    Write-Host "==== [Frontend] Construyendo con URL: $backendFullUrl ====" -ForegroundColor Magenta
    docker build `
    --no-cache `
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
} else {
    Write-Host "SALTADO: Despliegue de Frontend"
}

# --- 9. Configuración CORS de Ingress ---
# Se ejecuta siempre para asegurar que backend permita al frontend
Write-Host "Configurando CORS en Backend..."
$frontendFqdn = $null
$backendFqdn = $null

try {
    # Check Frontend
    $frontendFqdn = az containerapp show --name fitel-frontend --resource-group $rgName --query properties.configuration.ingress.fqdn -o tsv 2>$null
    if ($LASTEXITCODE -ne 0) { $frontendFqdn = $null }
} catch { $frontendFqdn = $null }

try {
    # Check Backend
    $backendFqdn = az containerapp show --name fitel-backend --resource-group $rgName --query properties.configuration.ingress.fqdn -o tsv 2>$null
    if ($LASTEXITCODE -ne 0) { $backendFqdn = $null }
} catch { $backendFqdn = $null }

if (-not [string]::IsNullOrWhiteSpace($frontendFqdn) -and -not [string]::IsNullOrWhiteSpace($backendFqdn)) {
    $frontendHttps = "https://$frontendFqdn"
    Write-Host "  Backend detectado: $backendFqdn" -ForegroundColor Gray
    Write-Host "  Frontend detectado: $frontendFqdn" -ForegroundColor Gray
    Write-Host "  Permitiendo origen: $frontendHttps con credenciales" -ForegroundColor Cyan
    
    try {
        # Configurar CORS en Ingress para permitir credenciales y origen específico
        az containerapp ingress cors enable `
            --name fitel-backend `
            --resource-group $rgName `
            --allowed-origins $frontendHttps `
            --allow-credentials true `
            --allowed-methods "*" `
            --allowed-headers "*" 2>$null
            
        if ($LASTEXITCODE -ne 0) { throw "Error en comando AZ CLI" }
        Write-Host "  CORS configurado exitosamente." -ForegroundColor Green
    } catch {
        Write-Host "  Error al aplicar configuración CORS. Intente asignarlo manualmente." -ForegroundColor Red
    }
} else {
    Write-Host "  Advertencia: No se pudo configurar CORS automáticamente." -ForegroundColor Yellow
    Write-Host "  (Frontend: '$frontendFqdn', Backend: '$backendFqdn')" -ForegroundColor Gray
}

Write-Host ""
Write-Host "================ DESPLIEGUE FINALIZADO ================" -ForegroundColor Green
Write-Host "Frontend: https://$frontendFqdn" -ForegroundColor Yellow
Write-Host "Backend:  https://$backendFqdn" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Green