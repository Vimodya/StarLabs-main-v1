# Add Solana and Cargo to Windows System PATH Permanently
# Run this in PowerShell as Administrator

Write-Host "Adding Solana and Rust to System PATH..." -ForegroundColor Green

$solanaPath = "$env:USERPROFILE\solana-release\bin"
$cargoPath = "$env:USERPROFILE\.cargo\bin"

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Add Solana if not already there
if ($currentPath -notlike "*$solanaPath*") {
    $newPath = "$currentPath;$solanaPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added Solana to PATH: $solanaPath" -ForegroundColor Green
} else {
    Write-Host "Solana already in PATH" -ForegroundColor Yellow
}

# Add Cargo if not already there
if ($currentPath -notlike "*$cargoPath*") {
    $newPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $newPath = "$newPath;$cargoPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added Cargo to PATH: $cargoPath" -ForegroundColor Green
} else {
    Write-Host "Cargo already in PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PATH updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Close and reopen your terminal for changes to take effect" -ForegroundColor Yellow
Write-Host ""
Write-Host "After reopening, verify with:" -ForegroundColor Cyan
Write-Host "  solana --version" -ForegroundColor Gray
Write-Host "  cargo --version" -ForegroundColor Gray
