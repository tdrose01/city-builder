# Workspace Verification Script
# Run this to verify you're in the correct directory

Write-Host "`n=== City Slacker Workspace Verification ===" -ForegroundColor Cyan
Write-Host ""

# Check current directory
$currentDir = Get-Location
Write-Host "Current Directory: $currentDir" -ForegroundColor Yellow

# Expected directory pattern
if ($currentDir -match "city-slacker\\city-slacker") {
    Write-Host "❌ ERROR: You are in the WRONG directory!" -ForegroundColor Red
    Write-Host "   You are in the Unity project folder (archived)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Please navigate to parent directory:" -ForegroundColor Yellow
    Write-Host "   cd .." -ForegroundColor Green
    Write-Host ""
    exit 1
}

# Check for required files
$requiredFiles = @(
    "CURRENT_PHASE.md",
    "README.md",
    "STATUS.md",
    ".cursorrules",
    "city-slacker.code-workspace"
)

$requiredDirs = @(
    "web",
    "conductor"
)

Write-Host "Checking required files..." -ForegroundColor Cyan
$allFilesFound = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (missing)" -ForegroundColor Red
        $allFilesFound = $false
    }
}

Write-Host ""
Write-Host "Checking required directories..." -ForegroundColor Cyan
$allDirsFound = $true
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir -PathType Container) {
        Write-Host "  ✓ $dir/" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $dir/ (missing)" -ForegroundColor Red
        $allDirsFound = $false
    }
}

Write-Host ""

if ($allFilesFound -and $allDirsFound) {
    Write-Host "✅ SUCCESS: You are in the correct directory!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Project Root: $currentDir" -ForegroundColor Cyan
    Write-Host "Active Development: $currentDir\web" -ForegroundColor Cyan
    Write-Host "Current Phase: Phase 5 - Content Polish & Enhancement" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Read CURRENT_PHASE.md for context" -ForegroundColor White
    Write-Host "  2. Navigate to web/ directory: cd web" -ForegroundColor White
    Write-Host "  3. Install dependencies: npm install" -ForegroundColor White
    Write-Host "  4. Start dev server: npm run dev" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "❌ ERROR: Missing required files or directories!" -ForegroundColor Red
    Write-Host ""
    Write-Host "You may be in the wrong location. Please:" -ForegroundColor Yellow
    Write-Host "  1. Navigate to the project root (C:\city-slacker\)" -ForegroundColor White
    Write-Host "  2. Or open the workspace file: city-slacker.code-workspace" -ForegroundColor White
    Write-Host "  3. Read HOW_TO_OPEN_PROJECT.md for detailed instructions" -ForegroundColor White
    Write-Host ""
    exit 1
}
