# META Token Swap Contract - Technical Documentation

## Table of Contents
1. [Contract Overview](#contract-overview)
2. [Architecture](#architecture)
3. [Program Specification](#program-specification)
4. [Account Schema](#account-schema)
5. [Instructions](#instructions)
6. [State Management](#state-management)
7. [Security Model](#security-model)
8. [Error Handling](#error-handling)
9. [Events & Logging](#events--logging)
10. [Integration Guide](#integration-guide)
11. [Deployment Guide](#deployment-guide)
12. [Testing & Validation](#testing--validation)

---

## Contract Overview

### Purpose
The META Token Swap Contract is a Solana program that facilitates the exchange of SOL for META tokens at a predetermined fixed rate. The program implements a secure, efficient, and user-friendly mechanism for token distribution.

### Contract Identifiers
```
Program ID:        CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL
Token Mint:        MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s
Owner Wallet:      CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK
Network:           Solana (Devnet/Mainnet)
Framework:         Anchor v0.32.1
Language:          Rust (Edition 2021)
```

### Economic Parameters
```
Exchange Rate:     0.001 SOL = 1 META token
Lamports per Token: 1,000,000 lamports
Token Decimals:    9
Minimum Swap:      > 0 lamports
Maximum Swap:      Limited by vault balance
```

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     SWAP TRANSACTION FLOW                    │
└─────────────────────────────────────────────────────────────┘

    User                Contract State         Token Vault
     │                         │                     │
     │  1. Check Pause         │                     │
     │ ───────────────────────>│                     │
     │                         │                     │
     │  2. Validate Balance    │                     │
     │ ───────────────────────>│                     │
     │                         │                     │
     │  3. Calculate Tokens    │                     │
     │ ───────────────────────>│                     │
     │                         │                     │
     │  4. Check Vault Balance │                     │
     │ ────────────────────────┼────────────────────>│
     │                         │                     │
     │  5. Transfer SOL        │                     │
     │ ──────────────────────> Owner Wallet          │
     │                         │                     │
     │  6. Transfer Tokens     │                     │
     │ <───────────────────────┼─────────────────────│
     │                         │                     │
     │  7. Emit Event          │                     │
     │ ───────────────────────>│                     │
     │                         │                     │
```

### Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      PROGRAM COMPONENTS                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  Instructions   │    │   State Store   │                │
│  ├─────────────────┤    ├─────────────────┤                │
│  │ - initialize    │───>│ - is_paused     │                │
│  │ - pause         │    │ - owner         │                │
│  │ - unpause       │    └─────────────────┘                │
│  │ - swap          │                                        │
│  └─────────────────┘                                        │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────────────────────────────┐                   │
│  │         Validation Layer            │                   │
│  ├─────────────────────────────────────┤                   │
│  │ - Pause Check                       │                   │
│  │ - Balance Validation                │                   │
│  │ - PDA Verification                  │                   │
│  │ - Authority Checks                  │                   │
│  └─────────────────────────────────────┘                   │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────────────────────────────┐                   │
│  │         Execution Layer             │                   │
│  ├─────────────────────────────────────┤                   │
│  │ - SOL Transfer (System Program)     │                   │
│  │ - Token Transfer (Token Program)    │                   │
│  │ - ATA Creation (ATA Program)        │                   │
│  │ - Event Emission                    │                   │
│  └─────────────────────────────────────┘                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Program Derived Addresses (PDAs)

The contract uses three critical PDAs for security and state management:

| PDA Name | Seeds | Purpose | Authority |
|----------|-------|---------|-----------|
| Contract State | `["state"]` | Stores pause state and owner | Program |
| Token Vault | `["token_vault"]` | Holds META tokens for distribution | Vault Authority PDA |
| Vault Authority | `["vault_authority"]` | Signs token transfers from vault | Program |

**PDA Derivation Example:**
```rust
// State PDA
let (state_pda, state_bump) = Pubkey::find_program_address(
    &[b"state"],
    &program_id
);

// Token Vault PDA
let (vault_pda, vault_bump) = Pubkey::find_program_address(
    &[b"token_vault"],
    &program_id
);

// Vault Authority PDA
let (authority_pda, authority_bump) = Pubkey::find_program_address(
    &[b"vault_authority"],
    &program_id
);
```

---

## Program Specification

### Module Structure

```rust
my_solana_contract/
├── src/
│   └── lib.rs              # Main program logic
├── Cargo.toml              # Rust dependencies
└── Anchor.toml             # Anchor configuration
```

### Dependencies

```toml
[dependencies]
anchor-lang = "0.32.1"      # Anchor framework
anchor-spl = "0.32.1"       # SPL token utilities
```

### Constants

```rust
// Hardcoded public keys (compile-time constants)
pub mod constants {
    pub const TOKEN_MINT: Pubkey =
        pubkey!("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");

    pub const OWNER_WALLET: Pubkey =
        pubkey!("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");
}

// Economic constants
const LAMPORTS_PER_TOKEN: u64 = 1_000_000;  // 0.001 SOL
```

---

## Account Schema

### 1. ContractState Account

**Type:** Program-owned account
**Seeds:** `["state"]`
**Size:** 41 bytes (8 byte discriminator + 1 byte bool + 32 byte Pubkey)

```rust
#[account]
#[derive(InitSpace)]
pub struct ContractState {
    pub is_paused: bool,    // 1 byte - Circuit breaker flag
    pub owner: Pubkey,      // 32 bytes - Owner's public key
}
```

**Storage Layout:**
```
┌────────────┬──────────┬───────────────────────┐
│ Bytes 0-7  │ Byte 8   │ Bytes 9-40            │
├────────────┼──────────┼───────────────────────┤
│ Anchor     │ is_paused│ owner (Pubkey)        │
│ Discrimin. │ (bool)   │                       │
└────────────┴──────────┴───────────────────────┘
```

**Initialization:**
- Must be initialized before first swap
- Owner set to `constants::OWNER_WALLET`
- Pause state defaults to `false`

### 2. Token Vault Account

**Type:** SPL Token Account (Associated Token Account)
**Seeds:** `["token_vault"]`
**Size:** 165 bytes (standard TokenAccount size)

```rust
pub struct TokenAccount {
    pub mint: Pubkey,              // Token mint address
    pub owner: Pubkey,             // Vault authority PDA
    pub amount: u64,               // Available tokens
    pub delegate: COption<Pubkey>, // None
    pub state: AccountState,       // Initialized
    pub is_native: COption<u64>,   // None
    pub delegated_amount: u64,     // 0
    pub close_authority: COption<Pubkey>, // None
}
```

**Constraints:**
- Mint must be META token mint
- Owner must be vault authority PDA
- Must maintain sufficient balance for swaps

### 3. User Token Account

**Type:** Associated Token Account
**Authority:** User's public key
**Creation:** Automatic via `init_if_needed`

**Rent Cost:** ~0.00203928 SOL (2,039,280 lamports)

---

## Instructions

### Instruction 1: `initialize`

**Purpose:** Initializes the contract state account.

**Access:** Public (one-time operation)

**Accounts:**
```rust
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + ContractState::INIT_SPACE,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, ContractState>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

**Parameters:** None

**Execution Flow:**
1. Validate state account doesn't exist
2. Allocate space for ContractState
3. Initialize `is_paused = false`
4. Set `owner = constants::OWNER_WALLET`
5. Emit initialization log

**Compute Units:** ~5,000 CU

**Transaction Example:**
```typescript
await program.methods
  .initialize()
  .accounts({
    state: statePDA,
    payer: payerKeypair.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([payerKeypair])
  .rpc();
```

---

### Instruction 2: `pause`

**Purpose:** Halts all swap operations.

**Access:** Owner only

**Accounts:**
```rust
pub struct AdminAction<'info> {
    #[account(
        mut,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, ContractState>,

    #[account(
        constraint = admin.key() == constants::OWNER_WALLET @ ErrorCode::Unauthorized
    )]
    pub admin: Signer<'info>,
}
```

**Parameters:** None

**Execution Flow:**
1. Validate caller is owner
2. Set `state.is_paused = true`
3. Emit pause log

**Use Cases:**
- Emergency situations
- Maintenance periods
- Security incidents
- Vault refilling operations

**Compute Units:** ~2,000 CU

---

### Instruction 3: `unpause`

**Purpose:** Resumes swap operations.

**Access:** Owner only

**Accounts:** Same as `pause`

**Parameters:** None

**Execution Flow:**
1. Validate caller is owner
2. Set `state.is_paused = false`
3. Emit unpause log

**Compute Units:** ~2,000 CU

---

### Instruction 4: `swap_sol_for_tokens`

**Purpose:** Exchanges SOL for META tokens.

**Access:** Public (when not paused)

**Accounts:**
```rust
pub struct SwapSolForTokens<'info> {
    #[account(seeds = [b"state"], bump)]
    pub state: Account<'info, ContractState>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        constraint = token_mint.key() == constants::TOKEN_MINT
            @ ErrorCode::InvalidTokenMint
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = owner_wallet.key() == constants::OWNER_WALLET
            @ ErrorCode::InvalidOwnerWallet
    )]
    pub owner_wallet: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"token_vault"],
        bump,
        constraint = contract_token_vault.mint == token_mint.key()
            @ ErrorCode::InvalidTokenMint
    )]
    pub contract_token_vault: Account<'info, TokenAccount>,

    #[account(seeds = [b"vault_authority"], bump)]
    pub token_vault_authority: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
```

**Parameters:**
- `sol_amount: u64` - Amount of lamports to swap

**Execution Flow:**

```
1. Pre-execution Validation
   ├─> Check contract not paused
   ├─> Validate sol_amount > 0
   ├─> Calculate required lamports (swap + ATA rent + fees)
   ├─> Verify user has sufficient balance
   └─> Calculate token amount (sol_amount × 1000)

2. Vault Validation
   └─> Verify vault has sufficient tokens

3. ATA Creation (if needed)
   ├─> Check if user_token_account exists
   ├─> If not: Create ATA
   │   ├─> Deduct rent from user (~0.002 SOL)
   │   └─> Initialize token account
   └─> Continue

4. SOL Transfer
   ├─> Create transfer instruction
   ├─> Transfer sol_amount from user to owner_wallet
   └─> Validate transfer success

5. Token Transfer
   ├─> Derive PDA signer seeds
   ├─> Create CPI context with signer
   ├─> Transfer tokens from vault to user
   └─> Validate transfer success

6. Event Emission
   ├─> Emit SwapEvent
   │   ├─> user: Pubkey
   │   ├─> sol_amount: u64
   │   ├─> token_amount: u64
   │   └─> timestamp: i64
   └─> Log swap details

7. Transaction Complete
   └─> Return Ok(())
```

**Compute Units:** ~35,000-50,000 CU (varies with ATA creation)

**Token Amount Calculation:**
```rust
// Rate: 1,000,000 lamports = 1 token (with 9 decimals)
// Token has 9 decimals, so 1 token = 1_000_000_000 base units
// Formula: token_amount = (sol_amount / 1_000_000) × 1_000_000_000
//        = sol_amount × 1000

let token_amount = sol_amount
    .checked_mul(1000)
    .ok_or(ErrorCode::CalculationOverflow)?;
```

**Example Calculations:**

| SOL Input | Lamports | Token Amount (base units) | Tokens (human) |
|-----------|----------|---------------------------|----------------|
| 0.001 SOL | 1,000,000 | 1,000,000,000 | 1 META |
| 0.01 SOL | 10,000,000 | 10,000,000,000 | 10 META |
| 1 SOL | 1,000,000,000 | 1,000,000,000,000 | 1,000 META |
| 10 SOL | 10,000,000,000 | 10,000,000,000,000 | 10,000 META |

---

## State Management

### State Transitions

```
┌──────────────────────────────────────────────────────────┐
│                   CONTRACT STATE MACHINE                  │
└──────────────────────────────────────────────────────────┘

                    [Uninitialized]
                          │
                          │ initialize()
                          ▼
              ┌────────────────────┐
              │  Active (Unpaused) │◄──────┐
              └────────────────────┘       │
                  │              ▲         │
          pause() │              │ unpause()
                  ▼              │         │
              ┌────────────────────┐       │
              │   Paused           │───────┘
              └────────────────────┘

States:
- Uninitialized: Contract not yet initialized
- Active: Swaps enabled, normal operation
- Paused: Swaps disabled, admin access only
```

### State Persistence

**On-chain Storage:**
- Contract state stored in PDA account
- Persists across transactions
- Survives program upgrades (if PDA seeds unchanged)

**State Queries:**
```typescript
// Check if contract is paused
const state = await program.account.contractState.fetch(statePDA);
console.log("Is Paused:", state.isPaused);
console.log("Owner:", state.owner.toString());
```

---

## Security Model

### Authentication & Authorization

#### Owner Authentication
```rust
// Compile-time constant validation
#[account(
    constraint = admin.key() == constants::OWNER_WALLET @ ErrorCode::Unauthorized
)]
pub admin: Signer<'info>,
```

**Security Properties:**
- Owner public key hardcoded at compile time
- Cannot be changed without redeployment
- Uses direct `Pubkey` comparison (not string)
- Validates at account deserialization (before instruction execution)

#### PDA Authentication

**Token Vault Authority:**
```rust
#[account(seeds = [b"vault_authority"], bump)]
pub token_vault_authority: AccountInfo<'info>,
```

**Security Properties:**
- Deterministically derived from seeds
- Cannot be spoofed or replaced
- Program-controlled signing authority
- No private key exists

### Access Control Matrix

| Function | User | Owner | Requirements |
|----------|------|-------|--------------|
| `initialize` | ✓ | ✓ | Payer for rent |
| `pause` | ✗ | ✓ | Must be owner |
| `unpause` | ✗ | ✓ | Must be owner |
| `swap_sol_for_tokens` | ✓ | ✓ | Contract not paused, sufficient funds |

### Input Validation

#### Amount Validation
```rust
// Zero amount check
require!(sol_amount > 0, ErrorCode::InvalidAmount);

// Overflow protection
let token_amount = sol_amount
    .checked_mul(1000)
    .ok_or(ErrorCode::CalculationOverflow)?;
```

#### Balance Validation
```rust
// User balance preflight check
let user_lamports = ctx.accounts.user.lamports();
let min_rent_exemption = Rent::get()?.minimum_balance(165);
let required_lamports = sol_amount + min_rent_exemption + 5000;
require!(
    user_lamports >= required_lamports,
    ErrorCode::InsufficientUserFunds
);

// Vault balance check
require!(
    ctx.accounts.contract_token_vault.amount >= token_amount,
    ErrorCode::InsufficientTokens
);
```

#### Account Validation
```rust
// Token mint validation
constraint = token_mint.key() == constants::TOKEN_MINT
    @ ErrorCode::InvalidTokenMint

// Owner wallet validation
constraint = owner_wallet.key() == constants::OWNER_WALLET
    @ ErrorCode::InvalidOwnerWallet

// Vault mint validation
constraint = contract_token_vault.mint == token_mint.key()
    @ ErrorCode::InvalidTokenMint
```

### Attack Mitigation

| Attack Vector | Mitigation Strategy |
|---------------|---------------------|
| **Unauthorized Access** | Owner address hardcoded, PDA validation |
| **Vault Substitution** | PDA seeds validation, mint verification |
| **Integer Overflow** | `checked_mul()`, explicit overflow handling |
| **Reentrancy** | Solana's single-threaded execution model |
| **Front-running** | Fixed rate eliminates price manipulation |
| **Insufficient Funds** | Preflight balance checks |
| **Unauthorized Pause** | Owner-only constraint validation |
| **Fake Token Accounts** | Mint address validation |
| **Sybil Attacks** | Rate independent of user identity |

### Transaction Atomicity

**Solana's Guarantee:**
- All instructions succeed or all fail
- No partial state changes
- SOL transfer + token transfer = atomic

**Example Scenario:**
```
Transaction: Swap 10 SOL
├─ Step 1: Transfer SOL to owner ✓
├─ Step 2: Transfer tokens to user ✗ (vault empty)
└─ Result: ENTIRE transaction reverts
           User keeps their 10 SOL
           Owner receives nothing
```

---

## Error Handling

### Error Codes

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,              // 6000

    #[msg("Calculation overflow occurred")]
    CalculationOverflow,        // 6001

    #[msg("Invalid owner wallet address")]
    InvalidOwnerWallet,         // 6002

    #[msg("Invalid token mint - must be META token")]
    InvalidTokenMint,           // 6003

    #[msg("Insufficient tokens in vault")]
    InsufficientTokens,         // 6004

    #[msg("Insufficient user funds (need SOL for swap + ATA rent + fees)")]
    InsufficientUserFunds,      // 6005

    #[msg("Contract is paused")]
    ContractPaused,             // 6006

    #[msg("Unauthorized: Only owner can perform this action")]
    Unauthorized,               // 6007
}
```

### Error Code Reference

#### 6000: InvalidAmount
**Trigger:** User attempts to swap 0 lamports
**Resolution:** Provide `sol_amount > 0`

#### 6001: CalculationOverflow
**Trigger:** Token calculation exceeds u64::MAX
**Resolution:** Reduce swap amount (theoretical limit: ~18.4 million SOL)

#### 6002: InvalidOwnerWallet
**Trigger:** Wrong owner wallet address provided
**Resolution:** Use correct owner wallet: `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`

#### 6003: InvalidTokenMint
**Trigger:** Wrong token mint provided
**Resolution:** Use META token mint: `MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s`

#### 6004: InsufficientTokens
**Trigger:** Vault doesn't have enough tokens
**Resolution:** Contact admin to refill vault

#### 6005: InsufficientUserFunds
**Trigger:** User doesn't have enough SOL for swap + ATA rent
**Resolution:** Add more SOL to wallet (minimum: swap amount + 0.003 SOL buffer)

#### 6006: ContractPaused
**Trigger:** Swap attempted while contract is paused
**Resolution:** Wait for contract to be unpaused by owner

#### 6007: Unauthorized
**Trigger:** Non-owner attempts admin function
**Resolution:** Only owner can pause/unpause

### Error Handling Example

```typescript
try {
  await program.methods
    .swapSolForTokens(new BN(10_000_000_000))
    .accounts({ /* ... */ })
    .rpc();
} catch (error) {
  if (error.code === 6006) {
    console.error("Contract is paused. Please try again later.");
  } else if (error.code === 6004) {
    console.error("Vault is empty. Contact support.");
  } else if (error.code === 6005) {
    console.error("Insufficient funds. Add more SOL to your wallet.");
  } else {
    console.error("Transaction failed:", error.message);
  }
}
```

---

## Events & Logging

### SwapEvent

**Definition:**
```rust
#[event]
pub struct SwapEvent {
    pub user: Pubkey,        // User who performed the swap
    pub sol_amount: u64,     // Lamports swapped
    pub token_amount: u64,   // Tokens received (base units)
    pub timestamp: i64,      // Unix timestamp
}
```

**Emission:**
```rust
emit!(SwapEvent {
    user: ctx.accounts.user.key(),
    sol_amount,
    token_amount,
    timestamp: Clock::get()?.unix_timestamp,
});
```

**Event Listener Example:**
```typescript
// Subscribe to swap events
const listener = program.addEventListener("SwapEvent", (event, slot) => {
  console.log("Swap detected at slot", slot);
  console.log("User:", event.user.toString());
  console.log("SOL Amount:", event.solAmount.toNumber());
  console.log("Token Amount:", event.tokenAmount.toNumber());
  console.log("Timestamp:", new Date(event.timestamp * 1000));
});

// Remove listener when done
program.removeEventListener(listener);
```

### Log Messages

**Initialize:**
```
Program log: Token swap contract initialized
```

**Pause:**
```
Program log: Contract paused
```

**Unpause:**
```
Program log: Contract unpaused
```

**Swap:**
```
Program log: Swapped 10000000000 lamports (10 SOL) for 10000000000000 tokens. SOL sent to owner.
```

---

## Integration Guide

### Client Setup

#### 1. Install Dependencies
```bash
npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token
```

#### 2. Initialize Program
```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl/my_solana_contract.json";

// Setup provider
const connection = new Connection("https://api.devnet.solana.com");
const wallet = /* your wallet */;
const provider = new AnchorProvider(connection, wallet, {
  commitment: "confirmed"
});

// Load program
const programId = new PublicKey("CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL");
const program = new Program(idl, programId, provider);
```

#### 3. Derive PDAs
```typescript
const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")],
  program.programId
);

const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")],
  program.programId
);

const [authorityPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault_authority")],
  program.programId
);
```

### Complete Integration Example

```typescript
import { getAssociatedTokenAddress } from "@solana/spl-token";

class MetaTokenSwap {
  constructor(
    private program: Program,
    private statePDA: PublicKey,
    private vaultPDA: PublicKey,
    private authorityPDA: PublicKey
  ) {}

  /**
   * Swap SOL for META tokens
   * @param userKeypair - User's keypair
   * @param solAmount - Amount of lamports to swap
   * @returns Transaction signature
   */
  async swap(
    userKeypair: Keypair,
    solAmount: number
  ): Promise<string> {
    const tokenMint = new PublicKey(
      "MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s"
    );
    const ownerWallet = new PublicKey(
      "CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK"
    );

    // Get user's ATA
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userKeypair.publicKey
    );

    // Execute swap
    const tx = await this.program.methods
      .swapSolForTokens(new anchor.BN(solAmount))
      .accounts({
        state: this.statePDA,
        user: userKeypair.publicKey,
        userTokenAccount: userTokenAccount,
        tokenMint: tokenMint,
        ownerWallet: ownerWallet,
        contractTokenVault: this.vaultPDA,
        tokenVaultAuthority: this.authorityPDA,
      })
      .signers([userKeypair])
      .rpc();

    console.log("Swap successful:", tx);
    return tx;
  }

  /**
   * Check if contract is paused
   * @returns Boolean indicating pause status
   */
  async isPaused(): Promise<boolean> {
    const state = await this.program.account.contractState.fetch(
      this.statePDA
    );
    return state.isPaused;
  }

  /**
   * Get vault balance
   * @returns Number of tokens available in vault
   */
  async getVaultBalance(): Promise<number> {
    const vault = await this.program.account.tokenAccount.fetch(
      this.vaultPDA
    );
    return vault.amount.toNumber();
  }

  /**
   * Calculate tokens for given SOL amount
   * @param solAmount - Lamports to swap
   * @returns Token amount (base units)
   */
  calculateTokens(solAmount: number): number {
    return solAmount * 1000;
  }
}
```

### Usage Example

```typescript
// Initialize
const swap = new MetaTokenSwap(
  program,
  statePDA,
  vaultPDA,
  authorityPDA
);

// Check contract status
const paused = await swap.isPaused();
if (paused) {
  throw new Error("Contract is paused");
}

// Check vault has tokens
const vaultBalance = await swap.getVaultBalance();
const requiredTokens = swap.calculateTokens(10_000_000_000); // 10 SOL
if (vaultBalance < requiredTokens) {
  throw new Error("Insufficient vault balance");
}

// Perform swap
const signature = await swap.swap(
  userKeypair,
  10_000_000_000 // 10 SOL
);

console.log("Transaction:", signature);
```

---

## Deployment Guide

### Prerequisites

```bash
# Solana CLI version
solana --version
# solana-cli 1.18.0 or higher

# Anchor version
anchor --version
# anchor-cli 0.32.1

# Rust version
rustc --version
# rustc 1.75.0 or higher
```

### Step 1: Build Program

```bash
cd my_solana_contract
anchor build
```

**Verify Build:**
```bash
ls -lh target/deploy/
# Should see: my_solana_contract.so
```

### Step 2: Generate Program Keypair

```bash
# Generate new program keypair (if needed)
solana-keygen new -o target/deploy/my_solana_contract-keypair.json

# Get program ID
solana address -k target/deploy/my_solana_contract-keypair.json
```

**Update Program ID:**
Update `declare_id!()` in `lib.rs` and `Anchor.toml` with the new program ID, then rebuild.

### Step 3: Deploy to Devnet

```bash
# Configure devnet
solana config set --url https://api.devnet.solana.com

# Request airdrop (devnet only)
solana airdrop 2

# Deploy
anchor deploy
```

**Expected Output:**
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: ~/.config/solana/id.json
Deploying program "my_solana_contract"...
Program Id: CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL
Deploy success
```

### Step 4: Initialize Contract

```typescript
// Initialize contract state
const tx = await program.methods
  .initialize()
  .accounts({
    state: statePDA,
    payer: payerKeypair.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([payerKeypair])
  .rpc();

console.log("Initialized:", tx);
```

### Step 5: Setup Token Vault

```bash
# 1. Create token vault (PDA-based)
# Use the vault PDA as the token account

# 2. Transfer tokens to vault
spl-token transfer <TOKEN_MINT> <AMOUNT> <VAULT_PDA> \
  --owner <OWNER_KEYPAIR> \
  --fund-recipient

# Example:
spl-token transfer MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s 1000000 \
  <VAULT_PDA> --owner owner-keypair.json --fund-recipient
```

### Step 6: Verify Deployment

```typescript
// Check contract state
const state = await program.account.contractState.fetch(statePDA);
console.log("Owner:", state.owner.toString());
console.log("Paused:", state.isPaused);

// Check vault
const vault = await getAccount(connection, vaultPDA);
console.log("Vault Balance:", vault.amount);
console.log("Vault Mint:", vault.mint.toString());
console.log("Vault Owner:", vault.owner.toString());

// Verify owner is vault authority PDA
assert(vault.owner.equals(authorityPDA));
```

### Step 7: Production Deployment (Mainnet)

```bash
# Configure mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Ensure sufficient SOL for deployment (~2-3 SOL)
solana balance

# Deploy
anchor deploy

# Initialize (same as devnet)
# Fund vault (same as devnet)
```

**Post-Deployment Checklist:**
- [ ] Contract state initialized
- [ ] Token vault created and funded
- [ ] Vault authority set correctly
- [ ] Test swap with small amount
- [ ] Monitor first transactions
- [ ] Set up event monitoring
- [ ] Document deployed addresses

---

## Testing & Validation

### Unit Tests

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";

describe("my_solana_contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MySolanaContract;

  it("Initializes contract state", async () => {
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

    const state = await program.account.contractState.fetch(statePDA);
    assert.equal(state.isPaused, false);
    assert.equal(state.owner.toString(), constants.OWNER_WALLET.toString());
  });

  it("Swaps SOL for tokens", async () => {
    // Test implementation
  });

  it("Creates ATA automatically", async () => {
    // Test implementation
  });

  it("Rejects swap when paused", async () => {
    // Test implementation
  });

  it("Only owner can pause", async () => {
    // Test implementation
  });
});
```

### Integration Tests

```bash
# Run all tests
anchor test

# Run specific test
anchor test --skip-deploy --skip-local-validator
```

### Manual Testing Checklist

- [ ] Initialize contract
- [ ] Swap with existing ATA
- [ ] Swap with ATA creation
- [ ] Pause contract (owner)
- [ ] Attempt swap while paused (should fail)
- [ ] Unpause contract (owner)
- [ ] Attempt pause as non-owner (should fail)
- [ ] Swap with insufficient SOL (should fail)
- [ ] Swap with empty vault (should fail)
- [ ] Verify events emitted correctly
- [ ] Check vault balance updates
- [ ] Verify owner receives SOL

### Performance Metrics

| Operation | Compute Units | Transaction Size | Avg Latency |
|-----------|---------------|------------------|-------------|
| Initialize | ~5,000 CU | ~250 bytes | <1s |
| Pause/Unpause | ~2,000 CU | ~200 bytes | <1s |
| Swap (existing ATA) | ~35,000 CU | ~600 bytes | 1-2s |
| Swap (new ATA) | ~50,000 CU | ~800 bytes | 1-2s |

---

## Appendix

### A. PDA Derivation Reference

```rust
// All PDAs used in this contract

// State PDA
let (state, state_bump) = Pubkey::find_program_address(
    &[b"state"],
    &program_id
);

// Token Vault PDA
let (vault, vault_bump) = Pubkey::find_program_address(
    &[b"token_vault"],
    &program_id
);

// Vault Authority PDA
let (authority, authority_bump) = Pubkey::find_program_address(
    &[b"vault_authority"],
    &program_id
);
```

### B. Token Economics

```
Exchange Rate: 0.001 SOL = 1 META

Token Decimals: 9
Base Units: 1 META = 1,000,000,000 base units

Lamports: 1 SOL = 1,000,000,000 lamports
          0.001 SOL = 1,000,000 lamports

Conversion Formula:
  token_base_units = lamports × 1000

Examples:
  1,000,000 lamports × 1000 = 1,000,000,000 base units = 1 META
  1,000,000,000 lamports × 1000 = 1,000,000,000,000 base units = 1,000 META
```

### C. Gas Costs (Devnet/Mainnet)

```
Base Transaction Fee: 5,000 lamports (~$0.000005 at $100/SOL)
Compute Unit Price: Variable (typically 0-1 lamports per CU)

Estimated Costs:
- Initialize: ~5,000 lamports
- Pause/Unpause: ~5,000 lamports
- Swap (existing ATA): ~5,000 lamports
- Swap (new ATA): ~2,044,280 lamports (~0.002 SOL for ATA rent)
```

### D. Mainnet Deployment Considerations

1. **Upgradability:** Program is upgradable by default. Consider using `anchor deploy --program-name <name>` with `--upgrade-authority`
2. **Audit:** Recommend third-party security audit before mainnet
3. **Insurance:** Consider using a bug bounty program
4. **Monitoring:** Set up alerting for unusual activity
5. **Rate Limiting:** Consider implementing per-user rate limits
6. **Circuit Breaker:** Use pause function liberally in suspicious scenarios

### E. Support & Resources

- **Solana Documentation:** https://docs.solana.com
- **Anchor Framework:** https://www.anchor-lang.com
- **SPL Token Program:** https://spl.solana.com/token

---

**Document Version:** 1.0.0
**Last Updated:** 2025-12-16
**Program Version:** 1.0.0
**Anchor Version:** 0.32.1
