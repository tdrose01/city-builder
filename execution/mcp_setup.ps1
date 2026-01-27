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