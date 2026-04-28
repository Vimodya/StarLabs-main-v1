# Import Existing Wallet to owner-keypair.json
# Run this in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IMPORT EXISTING WALLET" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd "D:\Advantage Group Australasia\solana_contract"

# Backup existing keypair
if (Test-Path "owner-keypair.json") {
    Copy-Item owner-keypair.json owner-keypair.json.backup
    Write-Host "✓ Backed up existing keypair to owner-keypair.json.backup" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Choose import method:" -ForegroundColor Yellow
Write-Host "1. Import from seed phrase (12 or 24 words)" -ForegroundColor White
Write-Host "2. Import from private key array [123,45,67,...]" -ForegroundColor White
Write-Host "3. Copy from another keypair file" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1, 2, or 3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Starting seed phrase recovery..." -ForegroundColor Green
    Write-Host "You'll be prompted to enter your seed phrase." -ForegroundColor Gray
    Write-Host ""

    $env:PATH = "$env:USERPROFILE\solana-release\bin;$env:USERPROFILE\.cargo\bin;$env:PATH"
    solana-keygen recover -o owner-keypair.json --force

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Wallet imported successfully!" -ForegroundColor Green
        $address = solana address -k owner-keypair.json
        Write-Host "Wallet address: $address" -ForegroundColor Cyan
    }

} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Enter your private key as a JSON array:" -ForegroundColor Yellow
    Write-Host "Example: [123,45,67,89,...]" -ForegroundColor Gray
    Write-Host ""

    $privateKey = Read-Host "Paste private key array"

    # Validate it's a valid JSON array
    try {
        $keyArray = $privateKey | ConvertFrom-Json
        if ($keyArray.Count -eq 64) {
            $privateKey | Out-File -FilePath "owner-keypair.json" -Encoding ASCII -NoNewline
            Write-Host ""
            Write-Host "✓ Wallet imported successfully!" -ForegroundColor Green

            $env:PATH = "$env:USERPROFILE\solana-release\bin;$env:USERPROFILE\.cargo\bin;$env:PATH"
            $address = solana address -k owner-keypair.json
            Write-Host "Wallet address: $address" -ForegroundColor Cyan
        } else {
            Write-Host "✗ ERROR: Private key must be exactly 64 bytes" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ ERROR: Invalid JSON format" -ForegroundColor Red
    }

} elseif ($choice -eq "3") {
    Write-Host ""
    $sourcePath = Read-Host "Enter full path to your keypair file"

    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath owner-keypair.json -Force
        Write-Host ""
        Write-Host "✓ Wallet imported successfully!" -ForegroundColor Green

        $env:PATH = "$env:USERPROFILE\solana-release\bin;$env:USERPROFILE\.cargo\bin;$env:PATH"
        $address = solana address -k owner-keypair.json
        Write-Host "Wallet address: $address" -ForegroundColor Cyan
    } else {
        Write-Host "✗ ERROR: File not found: $sourcePath" -ForegroundColor Red
    }

} else {
    Write-Host "✗ Invalid choice" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Fund your wallet: solana airdrop 2" -ForegroundColor White
Write-Host "2. Deploy contract: .\deploy-complete.ps1" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
