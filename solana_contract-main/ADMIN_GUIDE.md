# MetaH2O ICO Contract - Admin Guide

## 🎯 Owner Information

**Your Owner Wallet:** `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`

This wallet has exclusive access to:
- Initialize the token vault
- Pause/unpause the contract
- Receive all SOL payments from swaps

**Security:** Keep your owner wallet private key secure. It cannot be changed.

---

## ✅ Deployment Checklist

### Phase 1: Initial Deployment ✓ COMPLETED

- [x] Build program: `anchor build`
- [x] Deploy to devnet: `anchor deploy`
- [x] Program ID: `FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP`

### Phase 2: Contract Initialization

- [ ] **Step 1:** Initialize contract state
  ```bash
  # Anyone can do this (first time only)
  # Run from your deployment account
  ```

- [ ] **Step 2:** Initialize token vault (OWNER ONLY)
  ```bash
  # MUST be signed by: CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK
  # This creates the vault that will hold META tokens
  ```

- [ ] **Step 3:** Fund the vault with META tokens
  ```bash
  # Transfer META tokens to the vault PDA
  # Recommended: Start with 1,000,000 META tokens
  ```

- [ ] **Step 4:** Test swap with small amount
  ```bash
  # Try swapping 0.1 SOL to verify everything works
  ```

### Phase 3: Go Live

- [ ] Verify vault has sufficient tokens
- [ ] Test all functions (swap, pause, unpause)
- [ ] Monitor first few real swaps
- [ ] Set up event monitoring

---

## 🔧 Admin Operations

### Get Vault Address

```typescript
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP");

const [vaultPDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault")],
  programId
);

console.log("Vault address:", vaultPDA.toBase58());
```

### Check Vault Balance

```bash
# Get vault address first, then:
spl-token balance MetahQRCgXVBtxTJe1x7RAmnaokiTTYKZjVq8dcaP8s --owner <VAULT_ADDRESS>
```

Or programmatically:
```typescript
import { getAccount } from "@solana/spl-token";

const vaultAccount = await getAccount(connection, vaultPDA);
console.log("Vault balance:", vaultAccount.amount.toString(), "smallest units");
console.log("Vault balance:", Number(vaultAccount.amount) / 1e9, "META tokens");
```

### Fund the Vault

```typescript
import { transfer } from "@solana/spl-token";

// Amount to transfer (e.g., 1,000,000 META tokens)
const amount = 1_000_000 * 1e9; // Convert to smallest units (9 decimals)

// Get your owner token account
const ownerTokenAccount = await getAssociatedTokenAddress(
  tokenMint,
  ownerKeypair.publicKey
);

// Transfer to vault
const signature = await transfer(
  connection,
  ownerKeypair, // Must be owner wallet
  ownerTokenAccount,
  vaultPDA,
  ownerKeypair.publicKey,
  amount
);

console.log("Funded vault. Signature:", signature);
```

### Pause Contract (Emergency)

```typescript
const [statePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("state")],
  programId
);

await program.methods
  .pause()
  .accounts({
    state: statePDA,
    admin: ownerKeypair.publicKey,
  })
  .signers([ownerKeypair])
  .rpc();

console.log("Contract PAUSED. All swaps are now blocked.");
```

**When to pause:**
- Security vulnerability detected
- Vault needs refilling
- Market conditions require temporary halt
- Testing or maintenance

### Unpause Contract

```typescript
await program.methods
  .unpause()
  .accounts({
    state: statePDA,
    admin: ownerKeypair.publicKey,
  })
  .signers([ownerKeypair])
  .rpc();

console.log("Contract UNPAUSED. Swaps are now enabled.");
```

### Check Contract Status

```typescript
const stateAccount = await program.account.contractState.fetch(statePDA);
console.log("Contract paused:", stateAccount.isPaused);
```

---

## 📊 Monitoring & Analytics

### Monitor Incoming Swaps

```typescript
// Real-time event monitoring
const subscriptionId = program.addEventListener("SwapEvent", (event, slot) => {
  const solAmount = event.solAmount.toNumber() / 1e9;
  const tokenAmount = event.tokenAmount.toNumber() / 1e9;

  console.log("=== NEW SWAP ===");
  console.log("User:", event.user.toBase58());
  console.log("SOL sent:", solAmount);
  console.log("META received:", tokenAmount);
  console.log("Time:", new Date(event.timestamp * 1000).toISOString());
  console.log("Slot:", slot);

  // Optional: Log to database, send notification, etc.
});

console.log("Monitoring swaps... (Subscription ID:", subscriptionId, ")");

// To stop monitoring:
// program.removeEventListener(subscriptionId);
```

### Check Owner Wallet Balance

```bash
# Check SOL received from swaps
solana balance CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK
```

### Get Transaction History

```typescript
const ownerPubkey = new PublicKey("CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK");

const signatures = await connection.getSignaturesForAddress(ownerPubkey, {
  limit: 100
});

console.log("Recent transactions:");
signatures.forEach(sig => {
  console.log("-", sig.signature, "at", new Date(sig.blockTime * 1000));
});
```

### Calculate Total SOL Received

```typescript
let totalSolReceived = 0;

program.addEventListener("SwapEvent", (event) => {
  totalSolReceived += event.solAmount.toNumber() / 1e9;
  console.log("Total SOL received:", totalSolReceived, "SOL");
});
```

---

## 🚨 Emergency Procedures

### Scenario 1: Vault Running Low

```typescript
// 1. Check vault balance
const vaultAccount = await getAccount(connection, vaultPDA);
const balance = Number(vaultAccount.amount) / 1e9;

if (balance < 10000) { // Less than 10,000 META
  console.log("⚠️ WARNING: Vault balance low:", balance, "META");

  // 2. Optionally pause contract
  await program.methods.pause().accounts({ /*...*/ }).rpc();

  // 3. Refill vault
  await transfer(connection, ownerKeypair, ownerTokenAccount, vaultPDA, ownerKeypair.publicKey, refillAmount);

  // 4. Unpause
  await program.methods.unpause().accounts({ /*...*/ }).rpc();
}
```

### Scenario 2: Suspected Issue

```bash
# 1. Immediately pause
# (Use pause command above)

# 2. Investigate
# - Check recent transactions
# - Review logs
# - Verify vault balance

# 3. If safe, unpause
# (Use unpause command above)
```

### Scenario 3: Need to Check Specific Transaction

```typescript
const txSignature = "your_transaction_signature_here";
const tx = await connection.getTransaction(txSignature, {
  commitment: "confirmed"
});

console.log("Transaction details:", tx);
```

---

## 📈 Vault Management Best Practices

### 1. Initial Funding
- Start with at least **100,000 META tokens**
- This covers 100 SOL worth of swaps
- Prevents running out during initial launch

### 2. Monitoring Thresholds
Set up alerts when vault balance drops below:
- **50,000 META**: Warning (refill soon)
- **10,000 META**: Critical (refill immediately)
- **1,000 META**: Emergency (pause and refill)

### 3. Refill Strategy
```typescript
async function autoRefillVault(minBalance: number, refillAmount: number) {
  const vaultAccount = await getAccount(connection, vaultPDA);
  const balance = Number(vaultAccount.amount) / 1e9;

  if (balance < minBalance) {
    console.log(`Vault balance (${balance}) below threshold (${minBalance})`);
    console.log("Refilling with", refillAmount, "META tokens...");

    await transfer(
      connection,
      ownerKeypair,
      ownerTokenAccount,
      vaultPDA,
      ownerKeypair.publicKey,
      refillAmount * 1e9
    );

    console.log("Vault refilled successfully!");
  }
}

// Run every hour
setInterval(() => autoRefillVault(10000, 50000), 60 * 60 * 1000);
```

---

## 🔐 Security Recommendations

### Wallet Security
1. **Never share your private key** for `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`
2. Store keypair in secure location (hardware wallet recommended)
3. Use separate deployment wallet for non-admin operations
4. Keep backups of keypair in multiple secure locations

### Operational Security
1. **Test on devnet first** (you're doing this ✓)
2. Start with small vault amounts initially
3. Monitor first swaps closely
4. Have pause/unpause scripts ready
5. Set up automated monitoring and alerts

### Access Control
- Owner wallet is **hardcoded** - cannot be changed
- Only this wallet can:
  - Initialize vault
  - Pause/unpause contract
- All SOL from swaps goes directly to this wallet

---

## 📞 Quick Commands Reference

```bash
# Check vault balance
solana balance <VAULT_ADDRESS>

# Check owner SOL balance
solana balance CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK

# Get vault address programmatically
# (Use TypeScript code above)

# View recent transactions
solana transactions CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK

# Check contract state
# (Use program.account.contractState.fetch())
```

---

## 📊 Revenue Tracking

### Simple Revenue Calculator

```typescript
interface SwapRecord {
  user: string;
  solAmount: number;
  tokenAmount: number;
  timestamp: number;
}

const swapHistory: SwapRecord[] = [];

program.addEventListener("SwapEvent", (event) => {
  const record = {
    user: event.user.toBase58(),
    solAmount: event.solAmount.toNumber() / 1e9,
    tokenAmount: event.tokenAmount.toNumber() / 1e9,
    timestamp: event.timestamp,
  };

  swapHistory.push(record);

  // Calculate totals
  const totalSol = swapHistory.reduce((sum, r) => sum + r.solAmount, 0);
  const totalTokens = swapHistory.reduce((sum, r) => sum + r.tokenAmount, 0);

  console.log("=== REVENUE STATS ===");
  console.log("Total swaps:", swapHistory.length);
  console.log("Total SOL received:", totalSol);
  console.log("Total META distributed:", totalTokens);
  console.log("Average swap size:", totalSol / swapHistory.length, "SOL");
});
```

---

## 🎯 Next Steps After Deployment

1. **Initialize contract state** (any wallet can do this)
2. **Initialize vault** (owner wallet required)
3. **Fund vault with META tokens** (recommended: 100,000+)
4. **Test swap** (small amount first)
5. **Set up monitoring** (event listeners, alerts)
6. **Announce to users** (share program ID and documentation)
7. **Monitor closely** for first 24 hours

---

## 📝 Notes

- All SOL payments go **directly to your wallet** (no withdrawal needed)
- Maximum 100 SOL per swap protects against large drains
- Contract can be paused instantly in case of emergency
- Vault can be refilled anytime without pausing
- Exchange rate is **fixed and cannot be changed** (0.001 SOL = 1 META)

---

**Owner Wallet:** `CKZBQCo7mxXmtyRcPxDMmdTLJsMv1FDtx4wZJxJ8vALK`
**Program ID:** `FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP`
**Network:** Devnet

Keep this guide secure and accessible for contract management.
