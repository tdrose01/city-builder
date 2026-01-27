[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Has($c){ [bool](Get-Command $c -ErrorAction SilentlyContinue) }

Write-Host "MCP health check..." -ForegroundColor Cyan
if (-not (Has "npx")) { throw "npx not found (install Node/npm)" }

& npx.cmd -y @smithery/cli@latest --version | Out-Host
if ($LASTEXITCODE -ne 0) { throw "Smithery CLI not runnable via npx" }

if (-not $env:GITHUB_TOKEN) { Write-Warning "GITHUB_TOKEN not set. GitHub MCP tools may not authenticate." }

Write-Host "OK: Smithery + npx look healthy." -ForegroundColor Green
Write-Host "If MCP servers fail to auth, run: npx -y @smithery/cli@latest login" -ForegroundColor Yellow