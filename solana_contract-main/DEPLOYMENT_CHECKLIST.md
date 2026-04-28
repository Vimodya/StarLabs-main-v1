# Solana Smart Contract Deployment Checklist

## Pre-Deployment Setup

- [ ] Open PowerShell as Administrator
- [ ] Set PATH: `$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:USERPROFILE\solana-release\bin;$env:PATH"`
- [ ] Navigate to project: `cd "D:\Advantage Group Australasia\solana_contract"`
- [ ] Verify Rust installed: `rustc --version` ✓
- [ ] Verify Solana installed: `solana --version` ✓

## Wallet Setup

- [ ] Configure devnet: `solana config set --url devnet`
- [ ] Set keypair: `solana config set --keypair owner-keypair.json`
- [ ] Get wallet address: `solana address -k owner-keypair.json`
- [ ] Check balance: `solana balance`
- [ ] Fund wallet (5-6 SOL): `solana airdrop 2` (run 3 times)
- [ ] Verify balance is sufficient (>3 SOL)

## Program Setup

- [ ] Create deploy directory: `New-Item -ItemType Directory -Force -Path ".\target\deploy"`
- [ ] Generate program keypair: `solana-keygen new -o .\target\deploy\metah2o_ico_contract-keypair.json --no-bip39-passphrase`
- [ ] Get Program ID: `solana address -k .\target\deploy\metah2o_ico_contract-keypair.json`
- [ ] **COPY THE PROGRAM ID:** _________________________________

## Update Code with Program ID

- [ ] Update `programs/metah2o_ico_contract/src/lib.rs` line 5:
  ```rust
  declare_id!("YOUR_PROGRAM_ID_HERE");
  ```

- [ ] Update `Anchor.toml` line 9:
  ```toml
  metah2o_ico_contract = "YOUR_PROGRAM_ID_HERE"
  ```

- [ ] Update `Anchor.toml` line 12:
  ```toml
  metah2o_ico_contract = "YOUR_PROGRAM_ID_HERE"
  ```

- [ ] Save all files

## Build & Deploy

- [ ] Build contract: `cargo build-sbf`
- [ ] Verify build output exists: `dir .\target\deploy\metah2o_ico_contract.so`
- [ ] Deploy: `solana program deploy .\target\deploy\metah2o_ico_contract.so --keypair owner-keypair.json --program-id .\target\deploy\metah2o_ico_contract-keypair.json`
- [ ] Verify deployment: `solana program show YOUR_PROGRAM_ID`
- [ ] Check remaining balance: `solana balance`

## Post-Deployment Initialization

- [ ] Install dependencies: `yarn install`
- [ ] Initialize contract: `npx ts-node scripts/initialize-contract.ts`
- [ ] Initialize vault: `npx ts-node scripts/initialize-vault.ts`
- [ ] Test swap (optional): `npx ts-node scripts/test-swap.ts`

## Verification

- [ ] Program deployed successfully
- [ ] Program ID matches in all files
- [ ] Contract initialized
- [ ] Vault initialized
- [ ] Ready for use!

---

## Quick Info

**Wallet Address:** ___________________________________________

**Program ID:** ___________________________________________

**Network:** Devnet

**RPC URL:** https://api.devnet.solana.com

**Explorer:** https://explorer.solana.com/?cluster=devnet

**Balance After Deployment:** _____________ SOL

---

## Troubleshooting

### ⚠ Airdrop Fails
- Try: `solana airdrop 1` (smaller amount)
- Use web faucet: https://faucet.solana.com/

### ⚠ Build Fails
- Ensure running as Administrator
- Try: `cargo clean` then rebuild

### ⚠ Deployment Fails
- Check balance: `solana balance`
- Verify Program ID matches in code
- Check network: `solana config get`

### ⚠ Permission Error
- Run PowerShell as Administrator
- Check file permissions

---

## Alternative: Automated Deployment

Instead of manual steps, run:

```powershell
.\deploy-complete.ps1
```

This automated script will:
1. Check prerequisites
2. Set up wallet
3. Fund wallet (with airdrops)
4. Generate program keypair
5. Prompt you to update code
6. Build contract
7. Deploy to devnet
8. Verify deployment

**Much easier!** 🚀
