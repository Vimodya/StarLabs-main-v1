# Complete Solana Smart Contract Deployment Guide

## Prerequisites Check
Run these commands in PowerShell as Administrator:

```powershell
# Add to PATH (run this in every new terminal session)
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:USERPROFILE\solana-release\bin;$env:PATH"

# Verify installations
rustc --version
cargo --version
solana --version
```

---

## STEP 1: Set Up Your Wallet

### Option A: Use Existing Wallet (owner-keypair.json)
Your project already has `owner-keypair.json`. Check if it's valid:

```powershell
cd "D:\Advantage Group Australasia\solana_contract"
solana address -k owner-keypair.json
```

### Option B: Create a New Wallet
If you want a new wallet:

```powershell
cd "D:\Advantage Group Australasia\solana_contract"
solana-keygen new -o owner-keypair.json --no-bip39-passphrase
```

**IMPORTANT:** Save the seed phrase shown! You'll need it to recover your wallet.

---

## STEP 2: Configure Solana to Use Your Wallet

```powershell
cd "D:\Advantage Group Australasia\solana_contract"

# Set devnet
solana config set --url devnet

# Set your wallet as default
solana config set --keypair owner-keypair.json

# Verify configuration
solana config get

# Check your wallet address
solana address
```

---

## STEP 3: Fund Your Wallet with Devnet SOL

You need SOL to pay for deployment (around 3-5 SOL for deployment + transaction fees).

```powershell
# Request airdrop (2 SOL at a time, max)
solana airdrop 2

# Check balance
solana balance

# Request more if needed (do this 2-3 times to get ~5 SOL)
solana airdrop 2
solana airdrop 2

# Verify you have enough SOL (should show ~5-6 SOL)
solana balance
```

**If airdrop fails:**
- Use web faucet: https://faucet.solana.com/
- Paste your wallet address (from `solana address`)
- Request devnet SOL

---

## STEP 4: Generate Program Keypair (Smart Contract Address)

Your contract needs its own address (keypair):

```powershell
cd "D:\Advantage Group Australasia\solana_contract"

# Create target/deploy directory if it doesn't exist
New-Item -ItemType Directory -Force -Path ".\target\deploy"

# Generate program keypair
solana-keygen new -o .\target\deploy\metah2o_ico_contract-keypair.json --no-bip39-passphrase

# Get the program ID (this is your smart contract address)
solana address -k .\target\deploy\metah2o_ico_contract-keypair.json
```

**CRITICAL:** Copy the program ID that's displayed!

---

## STEP 5: Update Program ID in Code

The program ID must match in 3 places:

### File 1: `programs/metah2o_ico_contract/src/lib.rs` (Line 5)
```rust
declare_id!("YOUR_NEW_PROGRAM_ID_HERE");
```

### File 2: `Anchor.toml` (Lines 9 & 12)
```toml
[programs.localnet]
metah2o_ico_contract = "YOUR_NEW_PROGRAM_ID_HERE"

[programs.devnet]
metah2o_ico_contract = "YOUR_NEW_PROGRAM_ID_HERE"
```

**Replace `YOUR_NEW_PROGRAM_ID_HERE` with the program ID from Step 4**

---

## STEP 6: Build the Smart Contract

```powershell
cd "D:\Advantage Group Australasia\solana_contract"

# Build using Solana's BPF compiler
cargo build-sbf

# Verify the build succeeded
dir .\target\deploy\metah2o_ico_contract.so
```

You should see:
- `metah2o_ico_contract.so` (the compiled program)
- `metah2o_ico_contract-keypair.json` (the program's keypair)

---

## STEP 7: Deploy to Devnet

```powershell
cd "D:\Advantage Group Australasia\solana_contract"

# Deploy the program
solana program deploy .\target\deploy\metah2o_ico_contract.so --keypair owner-keypair.json --program-id .\target\deploy\metah2o_ico_contract-keypair.json

# Verify deployment
solana program show YOUR_PROGRAM_ID_HERE
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

---

## STEP 8: Check Remaining Balance

```powershell
solana balance
```

Deployment typically costs 2-4 SOL. You should have remaining balance.

---

## STEP 9: Initialize the Contract (After Deployment)

After successful deployment, you need to initialize the contract:

```powershell
# If you have the scripts set up
cd "D:\Advantage Group Australasia\solana_contract"
yarn install
npx ts-node scripts/initialize-contract.ts
npx ts-node scripts/initialize-vault.ts
```

---

## Quick Reference Commands

```powershell
# Check wallet address
solana address

# Check balance
solana balance

# Check program info
solana program show YOUR_PROGRAM_ID

# Get more devnet SOL
solana airdrop 2

# View config
solana config get
```

---

## Troubleshooting

### Error: "Insufficient funds"
- Run `solana airdrop 2` multiple times
- Or use https://faucet.solana.com/

### Error: "Program already exists"
- Your program is already deployed
- Use `solana program upgrade` instead of `deploy`

### Error: "Failed to install platform-tools"
- Make sure you're running PowerShell as Administrator
- Restart PowerShell and try again

### Build fails with linking errors
- Ensure you have Visual Studio C++ Build Tools installed
- Or the build must run with administrator privileges

---

## Summary of Key Files

- `owner-keypair.json` - Your wallet (pays for deployment)
- `target/deploy/metah2o_ico_contract-keypair.json` - Program keypair (contract address)
- `target/deploy/metah2o_ico_contract.so` - Compiled program (to deploy)
- `programs/metah2o_ico_contract/src/lib.rs` - Source code (contains program ID)
- `Anchor.toml` - Config file (contains program ID)

---

## Important Addresses in Your Contract

From your code:
- **Token Mint**: `MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s`
- **Owner Wallet**: `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`

Make sure the owner wallet address matches your actual wallet if needed!
