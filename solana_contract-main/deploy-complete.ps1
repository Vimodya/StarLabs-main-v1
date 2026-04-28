# Complete Solana Smart Contract Deployment Script
# Run this in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SOLANA SMART CONTRACT DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment PATH
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:USERPROFILE\solana-release\bin;$env:PATH"

# Navigate to project
Set-Location "D:\Advantage Group Australasia\solana_contract"

# STEP 1: Verify installations
Write-Host "[1/9] Verifying installations..." -ForegroundColor Green
try {
    $rustVersion = rustc --version
    $solanaVersion = solana --version
    Write-Host "  ✓ Rust: $rustVersion" -ForegroundColor Gray
    Write-Host "  ✓ Solana: $solanaVersion" -ForegroundColor Gray
} catch {
    Write-Host "  ✗ ERROR: Required tools not found. Please check installation." -ForegroundColor Red
    exit 1
}

# STEP 2: Check/Create Wallet
Write-Host ""
Write-Host "[2/9] Setting up wallet..." -ForegroundColor Green

if (Test-Path "owner-keypair.json") {
    $walletAddress = solana address -k owner-keypair.json
    Write-Host "  ✓ Using existing wallet: $walletAddress" -ForegroundColor Gray
} else {
    Write-Host "  Creating new wallet..." -ForegroundColor Yellow
    solana-keygen new -o owner-keypair.json --no-bip39-passphrase
    $walletAddress = solana address -k owner-keypair.json
    Write-Host "  ✓ New wallet created: $walletAddress" -ForegroundColor Gray
    Write-Host "  ⚠ IMPORTANT: Save your seed phrase!" -ForegroundColor Yellow
}

# STEP 3: Configure Solana
Write-Host ""
Write-Host "[3/9] Configuring Solana..." -ForegroundColor Green
solana config set --url devnet | Out-Null
solana config set --keypair owner-keypair.json | Out-Null
Write-Host "  ✓ Network: devnet" -ForegroundColor Gray
Write-Host "  ✓ Wallet: owner-keypair.json" -ForegroundColor Gray

# STEP 4: Check and Fund Wallet
Write-Host ""
Write-Host "[4/9] Checking wallet balance..." -ForegroundColor Green
$balance = solana balance --keypair owner-keypair.json
Write-Host "  Current balance: $balance" -ForegroundColor Gray

$balanceValue = [decimal]($balance -replace " SOL", "")
if ($balanceValue -lt 3) {
    Write-Host "  ⚠ Insufficient balance. Requesting airdrops..." -ForegroundColor Yellow
    Write-Host "  Requesting 2 SOL (attempt 1)..." -ForegroundColor Gray
    solana airdrop 2 --keypair owner-keypair.json
    Start-Sleep -Seconds 5

    Write-Host "  Requesting 2 SOL (attempt 2)..." -ForegroundColor Gray
    solana airdrop 2 --keypair owner-keypair.json
    Start-Sleep -Seconds 5

    Write-Host "  Requesting 2 SOL (attempt 3)..." -ForegroundColor Gray
    solana airdrop 2 --keypair owner-keypair.json
    Start-Sleep -Seconds 5

    $newBalance = solana balance --keypair owner-keypair.json
    Write-Host "  ✓ New balance: $newBalance" -ForegroundColor Gray

    $newBalanceValue = [decimal]($newBalance -replace " SOL", "")
    if ($newBalanceValue -lt 3) {
        Write-Host ""
        Write-Host "  ✗ ERROR: Still insufficient balance ($newBalance)" -ForegroundColor Red
        Write-Host "  Please get devnet SOL from: https://faucet.solana.com/" -ForegroundColor Yellow
        Write-Host "  Your wallet address: $walletAddress" -ForegroundColor Cyan
        exit 1
    }
} else {
    Write-Host "  ✓ Sufficient balance for deployment" -ForegroundColor Gray
}

# STEP 5: Generate Program Keypair
Write-Host ""
Write-Host "[5/9] Setting up program keypair..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path ".\target\deploy" | Out-Null

if (Test-Path ".\target\deploy\metah2o_ico_contract-keypair.json") {
    Write-Host "  ⚠ Program keypair already exists" -ForegroundColor Yellow
    $programId = solana address -k .\target\deploy\metah2o_ico_contract-keypair.json
    Write-Host "  Program ID: $programId" -ForegroundColor Cyan

    $response = Read-Host "  Use existing program ID? (y/n)"
    if ($response -ne "y") {
        Write-Host "  Creating new program keypair..." -ForegroundColor Yellow
        Remove-Item ".\target\deploy\metah2o_ico_contract-keypair.json" -Force
        solana-keygen new -o .\target\deploy\metah2o_ico_contract-keypair.json --no-bip39-passphrase
        $programId = solana address -k .\target\deploy\metah2o_ico_contract-keypair.json
        Write-Host ""
        Write-Host "  ⚠ NEW PROGRAM ID: $programId" -ForegroundColor Yellow
        Write-Host "  ⚠ You MUST update this in:" -ForegroundColor Yellow
        Write-Host "    1. programs/metah2o_ico_contract/src/lib.rs (line 5)" -ForegroundColor Yellow
        Write-Host "    2. Anchor.toml (lines 9 & 12)" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "  Press Enter after updating the files"
    }
} else {
    solana-keygen new -o .\target\deploy\metah2o_ico_contract-keypair.json --no-bip39-passphrase
    $programId = solana address -k .\target\deploy\metah2o_ico_contract-keypair.json
    Write-Host ""
    Write-Host "  ⚠ NEW PROGRAM ID: $programId" -ForegroundColor Yellow
    Write-Host "  ⚠ You MUST update this in:" -ForegroundColor Yellow
    Write-Host "    1. programs/metah2o_ico_contract/src/lib.rs (line 5)" -ForegroundColor Yellow
    Write-Host "    2. Anchor.toml (lines 9 & 12)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  Press Enter after updating the files"
}

# STEP 6: Verify Program ID in Code
Write-Host ""
Write-Host "[6/9] Verifying program ID in code..." -ForegroundColor Green
$libRsContent = Get-Content ".\programs\metah2o_ico_contract\src\lib.rs" -Raw
if ($libRsContent -match 'declare_id!\("([^"]+)"\)') {
    $codesProgramId = $matches[1]
    Write-Host "  Program ID in code: $codesProgramId" -ForegroundColor Gray
    Write-Host "  Program ID in keypair: $programId" -ForegroundColor Gray

    if ($codesProgramId -eq $programId) {
        Write-Host "  ✓ Program IDs match!" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ ERROR: Program IDs do not match!" -ForegroundColor Red
        Write-Host "  Please update lib.rs and Anchor.toml with: $programId" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  ⚠ Could not verify program ID in code" -ForegroundColor Yellow
}

# STEP 7: Build the Contract
Write-Host ""
Write-Host "[7/9] Building smart contract..." -ForegroundColor Green
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

$buildOutput = cargo build-sbf 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build successful!" -ForegroundColor Gray

    if (Test-Path ".\target\deploy\metah2o_ico_contract.so") {
        $fileSize = (Get-Item ".\target\deploy\metah2o_ico_contract.so").Length / 1KB
        Write-Host "  ✓ Program file: metah2o_ico_contract.so ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ✗ Build failed!" -ForegroundColor Red
    Write-Host $buildOutput
    exit 1
}

# STEP 8: Deploy to Devnet
Write-Host ""
Write-Host "[8/9] Deploying to devnet..." -ForegroundColor Green
Write-Host "  This will cost ~2-4 SOL..." -ForegroundColor Gray

$deployOutput = solana program deploy .\target\deploy\metah2o_ico_contract.so --keypair owner-keypair.json --program-id .\target\deploy\metah2o_ico_contract-keypair.json 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Program ID: $programId" -ForegroundColor Cyan
    Write-Host "Network: Devnet" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "  ✗ Deployment failed!" -ForegroundColor Red
    Write-Host $deployOutput
    exit 1
}

# STEP 9: Verify Deployment
Write-Host "[9/9] Verifying deployment..." -ForegroundColor Green
solana program show $programId

$finalBalance = solana balance --keypair owner-keypair.json
Write-Host ""
Write-Host "Remaining balance: $finalBalance" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Initialize the contract:" -ForegroundColor White
Write-Host "   yarn install" -ForegroundColor Gray
Write-Host "   npx ts-node scripts/initialize-contract.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Initialize the vault:" -ForegroundColor White
Write-Host "   npx ts-node scripts/initialize-vault.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the swap:" -ForegroundColor White
Write-Host "   npx ts-node scripts/test-swap.ts" -ForegroundColor Gray
Write-Host ""
