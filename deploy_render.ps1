# Render API Deployment Script - Simplified
$apiKey = "rnd_iArYa2apnofaBHJ60iuDhOssKrJ1"
$serviceName = "portfolio-backend"
$repoUrl = "https://github.com/shreyachavn-collab/portfolio"
$branch = "main"
$rootDir = "backend_django"
$region = "oregon"
$plan = "free"

# Set up headers
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# Build minimal web service payload
$webServiceBody = @{
    "autoDeploy" = $true
    "branch" = $branch
    "buildCommand" = "pip install -r requirements.txt"
    "name" = $serviceName
    "owner" = "self"
    "plan" = $plan
    "region" = $region
    "rootDir" = $rootDir
    "startCommand" = "gunicorn portfolio_backend.wsgi --bind 0.0.0.0:`$PORT"
    "repo" = $repoUrl
}

$jsonBody = $webServiceBody | ConvertTo-Json

Write-Host "Creating Render web service..."
Write-Host "JSON Payload:`n$jsonBody`n"

try {
    $webServiceResp = Invoke-RestMethod -Uri "https://api.render.com/v1/services" `
        -Method Post `
        -Headers $headers `
        -Body $jsonBody `
        -ContentType "application/json"
    
    $webServiceId = $webServiceResp.id
    Write-Host "OK Web service created successfully!"
    Write-Host "Service ID: $webServiceId"
    Write-Host "Service Name: $($webServiceResp.name)"
    Write-Host "Status: $($webServiceResp.status)"
    
} catch {
    Write-Host "X Error creating web service:"
    Write-Host $_.Exception.Response.Content
    Write-Host ""
    Write-Host "Alternative: Please manually deploy via Render UI:"
    Write-Host "  1. Go to https://dashboard.render.com"
    Write-Host "  2. New > Web Service"
    Write-Host "  3. Connect GitHub repo: shreyachavn-collab/portfolio"
    Write-Host "  4. Build Command: pip install -r requirements.txt"
    Write-Host "  5. Start Command: gunicorn portfolio_backend.wsgi"
    Write-Host "  6. Root Directory: backend_django"
    exit 1
}
