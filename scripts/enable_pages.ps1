# NOTE: For production use, pass the token via command-line argument or environment variable
# Example: .\enable_pages.ps1 -Token "YOUR_GITHUB_TOKEN"
param([string]$Token = '')

if(-not $Token) {
  Write-Output 'Usage: .\enable_pages.ps1 -Token YOUR_GITHUB_TOKEN'
  exit 1
}

$body = @{
  source = @{
    branch = 'main'
    path = '/'
  }
} | ConvertTo-Json
try {
  $res = Invoke-RestMethod -Method PUT -Uri 'https://api.github.com/repos/shreyachavn-collab/portfolio/pages' -Headers @{ Authorization = "token $Token"; 'User-Agent' = 'Enable-Pages-Script' } -Body $body -ContentType 'application/json' -TimeoutSec 30
  Write-Output 'ENABLED'
  $res | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output "ERROR: $($_.Exception.Message)"
  if ($_.Exception.Response) { $_.Exception.Response.StatusCode | Write-Output }
}
Start-Sleep -Seconds 2
try {
  $status = Invoke-RestMethod -Method GET -Uri 'https://api.github.com/repos/shreyachavn-collab/portfolio/pages' -Headers @{ Authorization = "token $Token"; 'User-Agent' = 'Enable-Pages-Script' } -TimeoutSec 30
  Write-Output 'STATUS:'
  $status | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output "STATUS-ERROR: $($_.Exception.Message)"
}
