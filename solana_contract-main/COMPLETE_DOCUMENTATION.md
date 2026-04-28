# MetaH2O ICO Contract - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Deployed Addresses](#deployed-addresses)
3. [Contract Functions](#contract-functions)
4. [Setup Instructions](#setup-instructions)
5. [Integration Guide](#integration-guide)
6. [Testing Guide](#testing-guide)
7. [Security Features](#security-features)
8. [Error Codes](#error-codes)

---

## 🎯 Overview

The MetaH2O ICO Contract is a Solana-based token swap program that allows users to purchase META tokens using SOL at a fixed exchange rate.

**Key Features:**
- Fixed exchange rate: **0.001 SOL = 1 META token**
- Direct payment to owner wallet (no withdrawal needed)
- Automatic ATA creation for users
- Pause/unpause functionality
- Maximum swap limit: 100 SOL per transaction
- Comprehensive security validations

**Network:** Solana Devnet
**Framework:** Anchor v0.32.1
**Language:** Rust (Solana Programs)

---

## 🔑 Deployed Addresses

### Program Information
```
Program ID: FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP
IDL Account: CEcJoEb8E6XJcT88whUcDU8EoL8Amobdbe5VHeMWmDQ5
Network: https://api.devnet.solana.com
Cluster: Devnet
```

### Token Information
```
META Token Mint: MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s
Token Decimals: 9
Token Symbol: META
```

### Owner Information
```
Owner Wallet: CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK
Purpose: Receives SOL payments from swaps
Access: Admin functions (pause, unpause, initialize vault)
```

### Program Derived Addresses (PDAs)

#### Contract State PDA
```
Seeds: ["state"]
Purpose: Stores contract configuration (pause status)
Derivation: PublicKey.findProgramAddressSync([Buffer.from("state")], programId)
```

#### Token Vault PDA
```
Seeds: ["token_vault"]
Purpose: Holds META tokens for distribution
Type: Associated Token Account
Authority: Vault Authority PDA
Derivation: PublicKey.findProgramAddressSync([Buffer.from("token_vault")], programId)
```

#### Vault Authority PDA
```
Seeds: ["vault_authority"]
Purpose: Controls the token vault (can transfer tokens)
Type: Signer PDA
Derivation: PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], programId)
```

---

## 📚 Contract Functions

### 1. `initialize`

**Description:** Initializes the contract state. Must be called once before any swaps can occur.

**Access:** Anyone (first caller only)

**Parameters:** None

**Accounts Required:**
```javascript
{
  state: {
    // PDA derived from ["state"]
    seeds: ["state"],
    writable: true,
    signer: false
  },
  payer: {
    // Account that pays for state creation
    writable: true,
    signer: true
  },
  systemProgram: SystemProgram.programId
}
```

**TypeScript Example:**
```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

const program = anchor.workspace.Metah2oIcoContract as Program;

const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")],
  program.programId
);

await program.methods
  .initialize()
  .accounts({
    state: statePDA,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

**What It Does:**
- Creates the contract state account
- Sets `is_paused` to `false`
- Emits log: "Token swap contract initialized"

**Cost:** ~0.001 SOL (rent for state account)

---

### 2. `initialize_vault`

**Description:** Creates the token vault that will hold META tokens for distribution.

**Access:** Owner only (`CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`)

**Parameters:** None

**Accounts Required:**
```javascript
{
  vault: {
    // Token vault PDA
    seeds: ["token_vault"],
    writable: true,
    signer: false
  },
  vaultAuthority: {
    // Vault authority PDA
    seeds: ["vault_authority"],
    writable: false,
    signer: false
  },
  tokenMint: {
    // META token mint
    address: "MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s",
    writable: false,
    signer: false
  },
  payer: {
    // Must be owner wallet
    address: "CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK",
    writable: true,
    signer: true
  },
  tokenProgram: TOKEN_PROGRAM_ID,
  systemProgram: SystemProgram.programId
}
```

**TypeScript Example:**
```typescript
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")],
  program.programId
);

const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault_authority")],
  program.programId
);

const tokenMint = new PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");
const ownerWallet = new PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

await program.methods
  .initializeVault()
  .accounts({
    vault: vaultPDA,
    vaultAuthority: vaultAuthorityPDA,
    tokenMint: tokenMint,
    payer: ownerWallet,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([ownerKeypair]) // Owner must sign
  .rpc();
```

**What It Does:**
- Creates a token account (vault) owned by the vault authority PDA
- The vault will hold META tokens for distribution
- Emits log: "Token vault initialized with authority PDA"

**Cost:** ~0.002 SOL (rent for token account)

**After This:** You must transfer META tokens to the vault address

---

### 3. `swap_sol_for_tokens`

**Description:** Swaps SOL for META tokens at the fixed rate of 0.001 SOL = 1 META.

**Access:** Anyone (public function)

**Parameters:**
```rust
sol_amount: u64  // Amount of SOL to swap (in lamports)
```

**Exchange Rate Calculation:**
```
1 SOL = 1,000,000,000 lamports
0.001 SOL = 1,000,000 lamports = 1 META token (with 9 decimals)

Token Amount = (SOL Amount in lamports) × 1000

Example:
- Send 10 SOL (10,000,000,000 lamports)
- Receive 10,000 META tokens (10,000,000,000,000 smallest units)
```

**Accounts Required:**
```javascript
{
  state: {
    // Contract state PDA
    seeds: ["state"],
    writable: false,
    signer: false
  },
  user: {
    // User making the swap
    writable: true,
    signer: true
  },
  userTokenAccount: {
    // User's META token account (auto-created if needed)
    writable: true,
    signer: false
  },
  tokenMint: {
    // META token mint
    address: "MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s",
    writable: false,
    signer: false
  },
  ownerWallet: {
    // Owner wallet that receives SOL
    address: "CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK",
    writable: true,
    signer: false
  },
  contractTokenVault: {
    // Contract's token vault
    seeds: ["token_vault"],
    writable: true,
    signer: false
  },
  tokenVaultAuthority: {
    // Vault authority PDA
    seeds: ["vault_authority"],
    writable: false,
    signer: false
  },
  tokenProgram: TOKEN_PROGRAM_ID,
  associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  systemProgram: SystemProgram.programId
}
```

**TypeScript Example:**
```typescript
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync
} from "@solana/spl-token";

const program = anchor.workspace.Metah2oIcoContract as Program;

// Amount of SOL to swap (e.g., 1 SOL = 1,000,000,000 lamports)
const solAmount = new anchor.BN(1_000_000_000); // 1 SOL

// Derive PDAs
const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")],
  program.programId
);

const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")],
  program.programId
);

const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault_authority")],
  program.programId
);

// Get user's META token account address
const tokenMint = new PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");
const userTokenAccount = getAssociatedTokenAddressSync(
  tokenMint,
  userWallet.publicKey
);

const ownerWallet = new PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

// Execute swap
const tx = await program.methods
  .swapSolForTokens(solAmount)
  .accounts({
    state: statePDA,
    user: userWallet.publicKey,
    userTokenAccount: userTokenAccount,
    tokenMint: tokenMint,
    ownerWallet: ownerWallet,
    contractTokenVault: vaultPDA,
    tokenVaultAuthority: vaultAuthorityPDA,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();

console.log("Swap successful! Transaction:", tx);
```

**What It Does:**
1. Validates contract is not paused
2. Validates sol_amount > 0 and ≤ 100 SOL
3. Calculates token amount: `token_amount = sol_amount × 1000`
4. Checks vault has sufficient tokens
5. Validates user will maintain rent exemption after transfer
6. Transfers SOL from user to owner wallet
7. Transfers META tokens from vault to user (creates ATA if needed)
8. Emits SwapEvent with transaction details

**Events Emitted:**
```rust
SwapEvent {
  user: Pubkey,           // User who made the swap
  sol_amount: u64,        // SOL sent (in lamports)
  token_amount: u64,      // Tokens received
  timestamp: i64,         // Unix timestamp
}
```

**Validations:**
- Contract must not be paused
- sol_amount must be > 0
- sol_amount must be ≤ 100 SOL (100,000,000,000 lamports)
- Vault must have sufficient tokens
- User must maintain rent exemption after swap
- Token mint must match META token
- Owner wallet must match hardcoded address

**Cost:**
- SOL amount you're swapping
- ~0.002 SOL for ATA creation (if user doesn't have META account yet)
- ~0.00001 SOL transaction fee

---

### 4. `pause`

**Description:** Pauses all swap functionality. Emergency stop mechanism.

**Access:** Owner only (`CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`)

**Parameters:** None

**Accounts Required:**
```javascript
{
  state: {
    seeds: ["state"],
    writable: true,
    signer: false
  },
  admin: {
    address: "CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK",
    writable: false,
    signer: true
  }
}
```

**TypeScript Example:**
```typescript
const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")],
  program.programId
);

const ownerWallet = new PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

await program.methods
  .pause()
  .accounts({
    state: statePDA,
    admin: ownerWallet,
  })
  .signers([ownerKeypair])
  .rpc();
```

**What It Does:**
- Sets `state.is_paused = true`
- Blocks all future swap transactions
- Emits log: "Contract paused"

**Cost:** ~0.00001 SOL (transaction fee)

---

### 5. `unpause`

**Description:** Resumes swap functionality after being paused.

**Access:** Owner only (`CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`)

**Parameters:** None

**Accounts Required:** Same as `pause`

**TypeScript Example:**
```typescript
await program.methods
  .unpause()
  .accounts({
    state: statePDA,
    admin: ownerWallet,
  })
  .signers([ownerKeypair])
  .rpc();
```

**What It Does:**
- Sets `state.is_paused = false`
- Allows swap transactions to proceed
- Emits log: "Contract unpaused"

**Cost:** ~0.00001 SOL (transaction fee)

---

## 🚀 Setup Instructions

### Prerequisites
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Install Node.js and Yarn
# (Visit nodejs.org and yarnpkg.com)
```

### Step 1: Connect to Devnet
```bash
solana config set --url https://api.devnet.solana.com
solana config get
```

### Step 2: Initialize Contract State

**Option A: Using Anchor Test**
```typescript
// In tests/integration.ts
it("Initialize contract", async () => {
  const [statePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("state")],
    program.programId
  );

  await program.methods
    .initialize()
    .accounts({
      state: statePDA,
      payer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Contract initialized!");
});
```

**Option B: Using CLI Script**
```bash
# Create a script file: scripts/initialize.ts
ts-node scripts/initialize.ts
```

### Step 3: Initialize Token Vault

**IMPORTANT:** This must be done by the owner wallet

```typescript
// Switch to owner wallet
const ownerKeypair = Keypair.fromSecretKey(
  Uint8Array.from(require("./owner-keypair.json"))
);

const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")],
  program.programId
);

const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault_authority")],
  program.programId
);

const tokenMint = new PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");

await program.methods
  .initializeVault()
  .accounts({
    vault: vaultPDA,
    vaultAuthority: vaultAuthorityPDA,
    tokenMint: tokenMint,
    payer: ownerKeypair.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([ownerKeypair])
  .rpc();

console.log("Vault initialized at:", vaultPDA.toBase58());
```

### Step 4: Fund the Vault with META Tokens

```typescript
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com");
const tokenMint = new PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");

// Amount to fund (e.g., 1,000,000 META tokens)
const amount = 1_000_000 * 1e9; // Convert to smallest units

// Get owner's token account
const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  ownerKeypair,
  tokenMint,
  ownerKeypair.publicKey
);

// Get vault address
const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")],
  program.programId
);

// Transfer tokens to vault
await transfer(
  connection,
  ownerKeypair,
  ownerTokenAccount.address,
  vaultPDA,
  ownerKeypair.publicKey,
  amount
);

console.log(`Funded vault with ${amount / 1e9} META tokens`);
```

### Step 5: Verify Setup

```typescript
// Check vault balance
const vaultAccount = await getAccount(connection, vaultPDA);
console.log("Vault balance:", vaultAccount.amount.toString());

// Check contract state
const stateAccount = await program.account.contractState.fetch(statePDA);
console.log("Is paused:", stateAccount.isPaused);
```

---

## 🔗 Integration Guide

### Frontend Integration (React + Wallet Adapter)

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

function SwapComponent() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const swapSolForTokens = async (solAmount: number) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    const programId = new web3.PublicKey("FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP");
    const program = new Program(IDL, programId, provider);

    // Convert SOL to lamports
    const lamports = new BN(solAmount * web3.LAMPORTS_PER_SOL);

    // Derive PDAs
    const [statePDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      programId
    );

    const [vaultPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault")],
      programId
    );

    const [vaultAuthorityPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_authority")],
      programId
    );

    const tokenMint = new web3.PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");
    const ownerWallet = new web3.PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

    // Get user's token account
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
    );

    // Execute swap
    const tx = await program.methods
      .swapSolForTokens(lamports)
      .accounts({
        state: statePDA,
        user: wallet.publicKey,
        userTokenAccount,
        tokenMint,
        ownerWallet,
        contractTokenVault: vaultPDA,
        tokenVaultAuthority: vaultAuthorityPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);
    return tx;
  };

  return (
    <button onClick={() => swapSolForTokens(1)}>
      Swap 1 SOL for 1000 META
    </button>
  );
}
```

### Listening to Swap Events

```typescript
// Subscribe to swap events
const subscriptionId = program.addEventListener("SwapEvent", (event, slot) => {
  console.log("Swap detected!");
  console.log("User:", event.user.toBase58());
  console.log("SOL Amount:", event.solAmount.toNumber() / 1e9, "SOL");
  console.log("Token Amount:", event.tokenAmount.toNumber() / 1e9, "META");
  console.log("Timestamp:", new Date(event.timestamp * 1000));
});

// Unsubscribe when done
program.removeEventListener(subscriptionId);
```

### Backend Integration (Node.js)

```typescript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import fs from 'fs';

// Load wallet
const keypairData = JSON.parse(fs.readFileSync('./keypair.json', 'utf-8'));
const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
const wallet = new Wallet(keypair);

// Setup connection
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

// Load program
const programId = new PublicKey("FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP");
const program = new Program(IDL, programId, provider);

// Example: Get vault balance
async function getVaultBalance() {
  const [vaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault")],
    programId
  );

  const vaultAccount = await connection.getTokenAccountBalance(vaultPDA);
  console.log("Vault balance:", vaultAccount.value.uiAmount, "META");
  return vaultAccount.value.uiAmount;
}

// Example: Monitor swaps
async function monitorSwaps() {
  const [statePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("state")],
    programId
  );

  program.addEventListener("SwapEvent", (event) => {
    // Log to database, send notifications, etc.
    console.log("New swap:", {
      user: event.user.toBase58(),
      solAmount: event.solAmount.toNumber(),
      tokenAmount: event.tokenAmount.toNumber(),
      timestamp: event.timestamp,
    });
  });
}
```

---

## 🧪 Testing Guide

### Unit Tests

Create `tests/metah2o-ico.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Metah2oIcoContract } from "../target/types/metah2o_ico_contract";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("metah2o_ico_contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Metah2oIcoContract as Program<Metah2oIcoContract>;

  const tokenMint = new anchor.web3.PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");
  const ownerWallet = new anchor.web3.PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

  let statePDA: anchor.web3.PublicKey;
  let vaultPDA: anchor.web3.PublicKey;
  let vaultAuthorityPDA: anchor.web3.PublicKey;

  before(async () => {
    [statePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      program.programId
    );

    [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault")],
      program.programId
    );

    [vaultAuthorityPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_authority")],
      program.programId
    );
  });

  it("Initializes the contract", async () => {
    await program.methods
      .initialize()
      .accounts({
        state: statePDA,
        payer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const state = await program.account.contractState.fetch(statePDA);
    assert.equal(state.isPaused, false);
  });

  it("Swaps SOL for tokens", async () => {
    const user = provider.wallet.publicKey;
    const solAmount = new anchor.BN(10_000_000); // 0.01 SOL

    const userTokenAccount = getAssociatedTokenAddressSync(tokenMint, user);

    const tx = await program.methods
      .swapSolForTokens(solAmount)
      .accounts({
        state: statePDA,
        user,
        userTokenAccount,
        tokenMint,
        ownerWallet,
        contractTokenVault: vaultPDA,
        tokenVaultAuthority: vaultAuthorityPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Swap transaction:", tx);

    // Verify user received tokens
    const userAccount = await getAccount(provider.connection, userTokenAccount);
    const expectedTokens = solAmount.toNumber() * 1000;
    assert.ok(userAccount.amount >= expectedTokens);
  });

  it("Pauses and unpauses contract (owner only)", async () => {
    // This test would need owner keypair
    // For testing, you'd sign with owner wallet
  });

  it("Rejects swap when paused", async () => {
    // First pause, then try swap, expect error
  });

  it("Validates maximum swap amount", async () => {
    const tooLarge = new anchor.BN(200_000_000_000); // 200 SOL

    try {
      await program.methods.swapSolForTokens(tooLarge).rpc();
      assert.fail("Should have rejected large swap");
    } catch (err) {
      assert.ok(err.toString().includes("SwapAmountTooLarge"));
    }
  });
});
```

Run tests:
```bash
anchor test
```

---

## 🔒 Security Features

### 1. **Access Control**
- Owner-only functions validated via hardcoded `OWNER_WALLET` constant
- No dynamic owner changes possible
- PDA-based vault authority (cannot be compromised)

### 2. **Input Validation**
- Zero amount rejection
- Maximum swap limit (100 SOL)
- Overflow protection via `checked_mul`
- Rent exemption validation

### 3. **Token Security**
- Hardcoded token mint address
- Vault ownership validation
- Authority validation for all transfers

### 4. **Economic Protection**
- Fixed exchange rate (no manipulation)
- Vault balance checks
- User balance validation
- Direct owner payments (no intermediate accounts)

### 5. **Pause Mechanism**
- Emergency stop capability
- Owner-controlled activation
- No funds at risk during pause

### 6. **Atomicity**
- All operations are atomic (all-or-nothing)
- SOL transfer + token transfer in single transaction
- No partial state changes possible

---

## ⚠️ Error Codes

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Amount must be greater than zero")]
    InvalidAmount = 6000,

    #[msg("Calculation overflow occurred")]
    CalculationOverflow = 6001,

    #[msg("Invalid owner wallet address")]
    InvalidOwnerWallet = 6002,

    #[msg("Invalid token mint - must be META token")]
    InvalidTokenMint = 6003,

    #[msg("Insufficient tokens in vault")]
    InsufficientTokens = 6004,

    #[msg("Insufficient user funds (need SOL for swap + ATA rent + fees)")]
    InsufficientUserFunds = 6005,

    #[msg("Contract is paused")]
    ContractPaused = 6006,

    #[msg("Unauthorized: Only owner can perform this action")]
    Unauthorized = 6007,

    #[msg("Invalid vault authority - vault must be owned by authority PDA")]
    InvalidVaultAuthority = 6008,

    #[msg("User balance would fall below rent exemption")]
    BelowRentExemption = 6009,

    #[msg("Swap amount exceeds maximum allowed (100 SOL per transaction)")]
    SwapAmountTooLarge = 6010,
}
```

**Error Handling Example:**
```typescript
try {
  await program.methods.swapSolForTokens(amount).rpc();
} catch (err) {
  if (err.message.includes("6006")) {
    console.error("Contract is paused");
  } else if (err.message.includes("6010")) {
    console.error("Amount too large, max 100 SOL");
  } else if (err.message.includes("6004")) {
    console.error("Vault out of tokens");
  } else {
    console.error("Unknown error:", err);
  }
}
```

---

## 📊 Cost Breakdown

### One-Time Setup Costs (Paid by Owner)
- Initialize contract state: ~0.001 SOL
- Initialize vault: ~0.002 SOL
- **Total:** ~0.003 SOL

### Per-Swap Costs (Paid by User)
- SOL amount being swapped: Variable
- ATA creation (first time only): ~0.002 SOL
- Transaction fee: ~0.00001 SOL
- **Total:** SOL amount + ~0.002 SOL (first swap) or ~0.00001 SOL (subsequent)

### Admin Costs
- Pause/Unpause: ~0.00001 SOL per operation

---

## 🌐 Solana Explorer Links

View your deployed contract:
- **Program:** https://explorer.solana.com/address/FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP?cluster=devnet
- **Token Mint:** https://explorer.solana.com/address/MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s?cluster=devnet
- **Owner Wallet:** https://explorer.solana.com/address/CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK?cluster=devnet

---

## 📞 Support & Resources

- **GitHub Issues:** Report bugs or request features
- **Solana Docs:** https://docs.solana.com
- **Anchor Docs:** https://www.anchor-lang.com
- **SPL Token Docs:** https://spl.solana.com/token

---

## 📝 License

MIT License - See LICENSE file for details

---

**Last Updated:** December 16, 2025
**Contract Version:** 0.1.0
**Network:** Solana Devnet
