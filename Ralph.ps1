#requires -Version 5.1
<#
Ralph1.ps1 - Patch-mode Orchestrator for Gemini/Codex.

Key fixes:
- Patch is written to a temp file and passed as -PatchFile (avoids multi-line argv / binding issues).
- AutoStash works on all Git builds by backing up/restoring toolchain around stash push/pop.
- Git warnings on stderr won't crash the script (PowerShell 5.1 NativeCommandError behavior).
#>

[CmdletBinding()]
param(
  [ValidateSet('codex','gemini')]
  [string]$Agent = 'gemini',

  [switch]$Fast,
  [switch]$TestOnly,
  [switch]$AutoStash,

  # 0 = unlimited
  [int]$MaxIterations = 1
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Info([string]$m){ Write-Host $m -ForegroundColor Cyan }
function Warn([string]$m){ Write-Host $m -ForegroundColor Yellow }
function Ok([string]$m){ Write-Host $m -ForegroundColor Green }
function Err([string]$m){ Write-Host $m -ForegroundColor Red }
function Has([string]$c){ [bool](Get-Command $c -ErrorAction SilentlyContinue) }

function Get-GeminiCmd {
  if (Get-Command 'gemini' -ErrorAction SilentlyContinue) { return 'gemini' }
  if (Get-Command 'gemini-cli' -ErrorAction SilentlyContinue) { return 'gemini-cli' }
  return $null
}

function RunPS([string]$Path, [string[]]$RunArgs=@()){
  $prettyArgs = $RunArgs
  if ($prettyArgs.Count -gt 0 -and $prettyArgs[0] -eq '-PatchFile') {
    Info ("Running: {0} -PatchFile <temp.diff>" -f $Path)
  } else {
    Info ("Running: {0} {1}" -f $Path, ($prettyArgs -join ' '))
  }

  & $Path @RunArgs
  if ($LASTEXITCODE -ne 0) { throw "Failed: $Path" }
}

function Ensure-GitRepo {
  if (-not (Has 'git')) { throw 'git not found on PATH' }
  $inside = (git rev-parse --is-inside-work-tree 2>$null)
  if ($LASTEXITCODE -ne 0 -or $inside -ne 'true') {
    throw 'Not inside a git repo. Run Ralph from the repo root.'
  }
}

function RepoIsDirty { return [bool](git status --porcelain) }

function Extract-DiffBlock([string]$Text){
  $pattern = '```diff\s*(?<diff>[\s\S]*?)```'
  $m = [regex]::Match($Text, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $m.Success) { return $null }
  return $m.Groups['diff'].Value.Trim()
}

function Invoke-GitCapture([string[]]$GitArgs){
  $oldEap = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  try {
    $out = & git @GitArgs 2>&1
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $oldEap
  }

  $out | Where-Object { $_ -notmatch 'LF will be replaced by CRLF' } | ForEach-Object { Write-Host $_ }
  return $code
}

function Backup-Toolchain([string]$BackupDir){
  New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

  $scriptPath = $PSCommandPath
  if (-not $scriptPath) { throw 'PSCommandPath not available.' }

  $scriptLeaf = Split-Path $scriptPath -Leaf
  Copy-Item -Force $scriptPath (Join-Path $BackupDir $scriptLeaf)

  $execDir = Join-Path (Get-Location) 'execution'
  if (Test-Path $execDir) {
    $destExec = Join-Path $BackupDir 'execution'
    New-Item -ItemType Directory -Path $destExec -Force | Out-Null
    Get-ChildItem -Path $execDir -Filter '*.ps1' -File -ErrorAction SilentlyContinue | ForEach-Object {
      Copy-Item -Force $_.FullName (Join-Path $destExec $_.Name)
    }
  }
}

function Restore-Toolchain([string]$BackupDir){
  $scriptPath = $PSCommandPath
  if (-not $scriptPath) { return }

  $scriptLeaf = Split-Path $scriptPath -Leaf
  $backupScript = Join-Path $BackupDir $scriptLeaf
  if (Test-Path $backupScript) { Copy-Item -Force $backupScript $scriptPath }

  $backupExec = Join-Path $BackupDir 'execution'
  $execDir = Join-Path (Get-Location) 'execution'
  if (Test-Path $backupExec) {
    New-Item -ItemType Directory -Path $execDir -Force | Out-Null
    Get-ChildItem -Path $backupExec -Filter '*.ps1' -File -ErrorAction SilentlyContinue | ForEach-Object {
      Copy-Item -Force $_.FullName (Join-Path $execDir $_.Name)
    }
  }
}

function AutoStash-Push {
  if (-not $AutoStash) { return $null }
  if (-not (RepoIsDirty)) { return $null }

  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $msg = "ralph-autostash-$stamp"
  $backupDir = Join-Path $env:TEMP ("ralph_toolchain_backup_{0}" -f ([guid]::NewGuid().ToString('N')))

  Warn "AutoStash: backing up toolchain to: $backupDir"
  Backup-Toolchain $backupDir

  Warn "AutoStash: stashing working tree ($msg) ..."
  $code = Invoke-GitCapture @('stash','push','-u','-m',$msg)
  if ($code -ne 0) { throw "AutoStash failed (exit $code)." }

  Warn "AutoStash: restoring toolchain after stash ..."
  Restore-Toolchain $backupDir

  return @{ Message = $msg; BackupDir = $backupDir }
}

function AutoStash-Pop($State){
  if (-not $AutoStash) { return }
  if (-not $State) { return }

  $backupDir = $State.BackupDir
  if (-not $backupDir) { return }

  Warn 'AutoStash: restoring stashed changes (git stash pop) ...'
  [void](Invoke-GitCapture @('stash','pop'))

  try { Remove-Item -Recurse -Force $backupDir -ErrorAction SilentlyContinue } catch {}
}

Info 'Ralph ready.'
Ensure-GitRepo

$required = @(
  '.\execution\mcp_setup.ps1',
  '.\execution\mcp_health_check.ps1',
  '.\execution\apply_patch.ps1',
  '.\execution\run_quality_gate.ps1',
  '.\execution\prd_next_item.ps1',
  '.\execution\prd_mark_done.ps1',
  '.\execution\progress_append.ps1'
)
foreach ($p in $required) {
  if (-not (Test-Path $p)) { throw "Missing: $p (run bootstrap)" }
}

RunPS '.\execution\mcp_setup.ps1'
RunPS '.\execution\mcp_health_check.ps1'

if ($TestOnly) { Ok 'TestOnly complete.'; exit 0 }

if (-not (Test-Path 'PRD.md')) { throw 'PRD.md not found' }
if (-not (Test-Path 'progress.txt')) { New-Item -ItemType File -Path 'progress.txt' -Force | Out-Null }

$iter = 0
$stashState = $null

try {
  $stashState = AutoStash-Push

  while ($true) {
    if ($MaxIterations -gt 0 -and $iter -ge $MaxIterations) { Ok "Reached MaxIterations=$MaxIterations. Stopping."; break }

    $prd = Get-Content 'PRD.md' -Raw
    if ($prd -notmatch '\[ \]') { Ok 'All PRD items complete.'; break }

    $next = & .\execution\prd_next_item.ps1
    if ([string]::IsNullOrWhiteSpace($next)) { Ok 'No unchecked PRD items found.'; break }

    Info "Next PRD item: $next"

    if (-not $AutoStash -and (RepoIsDirty)) { Err 'Working tree dirty. Commit/stash first or run with -AutoStash.'; break }

    if ($Fast) { Warn 'FAST mode: skipping quality gate.' }
    else { Info 'Standard mode: tests/lint required if present.' }

$instruction = @'
Review PRD.md and progress.txt.
Implement EXACTLY ONE PRD item (the next unchecked item).
Do not implement more than one PRD item in a single iteration.

PATCH MODE (hard requirement):
- Output exactly ONE unified diff inside a fenced diff block.
- The patch must apply with: git apply
- Do not use editor tools like replace/write_file/run_shell_command.
- Only change what is necessary for THIS ONE item.

Format exactly like this:

```diff
diff --git a/path/file.ext b/path/file.ext
...
```

After the diff block, include a short summary (3-6 bullets).

PRD item:
'@ + $next + "`r`n"

    if ($Fast) { $instruction += "FAST MODE: skip tests/lint.`r`n" }
    else { $instruction += "STANDARD MODE: run tests/lint if present and ensure they pass.`r`n" }

    $text = $null

    switch ($Agent) {
      'gemini' {
        $g = Get-GeminiCmd
        if (-not $g) { throw 'gemini CLI not found on PATH' }

        Info 'Invoking Gemini CLI...'
        $oldEap = $ErrorActionPreference
        $ErrorActionPreference = 'SilentlyContinue'
        try {
          $raw = & $g "$instruction" 2>&1
          $exit = $LASTEXITCODE
        } finally {
          $ErrorActionPreference = $oldEap
        }

        $rawFiltered = $raw | Where-Object { $_ -notmatch 'Loaded cached credentials\.' }
        $rawFiltered | ForEach-Object { Write-Host $_ }

        if ($exit -ne 0) { throw "Gemini failed with exit code $exit" }
        $text = ($rawFiltered -join "`n")
      }

      'codex' {
        if (-not (Has 'codex')) { throw 'codex CLI not found on PATH' }

        Info 'Invoking Codex CLI...'
        $oldEap = $ErrorActionPreference
        $ErrorActionPreference = 'SilentlyContinue'
        try {
          $codexInstruction = $instruction + "`r`nNOTE: You may run read-only shell commands (e.g., rg, cat) to inspect files, but do not edit files except via the diff block.`r`n"
          $codexOutFile = Join-Path $env:TEMP ("ralph_codex_last_{0}.txt" -f ([guid]::NewGuid().ToString('N')))
          $null = $codexInstruction | & codex --ask-for-approval on-failure --sandbox workspace-write exec - --output-last-message $codexOutFile --color never 2>&1
          $exit = $LASTEXITCODE
          if (Test-Path $codexOutFile) { $raw = Get-Content -Path $codexOutFile }
          else { $raw = @() }
        } finally {
          $ErrorActionPreference = $oldEap
        }

        $raw | ForEach-Object { Write-Host $_ }
        if ($exit -ne 0) { throw "Codex failed with exit code $exit" }
        $text = ($raw -join "`n")
      }
    }

    $patch = Extract-DiffBlock $text
    if (-not $patch) {
      Err 'No ```diff``` block found. PRD not marked.'
      RunPS '.\execution\progress_append.ps1' @('-Message','FAILED: no diff block produced; PRD not marked.')
      break
    }

    $patchFile = Join-Path $env:TEMP ("ralph_patch_{0}.diff" -f ([guid]::NewGuid().ToString('N')))
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($patchFile, $patch, $utf8NoBom)

try {
      RunPS '.\execution\apply_patch.ps1' @('-PatchFile', $patchFile)
    }
    catch {
      Err 'Patch application failed. Reverting; PRD not marked.'
      git reset --hard | Out-Host
      RunPS '.\execution\progress_append.ps1' @('-Message','FAILED: patch application failed; reverted; PRD not marked.')
      break
    }

    if (-not $Fast) {
      try {
        RunPS '.\execution\run_quality_gate.ps1'
      } catch {
        Err 'Quality gate failed. Reverting patch; PRD not marked.'
        git reset --hard | Out-Host
        RunPS '.\execution\progress_append.ps1' @('-Message','FAILED: quality gate failed; reverted; PRD not marked.')
        break
      }
    }

    RunPS '.\execution\prd_mark_done.ps1'
    RunPS '.\execution\progress_append.ps1' @('-Message',"Completed: $next")

    Ok 'Iteration complete.'
    $iter++
    Start-Sleep -Seconds 1
  }
}
finally {
  AutoStash-Pop $stashState
}
