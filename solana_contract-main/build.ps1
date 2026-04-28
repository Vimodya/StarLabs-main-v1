# Build script for Solana program
# Run this in PowerShell as Administrator

Write-Host "=== Building MetaH2O ICO Contract ===" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Cyan
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Cyan
    Write-Host "3. Navigate to this directory: cd 'D:\Advantage Group Australasia\solana_contract'" -ForegroundColor Cyan
    Write-Host "4. Run: .\build.ps1" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "Building Solana program..." -ForegroundColor Yellow
Write-Host ""

cargo build-sbf

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Generated files:" -ForegroundColor Cyan
    Get-ChildItem -Path ".\target\deploy" -File | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "You can now run the swap script:" -ForegroundColor Yellow
    Write-Host "  npx ts-node scripts/test-swap.ts" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Build failed!" -ForegroundColor Red
    Write-Host "Check the errors above." -ForegroundColor Yellow
    exit 1
}
