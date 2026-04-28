# Solana Contract Deployment Script
# Run this in PowerShell as Administrator

# Set environment
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:USERPROFILE\solana-release\bin;$env:PATH"

# Navigate to project
Set-Location "D:\Advantage Group Australasia\solana_contract"

# Configure Solana for devnet
Write-Host "Configuring Solana for devnet..." -ForegroundColor Green
solana config set --url devnet

# Check wallet
Write-Host "`nChecking wallet..." -ForegroundColor Green
solana balance

# Build the contract
Write-Host "`nBuilding contract..." -ForegroundColor Green
cargo build-sbf

# Deploy
Write-Host "`nDeploying to devnet..." -ForegroundColor Green
solana program deploy .\target\deploy\metah2o_ico_contract.so

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Program ID: FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP" -ForegroundColor Cyan
