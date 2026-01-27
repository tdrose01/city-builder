<#
.SYNOPSIS
  Applies SQL-first Postgres migrations from db\migrations on Windows.

.USAGE
  powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-DbMigrations.ps1
  .\scripts\Invoke-DbMigrations.ps1 -DryRun

.NOTES
  Loads .env from repo root if present.
#>

[CmdletBinding()]
param(
  [string] = (Join-Path C:\ '..\db\migrations'),
  [string] = (Resolve-Path (Join-Path C:\ '..')).Path,
  [string] = '',
  [string]System.Management.Automation.Internal.Host.InternalHost = ,
  [int] = [int]( ?  : 5432),
  [string] = ,
  [string] = ,
  [string] = ,
  [switch],
  [switch]
)

Stop = 'Stop'

function Load-DotEnv {
  param([string])
  if (-not (Test-Path )) { return }
  Get-Content  | ForEach-Object {
     = .Trim()
    if (-not  -or .StartsWith('#')) { return }
     = .IndexOf('=')
    if ( -lt 1) { return }
     = .Substring(0,).Trim()
     = .Substring(+1).Trim()
    if () { Set-Item -Path "Env:" -Value  }
  }
}

function Find-Psql {
  param([string])
  if ( -and (Test-Path )) { return (Resolve-Path ).Path }
   = Get-Command psql.exe -ErrorAction SilentlyContinue
  if () { return .Source }

   = @(
    'C:\Program Files\PostgreSQL\17\bin\psql.exe',
    'C:\Program Files\PostgreSQL\16\bin\psql.exe',
    'C:\Program Files\PostgreSQL\15\bin\psql.exe',
    'C:\Program Files\PostgreSQL\14\bin\psql.exe',
    'C:\Program Files\PostgreSQL\13\bin\psql.exe'
  )
  foreach ( in ) { if (Test-Path ) { return  } }
  throw 'psql.exe not found. Install PostgreSQL client tools or pass -PsqlPath.'
}

function Get-Checksum {
  param([string])
  return (Get-FileHash -Algorithm SHA256 -Path ).Hash.ToLower()
}

function Require-Param {
  param([string], [string])
  if ([string]::IsNullOrWhiteSpace()) {
    throw "Missing required connection value: . Set it in .env (repo root) or env vars (PGHOST/PGDATABASE/PGUSER/PGPASSWORD) or pass parameter."
  }
}

# Load .env from repo root (if present)
Load-DotEnv -Path (Join-Path  '.env')

# Refresh variables after dotenv load
System.Management.Automation.Internal.Host.InternalHost = 
 = 
 = 
 = 
if () {  = [int] }

 = Find-Psql -Explicit 

Require-Param -Name 'Host' -Value System.Management.Automation.Internal.Host.InternalHost
Require-Param -Name 'Database' -Value 
Require-Param -Name 'User' -Value 
Require-Param -Name 'Password' -Value 

if (-not (Test-Path )) { throw "MigrationsDir not found: " }

Write-Host "== Postgres SQL Migrations ==" -ForegroundColor Cyan
Write-Host "psql: "
Write-Host "dir : "
Write-Host "db  : System.Management.Automation.Internal.Host.InternalHost:/ as "
if () { Write-Host "mode: DRY RUN (no changes applied)" -ForegroundColor Yellow }

 = 

# Ensure schema_migrations exists
 = @'
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version     text PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now(),
  checksum    text NOT NULL,
  filename    text NOT NULL
);
'@

&  -h System.Management.Automation.Internal.Host.InternalHost -p  -U  -d  -v ON_ERROR_STOP=1 -q -c  | Out-Null

# Get applied versions
 = &  -h System.Management.Automation.Internal.Host.InternalHost -p  -U  -d  -t -A -v ON_ERROR_STOP=1 -c "SELECT version FROM public.schema_migrations ORDER BY version;"
 = @{}
foreach ( in ( -split "
")) {
   = .Trim()
  if () { [] = True }
}

# Collect migration files (NNN_*.sql)
 = Get-ChildItem -Path  -Filter "*.sql" | Sort-Object Name
if (-not ) { Write-Host "No migrations found." -ForegroundColor Yellow; exit 0 }

 = @()
foreach ( in ) {
   = [System.IO.Path]::GetFileNameWithoutExtension(.Name)
   = [regex]::Match(, '^(?<ver>\d+)_')
   = if (.Success) { .Groups['ver'].Value } else {  }
  if (-not .ContainsKey()) {
     += [pscustomobject]@{
      Version  = 
      File     = .FullName
      Name     = .Name
      Checksum = (Get-Checksum .FullName)
    }
  }
}

if (-not ) {
  Write-Host "All migrations already applied." -ForegroundColor Green
  exit 0
}

Write-Host "Pending migrations:" -ForegroundColor Cyan
 | ForEach-Object { Write-Host ("  {0}  {1}" -f .Version, .Name) }

if () { exit 0 }

foreach ( in ) {
  Write-Host ("Applying {0}  {1}" -f .Version, .Name) -ForegroundColor Cyan
  if () {
    &  -h System.Management.Automation.Internal.Host.InternalHost -p  -U  -d  -v ON_ERROR_STOP=1 -f .File
  } else {
    &  -h System.Management.Automation.Internal.Host.InternalHost -p  -U  -d  -v ON_ERROR_STOP=1 -q -f .File
  }

   = "INSERT INTO public.schema_migrations(version, checksum, filename) VALUES ('', '', '');"
  &  -h System.Management.Automation.Internal.Host.InternalHost -p  -U  -d  -v ON_ERROR_STOP=1 -q -c  | Out-Null

  Write-Host ("Applied {0}" -f .Version) -ForegroundColor Green
}

Write-Host "Done." -ForegroundColor Green