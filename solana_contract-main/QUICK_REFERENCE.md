# MetaH2O ICO Contract - Quick Reference

## 🔑 Essential Addresses

```
Program ID:      FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP
Token Mint:      MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s
Owner Wallet:    CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK
Network:         Devnet (https://api.devnet.solana.com)
```

## 📐 Exchange Rate

```
0.001 SOL = 1 META token
1 SOL = 1,000 META tokens
10 SOL = 10,000 META tokens
100 SOL (max) = 100,000 META tokens

Formula: token_amount = sol_amount_in_lamports × 1000
```

## 🛠️ PDA Seeds

```typescript
State PDA:           ["state"]
Token Vault PDA:     ["token_vault"]
Vault Authority PDA: ["vault_authority"]
```

## 💻 Quick Integration

```typescript
import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

const programId = new PublicKey("FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP");
const tokenMint = new PublicKey("MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s");
const ownerWallet = new PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

// Swap SOL for tokens
const solAmount = new BN(1_000_000_000); // 1 SOL

const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")], programId
);
const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")], programId
);
const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault_authority")], programId
);

await program.methods
  .swapSolForTokens(solAmount)
  .accounts({
    state: statePDA,
    user: wallet.publicKey,
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
```

## ⚡ Functions Summary

| Function | Access | Description |
|----------|--------|-------------|
| `initialize()` | Anyone (once) | Creates contract state |
| `initialize_vault()` | Owner only | Creates token vault |
| `swap_sol_for_tokens(sol_amount)` | Public | Swap SOL for META |
| `pause()` | Owner only | Pause swaps |
| `unpause()` | Owner only | Resume swaps |

## ⚠️ Limits & Validations

- **Min swap:** > 0 SOL
- **Max swap:** 100 SOL per transaction
- **Rent exemption:** Maintains ~0.001 SOL in user wallet
- **ATA cost:** ~0.002 SOL (first time only)

## 🔒 Error Codes

```
6000: InvalidAmount (zero or negative)
6001: CalculationOverflow
6002: InvalidOwnerWallet
6003: InvalidTokenMint
6004: InsufficientTokens (vault empty)
6005: InsufficientUserFunds
6006: ContractPaused
6007: Unauthorized (not owner)
6008: InvalidVaultAuthority
6009: BelowRentExemption
6010: SwapAmountTooLarge (>100 SOL)
```

## 🔗 Explorer Links

- [Program](https://explorer.solana.com/address/FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP?cluster=devnet)
- [Token](https://explorer.solana.com/address/MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s?cluster=devnet)
- [Owner](https://explorer.solana.com/address/CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK?cluster=devnet)
