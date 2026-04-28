# PowerShell script to install Anchor CLI on Windows
# Run this script in PowerShell as Administrator

Write-Host "=== Installing Anchor CLI for Windows ===" -ForegroundColor Green
Write-Host ""

# Check if Visual Studio Build Tools are installed
Write-Host "Checking for Visual Studio Build Tools..." -ForegroundColor Yellow
$vsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"

if (Test-Path $vsWhere) {
    Write-Host "Visual Studio tools found!" -ForegroundColor Green
} else {
    Write-Host "Visual Studio Build Tools not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to install Visual Studio Build Tools first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://visualstudio.microsoft.com/downloads/" -ForegroundColor Cyan
    Write-Host "2. Scroll down to 'All Downloads' -> 'Tools for Visual Studio'" -ForegroundColor Cyan
    Write-Host "3. Download 'Build Tools for Visual Studio 2022'" -ForegroundColor Cyan
    Write-Host "4. Run the installer and select 'Desktop development with C++'" -ForegroundColor Cyan
    Write-Host ""

    $response = Read-Host "Do you want to open the download page now? (y/n)"
    if ($response -eq 'y') {
        Start-Process "https://visualstudio.microsoft.com/downloads/"
    }

    Write-Host ""
    Write-Host "After installing Build Tools, run this script again." -ForegroundColor Yellow
    exit 1
}

# Install Anchor using cargo
Write-Host ""
Write-Host "Installing Anchor CLI (this may take several minutes)..." -ForegroundColor Yellow
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "AVM installed successfully!" -ForegroundColor Green

    # Install Anchor version 0.32.1
    Write-Host "Installing Anchor CLI v0.32.1..." -ForegroundColor Yellow
    avm install 0.32.1
    avm use 0.32.1

    Write-Host ""
    Write-Host "Anchor CLI installed successfully!" -ForegroundColor Green
    Write-Host "Version:" -ForegroundColor Cyan
    anchor --version
} else {
    Write-Host ""
    Write-Host "Failed to install Anchor CLI" -ForegroundColor Red
    Write-Host "Please ensure Visual Studio Build Tools are properly installed" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Installation complete! You can now use 'anchor' commands." -ForegroundColor Green
Write-Host "Try: anchor --version" -ForegroundColor Cyan
