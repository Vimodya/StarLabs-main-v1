# Solana Smart Contract - Complete Deployment Guide

## Project Overview

**Contract Name:** MetaH2O ICO Contract
**Network:** Solana Devnet
**Current Program ID:** `FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP`
**Token Mint:** `MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s`
**Owner Wallet:** `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Automated)](#quick-start-automated)
3. [Manual Deployment](#manual-deployment)
4. [Post-Deployment Setup](#post-deployment-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Important Files Reference](#important-files-reference)

---

## Prerequisites

### Required Tools
- Rust (v1.89.0+)
- Cargo (v1.89.0+)
- Solana CLI (v2.1.13+)
- Anchor CLI (v0.32.1+)
- Node.js & Yarn
- PowerShell (Windows)

### Verify Installation

```powershell
# Check Rust
rustc --version
cargo --version

# Check Solana
solana --version

# Check Anchor
anchor --version

# Check Node.js & Yarn
node --version
yarn --version
```

### Environment Setup

Run this in every new PowerShell session:

```powershell
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:USERPROFILE\solana-release\bin;$env:PATH"
```

Or add to PATH permanently using:

```powershell
.\add-to-path.ps1
```

---

## Quick Start (Automated)

The easiest way to deploy is using the automated script:

```powershell
# Run PowerShell as Administrator
.\deploy-complete.ps1
```

This script will:
1. Verify all installations
2. Set up your wallet
3. Fund wallet with devnet SOL
4. Generate program keypair
5. Build the smart contract
6. Deploy to devnet
7. Verify deployment

**Then skip to [Post-Deployment Setup](#post-deployment-setup)**

---

## Manual Deployment

### Step 1: Configure Environment

```powershell
# Navigate to project directory
cd "D:\Advantage Group Australasia\solana_contract"

# Set up PATH
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:USERPROFILE\solana-release\bin;$env:PATH"
```

### Step 2: Set Up Wallet

#### Option A: Use Existing Wallet

```powershell
# Check existing wallet
solana address -k owner-keypair.json
```

#### Option B: Create New Wallet

```powershell
# Generate new keypair
solana-keygen new -o owner-keypair.json --no-bip39-passphrase

# IMPORTANT: Save the seed phrase shown!
```

### Step 3: Configure Solana CLI

```powershell
# Set network to devnet
solana config set --url devnet

# Set your wallet as default
solana config set --keypair owner-keypair.json

# Verify configuration
solana config get

# Get your wallet address
solana address
```

### Step 4: Fund Your Wallet

You need approximately 5-6 SOL for deployment.

```powershell
# Request airdrops (2 SOL per request)
solana airdrop 2
solana airdrop 2
solana airdrop 2

# Check balance
solana balance
```

**Alternative:** If airdrops fail, use the web faucet:
- Visit: https://faucet.solana.com/
- Paste your wallet address (from `solana address`)
- Request devnet SOL

### Step 5: Generate Program Keypair

```powershell
# Create deploy directory
New-Item -ItemType Directory -Force -Path ".\target\deploy"

# Generate program keypair
solana-keygen new -o .\target\deploy\metah2o_ico_contract-keypair.json --no-bip39-passphrase

# Get the program ID
solana address -k .\target\deploy\metah2o_ico_contract-keypair.json
```

**CRITICAL:** Copy this Program ID! You'll need it in the next step.

### Step 6: Update Program ID in Code

The Program ID must match in 3 locations:

#### File 1: `programs/metah2o_ico_contract/src/lib.rs` (Line 5)

```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

#### File 2: `Anchor.toml` (Line 9)

```toml
[programs.localnet]
metah2o_ico_contract = "YOUR_PROGRAM_ID_HERE"
```

#### File 3: `Anchor.toml` (Line 12)

```toml
[programs.devnet]
metah2o_ico_contract = "YOUR_PROGRAM_ID_HERE"
```

Replace `YOUR_PROGRAM_ID_HERE` with the Program ID from Step 5.

### Step 7: Build the Smart Contract

```powershell
# Build using Solana BPF
cargo build-sbf

# Verify build output
dir .\target\deploy\metah2o_ico_contract.so
```

You should see:
- `metah2o_ico_contract.so` (compiled program)
- `metah2o_ico_contract-keypair.json` (program keypair)

### Step 8: Deploy to Devnet

```powershell
# Deploy the program
solana program deploy .\target\deploy\metah2o_ico_contract.so --keypair owner-keypair.json --program-id .\target\deploy\metah2o_ico_contract-keypair.json

# Check remaining balance
solana balance
```

**Expected Output:**
```
Program Id: YOUR_PROGRAM_ID
```

Deployment typically costs 2-4 SOL.

---

## Post-Deployment Setup

After successful deployment, initialize the contract:

### Step 1: Install Dependencies

```powershell
yarn install
```

### Step 2: Initialize Contract State

```powershell
npx ts-node scripts/initialize-contract.ts
```

Or using Anchor:

```powershell
anchor run initialize
```

### Step 3: Initialize Token Vault

```powershell
npx ts-node scripts/initialize-vault.ts
```

Or using Anchor:

```powershell
anchor run initialize-vault
```

### Step 4: Test the Contract (Optional)

```powershell
npx ts-node scripts/test-swap.ts
```

Or using Anchor:

```powershell
anchor run test-swap
```

---

## Verification

### Verify Deployment

```powershell
solana program show YOUR_PROGRAM_ID
```

**Expected Output:**
```
Program Id: YOUR_PROGRAM_ID
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: ...
Authority: YOUR_WALLET_ADDRESS
Last Deployed In Slot: ...
Data Length: ... bytes
Balance: ... SOL
```

### View on Solana Explorer

Visit: `https://explorer.solana.com/address/YOUR_PROGRAM_ID?cluster=devnet`

### Check Contract Accounts

```powershell
# View program accounts
solana program show YOUR_PROGRAM_ID --programs
```

---

## Troubleshooting

### Error: "Insufficient funds"

**Solution:**
```powershell
# Request more SOL
solana airdrop 2

# Or use web faucet
# https://faucet.solana.com/
```

### Error: "Program already exists"

Your program is already deployed.

**Solution:**
```powershell
# Upgrade instead of deploy
solana program upgrade .\target\deploy\metah2o_ico_contract.so --keypair owner-keypair.json --program-id YOUR_PROGRAM_ID
```

### Error: "Failed to install platform-tools"

**Solution:**
- Run PowerShell as Administrator
- Restart PowerShell
- Try again

### Build Fails with Linking Errors

**Solution:**
- Install Visual Studio C++ Build Tools
- Run as Administrator
- Try `cargo clean` then rebuild

### Airdrop Fails / Rate Limited

**Solutions:**
1. Try smaller amount: `solana airdrop 1`
2. Wait a few minutes and retry
3. Use web faucet: https://faucet.solana.com/

### Program ID Mismatch

**Solution:**
Verify Program ID matches in all 3 locations:
1. `programs/metah2o_ico_contract/src/lib.rs` (line 5)
2. `Anchor.toml` (line 9)
3. `Anchor.toml` (line 12)

### Permission Denied / Privilege Error

**Solution:**
- Close PowerShell
- Right-click PowerShell
- Select "Run as Administrator"
- Try again

---

## Important Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `Anchor.toml` | Anchor configuration, contains Program ID |
| `Cargo.toml` | Rust package configuration |
| `rust-toolchain.toml` | Rust toolchain version |
| `package.json` | Node.js dependencies |

### Keypair Files

| File | Purpose |
|------|---------|
| `owner-keypair.json` | Your wallet (pays for deployment) |
| `target/deploy/metah2o_ico_contract-keypair.json` | Program keypair (contract address) |

### Compiled Output

| File | Purpose |
|------|---------|
| `target/deploy/metah2o_ico_contract.so` | Compiled smart contract (deployed to blockchain) |

### Source Code

| File | Purpose |
|------|---------|
| `programs/metah2o_ico_contract/src/lib.rs` | Smart contract source code |
| `programs/metah2o_ico_contract/Cargo.toml` | Program package configuration |

### Scripts

| Script | Purpose |
|--------|---------|
| `deploy-complete.ps1` | Automated deployment script |
| `deploy.ps1` | Simple deployment script |
| `install-anchor.ps1` | Install Anchor CLI |
| `add-to-path.ps1` | Add tools to PATH |
| `run-swap.ps1` | Test swap functionality |
| `scripts/initialize-contract.ts` | Initialize contract state |
| `scripts/initialize-vault.ts` | Initialize token vault |
| `scripts/test-swap.ts` | Test swap function |

---

## Quick Reference Commands

```powershell
# Check wallet address
solana address

# Check balance
solana balance

# Check program info
solana program show PROGRAM_ID

# Get more devnet SOL
solana airdrop 2

# View config
solana config get

# Build contract
cargo build-sbf

# Deploy contract
solana program deploy .\target\deploy\metah2o_ico_contract.so

# Upgrade existing program
solana program upgrade .\target\deploy\metah2o_ico_contract.so --program-id PROGRAM_ID

# Run tests
anchor test

# Initialize contract
anchor run initialize

# Test swap
anchor run test-swap
```

---

## Contract Specifications

### Exchange Rate
- **Rate:** 0.001 SOL = 1 TOKEN
- **In Lamports:** 1,000,000 lamports = 1 TOKEN

### Token Details
- **Token Mint:** `MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s`
- **Token Name:** META
- **Network:** Solana Devnet

### Owner Details
- **Owner Wallet:** `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`
- **Role:** Contract administrator

---

## Network Information

**Devnet RPC URLs:**
- `https://api.devnet.solana.com`
- `https://devnet.helius-rpc.com` (alternative)

**Devnet Explorer:**
- Solana Explorer: `https://explorer.solana.com/?cluster=devnet`
- Solscan: `https://solscan.io/?cluster=devnet`

**Devnet Faucet:**
- Official: `https://faucet.solana.com/`

---

## Deployment Checklist

- [ ] Rust, Cargo, Solana, Anchor installed
- [ ] PowerShell running as Administrator
- [ ] Wallet created/imported (owner-keypair.json)
- [ ] Solana configured for devnet
- [ ] Wallet funded with 5+ SOL
- [ ] Program keypair generated
- [ ] Program ID updated in code (3 locations)
- [ ] Contract built successfully (cargo build-sbf)
- [ ] Contract deployed to devnet
- [ ] Deployment verified (solana program show)
- [ ] Dependencies installed (yarn install)
- [ ] Contract initialized
- [ ] Vault initialized
- [ ] Swap tested

---

## Support & Resources

### Documentation
- Solana Docs: https://docs.solana.com/
- Anchor Docs: https://www.anchor-lang.com/
- Rust Book: https://doc.rust-lang.org/book/

### Tools
- Solana Explorer: https://explorer.solana.com/
- Solscan: https://solscan.io/
- Devnet Faucet: https://faucet.solana.com/

### Project Documentation
- `README.md` - Project overview
- `DOCUMENTATION.md` - Complete documentation
- `ADMIN_GUIDE.md` - Admin operations
- `QUICK_REFERENCE.md` - Quick reference guide

---

## Next Steps After Deployment

1. **Test the Contract**
   - Run test swap transaction
   - Verify token exchange works correctly
   - Check vault balance

2. **Fund the Vault**
   - Transfer META tokens to vault
   - Ensure sufficient liquidity

3. **Monitor the Contract**
   - Check transaction logs
   - Monitor vault balance
   - Track swap activity

4. **Deploy to Mainnet** (when ready)
   - Follow same steps but use mainnet
   - Requires real SOL for deployment
   - Thoroughly test on devnet first

---

**Last Updated:** 2026-01-04
**Anchor Version:** 0.32.1
**Solana Version:** 2.1.13
