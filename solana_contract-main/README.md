# Solana Token Swap Contract

A secure, production-ready Solana smart contract for swapping SOL to META tokens at a fixed exchange rate.

## Overview

This contract enables users to purchase META tokens with SOL at a fixed rate of **0.001 SOL = 1 META token**. The contract automatically creates Associated Token Accounts (ATAs) for first-time users and transfers SOL directly to the owner's wallet.

## Contract Details

- **Program ID**: `CRfi1orhq3GJo3qjezoDA8k4fd26kLZ4xcXLRGXjC8LL`
- **META Token Mint**: `MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s`
- **Owner Wallet**: `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`
- **Exchange Rate**: 0.001 SOL = 1 META token (1,000,000 lamports = 1 token with 9 decimals)

## Features

### Core Functionality
- ✅ **Fixed-Rate Swaps** - Simple, predictable pricing at 0.001 SOL per token
- ✅ **Automatic ATA Creation** - Creates user's token account if it doesn't exist
- ✅ **Direct Owner Payments** - SOL goes directly to owner wallet (no withdrawal needed)
- ✅ **PDA-Based Vault System** - Secure token storage using Program Derived Addresses

### Security Features
- ✅ **Hardcoded Owner Validation** - Only specified owner can receive payments
- ✅ **Token Mint Validation** - Ensures only META tokens are distributed
- ✅ **PDA-Validated Vaults** - Prevents unauthorized vault access
- ✅ **Balance Preflight Checks** - Validates sufficient funds before execution
- ✅ **Overflow Protection** - Safe math operations with checked multiplication
- ✅ **Pause Mechanism** - Owner can pause/unpause contract in emergencies
- ✅ **Admin Controls** - Owner-only functions for contract management

### Observability
- ✅ **Event Emission** - Structured SwapEvent for tracking all swaps
- ✅ **Detailed Logging** - Comprehensive on-chain logging

## Functions

### User Functions

#### `swap_sol_for_tokens(sol_amount: u64)`
Swaps SOL for META tokens at the fixed rate.

**Parameters:**
- `sol_amount` - Amount of lamports to swap (1 SOL = 1,000,000,000 lamports)

**Example:**
```rust
// Swap 10 SOL for 10,000 META tokens
swap_sol_for_tokens(10_000_000_000)
```

**Process:**
1. Validates contract is not paused
2. Checks user has enough SOL (including ATA rent if needed)
3. Calculates token amount: `token_amount = sol_amount × 1000`
4. Verifies vault has sufficient tokens
5. Creates user's ATA if it doesn't exist (user pays ~0.002 SOL rent)
6. Transfers SOL from user to owner wallet
7. Transfers calculated tokens from vault to user
8. Emits SwapEvent

**Cost:**
- First-time users: `sol_amount + ~0.002 SOL` (includes ATA creation)
- Returning users: `sol_amount` only

### Admin Functions (Owner Only)

#### `initialize()`
Initializes the contract state. Must be called once before any swaps.

**Sets:**
- `is_paused = false`
- `owner = OWNER_WALLET`

#### `pause()`
Pauses all swap operations. Only callable by owner.

**Use case:** Emergency situations, maintenance, or security incidents

#### `unpause()`
Resumes swap operations. Only callable by owner.

## Account Structure

### Contract State (PDA)
**Seeds:** `[b"state"]`

**Data:**
```rust
{
    is_paused: bool,        // Whether contract is paused
    owner: Pubkey,          // Owner's public key
}
```

### Token Vault (PDA)
**Seeds:** `[b"token_vault"]`

**Type:** Associated Token Account holding META tokens for distribution

**Authority:** `vault_authority` PDA

### Vault Authority (PDA)
**Seeds:** `[b"vault_authority"]`

**Purpose:** Has authority to transfer tokens from token_vault

## Swap Transaction Accounts

When calling `swap_sol_for_tokens`, you must provide:

| Account | Type | Mutable | Description |
|---------|------|---------|-------------|
| `state` | PDA | No | Contract state account |
| `user` | Signer | Yes | User making the swap |
| `user_token_account` | ATA | Yes | User's META token account (auto-created) |
| `token_mint` | Account | No | META token mint address |
| `owner_wallet` | Account | Yes | Owner's wallet (receives SOL) |
| `contract_token_vault` | PDA | Yes | Contract's token storage |
| `token_vault_authority` | PDA | No | Authority for vault transfers |
| `token_program` | Program | No | SPL Token program |
| `associated_token_program` | Program | No | Associated Token program |
| `system_program` | Program | No | System program |

## Events

### SwapEvent
Emitted on every successful swap.

```rust
{
    user: Pubkey,           // User who made the swap
    sol_amount: u64,        // Amount of lamports swapped
    token_amount: u64,      // Amount of tokens received
    timestamp: i64,         // Unix timestamp
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `InvalidAmount` | Amount must be greater than zero | User sent 0 SOL |
| `CalculationOverflow` | Calculation overflow occurred | Math overflow in token calculation |
| `InvalidOwnerWallet` | Invalid owner wallet address | Wrong owner wallet provided |
| `InvalidTokenMint` | Invalid token mint - must be META token | Wrong token mint provided |
| `InsufficientTokens` | Insufficient tokens in vault | Vault doesn't have enough tokens |
| `InsufficientUserFunds` | Insufficient user funds | User doesn't have enough SOL |
| `ContractPaused` | Contract is paused | Swap attempted while paused |
| `Unauthorized` | Only owner can perform this action | Non-owner tried admin function |

## Building & Deployment

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Build
```bash
cd my_solana_contract
anchor build
```

### Deploy
```bash
# Configure Solana CLI for devnet
solana config set --url https://api.devnet.solana.com

# Set your keypair
solana config set --keypair ~/.config/solana/id.json

# Airdrop SOL for deployment (devnet only)
solana airdrop 2

# Deploy the program
anchor deploy
```

### Initialize Contract
After deployment, initialize the contract:
```bash
anchor run initialize
```

## Setup Instructions

### 1. Create Token Vault
Create a token account that will hold the META tokens for distribution:

```bash
# Create token vault PDA
# Seeds: [b"token_vault"]
# Authority: vault_authority PDA
```

### 2. Fund Token Vault
Transfer META tokens to the vault:

```bash
spl-token transfer <TOKEN_MINT> <AMOUNT> <VAULT_ADDRESS> --fund-recipient
```

### 3. Verify Setup
Check that:
- Contract state is initialized
- Token vault has tokens
- Vault authority is set correctly
- Contract is not paused

## Usage Examples

### JavaScript/TypeScript (Anchor)

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

// Initialize
const program = anchor.workspace.MySolanaContract as Program<MySolanaContract>;
const user = anchor.web3.Keypair.generate();

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

// Get user's ATA (will be created automatically if needed)
const tokenMint = new PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");
const ownerWallet = new PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

const userTokenAccount = await getAssociatedTokenAddress(
  tokenMint,
  user.publicKey
);

// Swap 10 SOL for tokens
const solAmount = new anchor.BN(10_000_000_000); // 10 SOL

await program.methods
  .swapSolForTokens(solAmount)
  .accounts({
    state: statePDA,
    user: user.publicKey,
    userTokenAccount: userTokenAccount,
    tokenMint: tokenMint,
    ownerWallet: ownerWallet,
    contractTokenVault: vaultPDA,
    tokenVaultAuthority: vaultAuthorityPDA,
  })
  .signers([user])
  .rpc();

console.log("Swap successful! User received 10,000 META tokens");
```

### Admin Operations

```typescript
// Pause contract (owner only)
await program.methods
  .pause()
  .accounts({
    state: statePDA,
    admin: ownerKeypair.publicKey,
  })
  .signers([ownerKeypair])
  .rpc();

// Unpause contract (owner only)
await program.methods
  .unpause()
  .accounts({
    state: statePDA,
    admin: ownerKeypair.publicKey,
  })
  .signers([ownerKeypair])
  .rpc();
```

## Security Considerations

### Audited Security Features
1. **PDA Validation** - All critical accounts use PDA with seed validation
2. **Hardcoded Constants** - Owner and mint addresses are compile-time constants
3. **Atomic Transactions** - All operations succeed or fail together
4. **Balance Checks** - Validates sufficient funds before execution
5. **Access Control** - Admin functions restricted to owner only

### Known Limitations
1. **Fixed Exchange Rate** - Rate is hardcoded, cannot be updated without redeployment
2. **No Dynamic Pricing** - Does not support AMM-style pricing
3. **Single Token** - Only supports META token

### Best Practices
- Always initialize the contract before first use
- Keep the token vault funded to avoid failed swaps
- Monitor swap events for unusual activity
- Use pause mechanism in emergencies
- Test thoroughly on devnet before mainnet deployment

## Testing

### Run Tests
```bash
anchor test
```

### Test Coverage
- Initialize contract state
- Swap with ATA creation
- Swap with existing ATA
- Pause/unpause functionality
- Error cases (insufficient funds, paused contract, etc.)
- Event emission verification

## License

MIT License

## Support

For issues or questions, please contact the development team or open an issue in the repository.

## Changelog

### v1.0.0 (Current)
- Initial release
- Fixed-rate swap implementation
- Automatic ATA creation
- PDA-based vault system
- Pause mechanism
- Event emission
- Comprehensive security features
