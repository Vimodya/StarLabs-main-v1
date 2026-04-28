# Quick script to run the swap test without needing Anchor CLI
# This uses npx ts-node directly

Write-Host "=== MetaH2O ICO - Buy MH2O Tokens ===" -ForegroundColor Green
Write-Host ""
Write-Host "Running swap script..." -ForegroundColor Yellow
Write-Host ""

npx ts-node scripts/test-swap.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Script completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Script failed. Check the errors above." -ForegroundColor Red
}
