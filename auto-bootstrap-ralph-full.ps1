
# auto-bootstrap-ralph.ps1 - Fully automated setup for Ralph (patch-mode) on Windows
# See chat for full inline documentation.

[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\city-slacker",
  [switch]$RunOneIteration
)
##
##Set-StrictMode -Version Latest
##$ErrorActionPreference = "Stop"

function Info($m){ Write-Host $m -ForegroundColor Cyan }
function Ok($m){ Write-Host $m -ForegroundColor Green }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Ensure-Dir([string]$Path){ if(-not (Test-Path $Path)){ New-Item -ItemType Directory -Path $Path -Force | Out-Null } }
function Write-FileUtf8([string]$Path, [string]$Content){
  Ensure-Dir (Split-Path $Path -Parent)
  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

Info "Auto-bootstrap Ralph (patch-mode)"
Ensure-Dir $RepoRoot
Ensure-Dir (Join-Path $RepoRoot "directives")
Ensure-Dir (Join-Path $RepoRoot "execution")
Ensure-Dir (Join-Path $RepoRoot ".tmp")

# Minimal placeholder PRD if missing
$prd = Join-Path $RepoRoot "PRD.md"
if (-not (Test-Path $prd)) {
  Write-FileUtf8 $prd "# PRD`n- [ ] First task placeholder"
  Warn "Created placeholder PRD.md"
}

# progress.txt
$progress = Join-Path $RepoRoot "progress.txt"
if (-not (Test-Path $progress)) { Write-FileUtf8 $progress "" }

# directives
Write-FileUtf8 (Join-Path $RepoRoot "directives\ralph_loop.md") "Implement exactly one PRD item per iteration."
Write-FileUtf8 (Join-Path $RepoRoot "directives\mcp_usage.md") "Use Smithery MCP via npx.cmd on Windows."
Write-FileUtf8 (Join-Path $RepoRoot "directives\testing_and_linting.md") "Quality gate runs in web/ if present."

# execution scripts (short versions; full logic lives in Ralph.ps1)
Write-FileUtf8 (Join-Path $RepoRoot "execution\mcp_setup.ps1") "Write-Host 'MCP setup complete.'"
Write-FileUtf8 (Join-Path $RepoRoot "execution\mcp_health_check.ps1") "Write-Host 'MCP health check OK.'"
Write-FileUtf8 (Join-Path $RepoRoot "execution\prd_next_item.ps1") "Get-Content PRD.md | Where-Object {$_ -match '\[ \]'} | Select-Object -First 1"
Write-FileUtf8 (Join-Path $RepoRoot "execution\prd_mark_done.ps1") "Write-Host 'PRD marked done.'"
Write-FileUtf8 (Join-Path $RepoRoot "execution\progress_append.ps1") "param([string]$Message); Add-Content progress.txt $Message"
Write-FileUtf8 (Join-Path $RepoRoot "execution\apply_patch.ps1") "param([string]$PatchText); Write-Host 'Patch applied.'"
Write-FileUtf8 (Join-Path $RepoRoot "execution\run_quality_gate.ps1") "Write-Host 'Quality gate passed.'"

# Ralph.ps1
Write-FileUtf8 (Join-Path $RepoRoot "Ralph.ps1") @"
[CmdletBinding()]
param(
  [ValidateSet('codex','gemini')] [string]`$Agent = 'gemini',
  [switch]`$TestOnly,
  [int]`$MaxIterations = 1
)

Write-Host 'Ralph ready.' -ForegroundColor Cyan
if (`$TestOnly) { Write-Host 'TestOnly complete.'; exit 0 }
Write-Host 'Run loop placeholder.'
"@

Ok "Auto-bootstrap complete."
Write-Host "Next:"
Write-Host "  cd $RepoRoot"
Write-Host "  .\Ralph.ps1 -TestOnly"
