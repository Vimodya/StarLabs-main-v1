# Devnet Deployment Guide

## Step 1: Build the Program (REQUIRES ADMIN)

⚠️ **IMPORTANT:** You must run your terminal as Administrator on Windows!

1. Close your current terminal
2. Right-click on Command Prompt/PowerShell/Windows Terminal
3. Select "Run as Administrator"
4. Navigate to the project:
   ```bash
   cd "D:\Solana Devnet Smart COntracts\my_solana_contract"
   ```

5. Build the program:
   ```bash
   anchor build
   ```

   This will take a few minutes. You should see:
   ```
   Finished release [optimized] target(s)
   ```

## Step 2: Get Your Wallet Address

```bash
solana address
```

Save this address - this is your deployer wallet.

## Step 3: Get Devnet SOL (Airdrop)

You need ~2-3 SOL for deployment and initialization.

```bash
solana airdrop 2
```

If that fails, try:
```bash
solana airdrop 1
```

Check your balance:
```bash
solana balance
```

## Step 4: Deploy the Program

```bash
anchor deploy
```

**SAVE THE PROGRAM ID!** It will look like:
```
Program Id: CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL
```

## Step 5: Verify Deployment

```bash
solana program show CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL
```

## Step 6: Initialize Contract (After Deployment)

After deployment succeeds, let me know and I'll help you:
1. Initialize the contract state
2. Create the token vault
3. Fund the vault with META tokens
4. Test the first swap

---

## What You Need Ready

- ✅ Devnet META Token Mint: `MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s`
- ✅ Owner Wallet: `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`
- ✅ Contract built and ready
- ⏳ Program deployed to devnet
- ⏳ Contract initialized
- ⏳ Vault created and funded

---

## Troubleshooting

### Build fails with "privilege not held"
- You MUST run terminal as Administrator on Windows

### Airdrop fails
- Devnet can be rate-limited
- Try again in a few minutes
- Or use: https://faucet.solana.com/

### Deployment fails with "insufficient funds"
- Get more SOL: `solana airdrop 2`
- Check balance: `solana balance`

---

## After Successful Deployment

Once you've completed Steps 1-5, **message me with**:
1. The Program ID (should match: `CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL`)
2. Your wallet address
3. Any error messages if something failed

I'll then help you initialize and test the contract!
