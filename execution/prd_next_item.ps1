[CmdletBinding()]
param(
  [string]$PrdPath = "PRD.md"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path $PrdPath)) { throw "PRD not found: $PrdPath" }

Get-Content -Path $PrdPath | Where-Object {
  $_ -match '^\s*-\s*\[\s\]\s+'
} | Select-Object -First 1
