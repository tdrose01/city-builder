# execution/apply_patch.ps1
# Applies a unified diff using git apply.
# Usage:
#   .\execution\apply_patch.ps1 -PatchFile <path>
#   .\execution\apply_patch.ps1 -PatchText "<diff>"

[CmdletBinding()]
param(
  [Parameter(ParameterSetName='File', Mandatory=$true)]
  [string]$PatchFile,

  [Parameter(ParameterSetName='Text', Mandatory=$true)]
  [string]$PatchText
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Fail([string]$m) {
  Write-Host $m -ForegroundColor Red
  exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail "git not found on PATH"
}

$tmp = $null
try {
  if ($PSCmdlet.ParameterSetName -eq 'Text') {
    $tmp = Join-Path $env:TEMP ("ralph_patch_{0}.diff" -f ([guid]::NewGuid().ToString('N')))
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($tmp, $PatchText, $utf8NoBom)
    $PatchFile = $tmp
  }

  if (-not (Test-Path $PatchFile)) {
    Fail "Patch file not found: $PatchFile"
  }

  git apply --whitespace=nowarn --recount --verbose $PatchFile 2>&1 | ForEach-Object { Write-Host $_ }
  if ($LASTEXITCODE -ne 0) {
    Fail "git apply failed (exit $LASTEXITCODE). Patch file: $PatchFile"
  }

  Write-Host "Patch applied." -ForegroundColor Green
}
finally {
  if ($tmp -and (Test-Path $tmp)) {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
}
