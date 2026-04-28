# Deployment Scripts

This folder contains scripts to initialize and manage the MetaH2O ICO Contract.

## Prerequisites

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Build the program:**
   ```bash
   anchor build
   ```

3. **Deploy to devnet:**
   ```bash
   anchor deploy
   ```

4. **Ensure you have SOL:**
   ```bash
   solana balance
   # If needed: solana airdrop 1
   ```

## Scripts

### 1. Initialize Contract State

**File:** `initialize-contract.ts`

**Purpose:** Creates the contract state account (must be done once before any swaps)

**Usage:**
```bash
npm run initialize
# or
yarn initialize
# or
ts-node scripts/initialize-contract.ts
```

**What it does:**
- Loads your Solana CLI wallet from `~/.config/solana/id.json`
- Derives the state PDA from seeds `["state"]`
- Calls the `initialize()` function
- Sets `is_paused = false`
- Verifies the state was created correctly

**Requirements:**
- Any wallet can run this (doesn't need to be owner)
- Needs ~0.001 SOL for rent
- Can only be run once (will detect if already initialized)

**Output:**
```
=== MetaH2O ICO Contract - Initialize State ===

✓ Connected to devnet
✓ Loaded wallet: JEJm2bvQcwaB17XUBAGgaMR6SQgRZvHWKg979JCDdev
✓ Wallet balance: 2.5 SOL
✓ Program ID: FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP
✓ Loaded IDL
✓ State PDA: <PDA_ADDRESS>
  Bump: <BUMP>
✓ State account not found (will create)

--- Initializing Contract State ---
✅ Contract state initialized successfully!
   Transaction signature: <TX_SIGNATURE>
   Explorer: https://explorer.solana.com/tx/<TX>?cluster=devnet

--- Contract State ---
   Address: <PDA_ADDRESS>
   Is paused: false

🎉 Initialization complete!
```

---

### 2. Initialize Vault (Coming Next)

**File:** `initialize-vault.ts` (to be created)

**Purpose:** Creates the token vault that will hold META tokens

**Requirements:**
- Must be signed by owner wallet: `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`
- Needs ~0.002 SOL for rent

---

### 3. Test Swap (Coming Next)

**File:** `test-swap.ts` (to be created)

**Purpose:** Tests the swap functionality with a small amount

**Requirements:**
- Vault must be initialized and funded
- Contract must not be paused
- User needs SOL for swap + fees

---

## Deployment Checklist

- [ ] **Step 1:** Build program (`anchor build`)
- [ ] **Step 2:** Deploy program (`anchor deploy`)
- [ ] **Step 3:** Run `initialize-contract.ts` ✓ You are here
- [ ] **Step 4:** Run `initialize-vault.ts` (owner only)
- [ ] **Step 5:** Fund vault with META tokens
- [ ] **Step 6:** Run `test-swap.ts` to verify

---

## Troubleshooting

### "Failed to load wallet"
Make sure your Solana CLI is configured:
```bash
solana config get
```

The script looks for your wallet at: `~/.config/solana/id.json` (Linux/Mac) or `%USERPROFILE%\.config\solana\id.json` (Windows)

### "Insufficient balance"
Get more devnet SOL:
```bash
solana airdrop 2
```

### "Failed to load IDL"
Make sure you've built the program:
```bash
anchor build
```

The IDL file should be at: `target/idl/metah2o_ico_contract.json`

### "Contract state already initialized"
This is fine! The state can only be initialized once. The script will detect this and exit gracefully.

---

## Manual Execution (Without Scripts)

If you prefer to use Anchor directly:

```typescript
import * as anchor from "@coral-xyz/anchor";

const program = anchor.workspace.Metah2oIcoContract;

const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")],
  program.programId
);

await program.methods
  .initialize()
  .accounts({
    state: statePDA,
    payer: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

---

## Next Steps

After running `initialize-contract.ts`, you need to:

1. **Initialize the vault** (owner only)
2. **Fund the vault** with META tokens
3. **Test a swap** to verify everything works

See `ADMIN_GUIDE.md` for detailed instructions.
