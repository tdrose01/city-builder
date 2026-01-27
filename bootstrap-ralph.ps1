
# bootstrap-ralph.ps1 - Install-only bootstrap for Ralph 3-Layer Architecture (Windows)
# Creates directives/, execution/, .tmp/, writes scripts, does NOT run Ralph.

[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\city-slacker"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Info($m){ Write-Host $m -ForegroundColor Cyan }
function Ok($m){ Write-Host $m -ForegroundColor Green }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }

function Ensure-Dir([string]$Path){
  if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path -Force | Out-Null }
}

function Write-FileUtf8([string]$Path, [string]$Content){
  Ensure-Dir (Split-Path $Path -Parent)
  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

Info "Bootstrapping (install-only) into: $RepoRoot"

$directivesDir = Join-Path $RepoRoot "directives"
$executionDir  = Join-Path $RepoRoot "execution"
$tmpDir        = Join-Path $RepoRoot ".tmp"

Ensure-Dir $directivesDir
Ensure-Dir $executionDir
Ensure-Dir $tmpDir

# .gitignore
$gitignorePath = Join-Path $RepoRoot ".gitignore"
if (-not (Test-Path $gitignorePath)) { Write-FileUtf8 $gitignorePath "# Ralph bootstrap .gitignore`r`n" }
$gitignore = Get-Content $gitignorePath -Raw
@(".tmp/", ".env", "credentials.json", "token.json") | ForEach-Object {
  if ($gitignore -notmatch [regex]::Escape($_)) { Add-Content -Path $gitignorePath -Value $_ }
}

# progress.txt
$progressPath = Join-Path $RepoRoot "progress.txt"
if (-not (Test-Path $progressPath)) { Write-FileUtf8 $progressPath "" }

# PRD.md (optional stub if missing)
$prdPath = Join-Path $RepoRoot "PRD.md"
if (-not (Test-Path $prdPath)) {
  Write-FileUtf8 $prdPath @"
# PRD

- [ ] First task placeholder (edit PRD.md)
"@
  Warn "PRD.md did not exist. Created a placeholder PRD.md."
}

# -------------------------
# Layer 1: directives
# -------------------------
Write-FileUtf8 (Join-Path $directivesDir "ralph_loop.md") @"
# Ralph Loop Directive (City Slacker)

## Goal
Implement exactly ONE unchecked PRD item per iteration.

## Rules
- Never mark PRD.md complete until quality gate passes (unless -Fast).
- Prefer MCP tools (github, context7-mcp, puppeteer) over ad-hoc shell commands.
- Stop cleanly on paid API limits (Codex 429).
- Update progress.txt after each successful iteration.
"@

Write-FileUtf8 (Join-Path $directivesDir "mcp_usage.md") @"
# MCP Usage

- Do not store tokens/keys in JSON.
- Smithery login (once): npx -y @smithery/cli@latest login
- GitHub token via env var: setx GITHUB_TOKEN "ghp_..."
- Windows stdio: use npx.cmd (NOT cmd /c).
"@

Write-FileUtf8 (Join-Path $directivesDir "testing_and_linting.md") @"
# Testing + Linting

Quality gate script: execution/run_quality_gate.ps1

Detection:
- Node: package.json -> npm test, npm run lint (if exists)
- Python/.NET can be added later (extend run_quality_gate.ps1)
"@

# -------------------------
# Layer 3: execution scripts
# -------------------------

# execution/mcp_setup.ps1 (no nested here-strings)
Write-FileUtf8 (Join-Path $executionDir "mcp_setup.ps1") @'
[CmdletBinding()]
param(
  [string]$CodexConfigToml = "$HOME\.codex\config.toml",
  [string]$GeminiSettingsJson = "$HOME\.gemini\settings.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ensure-Dir($p){ if(-not (Test-Path $p)){ New-Item -ItemType Directory -Path $p -Force | Out-Null } }
function Write-Utf8NoBomFile([string]$Path,[string]$Content){
  Ensure-Dir (Split-Path $Path -Parent)
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

Ensure-Dir (Split-Path $CodexConfigToml -Parent)

# Codex: append-once TOML block
$mcpBlockLines = @(
  "# --- Ralph-managed MCP servers (Smithery) ---",
  "[mcp_servers.github]",
  'command = "npx.cmd"',
  'args = ["-y","@smithery/cli@latest","run","@smithery-ai/github"]',
  "startup_timeout_sec = 30",
  "tool_timeout_sec = 120",
  "",
  "[mcp_servers.context7_mcp]",
  'command = "npx.cmd"',
  'args = ["-y","@smithery/cli@latest","run","@upstash/context7-mcp"]',
  "startup_timeout_sec = 30",
  "tool_timeout_sec = 120",
  "",
  "[mcp_servers.puppeteer]",
  'command = "npx.cmd"',
  'args = ["-y","@smithery/cli@latest","run","@smithery-ai/puppeteer"]',
  "startup_timeout_sec = 60",
  "tool_timeout_sec = 240",
  "# --- end Ralph-managed MCP servers ---",
  ""
)
$mcpBlock = ($mcpBlockLines -join "`r`n")

if (-not (Test-Path $CodexConfigToml)) {
  @(
    'approval_policy = "never"',
    "",
    $mcpBlock
  ) | Set-Content -Path $CodexConfigToml -Encoding UTF8
} else {
  $existing = Get-Content -Path $CodexConfigToml -Raw
  if ($existing -notmatch "Ralph-managed MCP servers") {
    ($existing.TrimEnd() + "`r`n`r`n" + $mcpBlock) | Set-Content -Path $CodexConfigToml -Encoding UTF8
  }
}

# Gemini: JSON (NO BOM), no secrets
$geminiJsonLines = @(
  "{",
  '  "ide": { "hasSeenNudge": true, "enabled": true },',
  '  "mcpServers": {',
  '    "github": { "command": "npx.cmd", "args": ["-y","@smithery/cli@latest","run","@smithery-ai/github"] },',
  '    "context7-mcp": { "command": "npx.cmd", "args": ["-y","@smithery/cli@latest","run","@upstash/context7-mcp"] },',
  '    "puppeteer": { "command": "npx.cmd", "args": ["-y","@smithery/cli@latest","run","@smithery-ai/puppeteer"] }',
  "  }",
  "}"
)
$geminiJson = ($geminiJsonLines -join "`r`n")
Write-Utf8NoBomFile -Path $GeminiSettingsJson -Content $geminiJson

Write-Host "MCP setup complete:" -ForegroundColor Green
Write-Host "  Codex:  $CodexConfigToml"
Write-Host "  Gemini: $GeminiSettingsJson"
'@

# execution/mcp_health_check.ps1
Write-FileUtf8 (Join-Path $executionDir "mcp_health_check.ps1") @'
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
'@

# execution/run_quality_gate.ps1
Write-FileUtf8 (Join-Path $executionDir "run_quality_gate.ps1") @'
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Run($cmd, $args){
  Write-Host ("Running: {0} {1}" -f $cmd, ($args -join " ")) -ForegroundColor Cyan
  & $cmd @args
  if ($LASTEXITCODE -ne 0) { throw "Failed: $cmd $($args -join ' ')" }
}

if (Test-Path "package.json") {
  Run "npm" @("test")
  $pkg = Get-Content package.json -Raw | ConvertFrom-Json
  if ($pkg.scripts -and $pkg.scripts.PSObject.Properties.Name -contains "lint") {
    Run "npm" @("run","lint")
  } else {
    Write-Host "No npm lint script found (skipping lint)." -ForegroundColor Yellow
  }
  Write-Host "Quality gate passed (Node)." -ForegroundColor Green
  exit 0
}

Write-Host "No known test/lint tooling detected. Quality gate is a no-op." -ForegroundColor Yellow
exit 0
'@

# execution/prd_next_item.ps1
Write-FileUtf8 (Join-Path $executionDir "prd_next_item.ps1") @'
[CmdletBinding()]
param([string]$PrdPath = "PRD.md")

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path $PrdPath)) { throw "PRD not found: $PrdPath" }

$lines = Get-Content $PrdPath
foreach ($l in $lines) {
  if ($l -match "^\s*-\s*\[\s\]\s+") { Write-Output $l; exit 0 }
}
Write-Output ""
'@

# execution/prd_mark_done.ps1
Write-FileUtf8 (Join-Path $executionDir "prd_mark_done.ps1") @'
[CmdletBinding()]
param([string]$PrdPath = "PRD.md")

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$lines = Get-Content $PrdPath
for ($i=0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match "^(\s*-\s*)\[\s\](\s+.*)$") {
    $lines[$i] = ($matches[1] + "[X]" + $matches[2])
    $lines | Set-Content -Path $PrdPath -Encoding UTF8
    exit 0
  }
}
'@

# execution/progress_append.ps1
Write-FileUtf8 (Join-Path $executionDir "progress_append.ps1") @'
[CmdletBinding()]
param(
  [string]$ProgressPath = "progress.txt",
  [Parameter(Mandatory=$true)][string]$Message
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $ProgressPath -Value "[$ts] $Message"
'@

# -------------------------
# Layer 2: Ralph.ps1 (written separately below, but also created here)
# -------------------------
$ralphPath = Join-Path $RepoRoot "Ralph.ps1"
if (-not (Test-Path $ralphPath)) {
  Write-FileUtf8 $ralphPath "# Placeholder. Replace with the new Ralph.ps1 provided separately.`r`n"
}

Ok "Bootstrap complete (install-only)."
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "  1) Overwrite Ralph.ps1 with the new version below" -ForegroundColor Gray
Write-Host "  2) Optional: npx -y @smithery/cli@latest login" -ForegroundColor Gray
Write-Host "  3) Optional: setx GITHUB_TOKEN ""ghp_...""" -ForegroundColor Gray
Write-Host "  4) Test: .\Ralph.ps1 -TestOnly" -ForegroundColor Gray
