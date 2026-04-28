# MetaH2O ICO Contract - Web Integration Guide

Complete guide for integrating the MetaH2O token swap functionality into a web application using Phantom or Solflare wallets.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Smart Contract Details](#smart-contract-details)
4. [Installation](#installation)
5. [Wallet Integration](#wallet-integration)
6. [Implementing the Swap Function](#implementing-the-swap-function)
7. [Complete Example](#complete-example)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

---

## Overview

The MetaH2O ICO contract allows users to swap USDT tokens for MetaH2O (META) tokens at a fixed exchange rate.

### Key Features

- **Exchange Rate**: 1 USDT = 100 META tokens
- **Minimum Swap**: 10 USDT
- **Network**: Solana Mainnet
- **Token Decimals**: USDT (6 decimals), META (9 decimals)
- **Automatic Token Account Creation**: User's token accounts are created automatically if they don't exist

### Contract Information

- **Program ID**: `4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44`
- **Input Token (USDT)**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`
- **Output Token (META)**: `Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF`
- **Payment Recipient**: `2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng`

---

## Prerequisites

### Required Knowledge

- Basic understanding of React/TypeScript
- Familiarity with Solana web3 concepts
- Understanding of wallet adapters

### Required Accounts

- User needs USDT tokens in their wallet
- Sufficient SOL for transaction fees (approximately 0.01 SOL)

---

## Smart Contract Details

### Swap Function Signature

```rust
pub fn swap_tokens(
    ctx: Context<SwapTokens>,
    input_amount: u64,  // Amount in base units (e.g., 10 USDT = 10_000_000)
) -> Result<()>
```

### Required Accounts

The swap function requires the following accounts:

1. **state** - Contract state PDA (seeds: `["state"]`)
2. **user** - User's wallet (signer)
3. **userInputTokenAccount** - User's USDT token account (auto-created)
4. **userOutputTokenAccount** - User's META token account (auto-created)
5. **inputTokenMint** - USDT token mint
6. **outputTokenMint** - META token mint
7. **ownerInputTokenAccount** - Payment recipient's USDT account
8. **ownerWallet** - Payment recipient wallet
9. **rewardVault** - Contract's META token vault PDA (seeds: `["token_vault"]`)
10. **vaultAuthority** - Vault authority PDA (seeds: `["vault_authority"]`)
11. **tokenProgram** - SPL Token Program
12. **associatedTokenProgram** - Associated Token Program
13. **systemProgram** - System Program

### Validation Rules

- Input amount must be >= 10 USDT (10_000_000 base units)
- Contract must not be paused
- Vault must have sufficient META tokens
- User must have sufficient USDT tokens

---

## Installation

### Install Required Dependencies

```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base @solana/spl-token
```

### For TypeScript Projects

```bash
npm install --save-dev @types/node
```

### Package.json

```json
{
  "dependencies": {
    "@solana/web3.js": "^1.87.0",
    "@solana/wallet-adapter-react": "^0.15.35",
    "@solana/wallet-adapter-react-ui": "^0.9.34",
    "@solana/wallet-adapter-wallets": "^0.19.26",
    "@solana/wallet-adapter-base": "^0.9.23",
    "@solana/spl-token": "^0.3.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## Wallet Integration

### Step 1: Set Up Wallet Provider

Create a `WalletContextProvider.tsx` component:

```typescript
import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  // Use mainnet-beta for production
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

### Step 2: Wrap Your App

In your `App.tsx` or `_app.tsx`:

```typescript
import { WalletContextProvider } from './WalletContextProvider';

function App() {
  return (
    <WalletContextProvider>
      {/* Your app components */}
    </WalletContextProvider>
  );
}

export default App;
```

### Step 3: Add Wallet Connection Button

```typescript
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function Header() {
  return (
    <header>
      <WalletMultiButton />
    </header>
  );
}
```

---

## Implementing the Swap Function

### Step 1: Create Constants File

Create `constants.ts`:

```typescript
import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44');
export const INPUT_TOKEN_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); // USDT
export const OUTPUT_TOKEN_MINT = new PublicKey('Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF'); // META
export const PAYMENT_RECIPIENT = new PublicKey('2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng');
export const OWNER_INPUT_TOKEN_ACCOUNT = new PublicKey('BuSED3pwCa6iJH1gXJq46QJRoFq5hiN7KLxvJCU8KKaH');

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

// Swap configuration
export const MIN_SWAP_AMOUNT = 10; // 10 USDT
export const SWAP_RATIO = 100; // 1 USDT = 100 META
export const USDT_DECIMALS = 6;
export const META_DECIMALS = 9;
```

### Step 2: Create Helper Functions

Create `utils/swap.ts`:

```typescript
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import * as borsh from 'borsh';
import {
  PROGRAM_ID,
  INPUT_TOKEN_MINT,
  OUTPUT_TOKEN_MINT,
  PAYMENT_RECIPIENT,
  OWNER_INPUT_TOKEN_ACCOUNT,
  SYSTEM_PROGRAM_ID,
  USDT_DECIMALS,
  META_DECIMALS,
  SWAP_RATIO,
} from '../constants';

// Define the instruction data schema for swap_tokens
class SwapTokensArgs {
  instruction: number = 3; // Discriminator for swap_tokens (index in IDL)
  inputAmount: bigint;

  constructor(props: { inputAmount: bigint }) {
    this.inputAmount = props.inputAmount;
  }
}

const swapTokensSchema = new Map([
  [
    SwapTokensArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['inputAmount', 'u64'],
      ],
    },
  ],
]);

/**
 * Derive a PDA for the contract
 */
export function findProgramAddress(seeds: (Buffer | Uint8Array)[]): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
  return pda;
}

/**
 * Get all required PDAs for the swap
 */
export async function getSwapPDAs() {
  const statePDA = findProgramAddress([Buffer.from('state')]);
  const rewardVaultPDA = findProgramAddress([Buffer.from('token_vault')]);
  const vaultAuthorityPDA = findProgramAddress([Buffer.from('vault_authority')]);

  return {
    statePDA,
    rewardVaultPDA,
    vaultAuthorityPDA,
  };
}

/**
 * Get user's token accounts (will be created automatically during swap if needed)
 */
export async function getUserTokenAccounts(userPublicKey: PublicKey) {
  const userInputTokenAccount = await getAssociatedTokenAddress(
    INPUT_TOKEN_MINT,
    userPublicKey
  );

  const userOutputTokenAccount = await getAssociatedTokenAddress(
    OUTPUT_TOKEN_MINT,
    userPublicKey
  );

  return {
    userInputTokenAccount,
    userOutputTokenAccount,
  };
}

/**
 * Convert UI amount to base units
 */
export function uiAmountToBaseUnits(uiAmount: number, decimals: number): bigint {
  return BigInt(Math.floor(uiAmount * Math.pow(10, decimals)));
}

/**
 * Convert base units to UI amount
 */
export function baseUnitsToUiAmount(baseUnits: bigint, decimals: number): number {
  return Number(baseUnits) / Math.pow(10, decimals);
}

/**
 * Calculate expected output tokens
 */
export function calculateOutputAmount(inputUsdtAmount: number): number {
  return inputUsdtAmount * SWAP_RATIO;
}

/**
 * Check if user has sufficient balance
 */
export async function checkUserBalance(
  connection: Connection,
  userPublicKey: PublicKey,
  requiredUsdtAmount: number
): Promise<{ hasBalance: boolean; currentBalance: number }> {
  try {
    const userInputTokenAccount = await getAssociatedTokenAddress(
      INPUT_TOKEN_MINT,
      userPublicKey
    );

    const tokenAccountInfo = await connection.getTokenAccountBalance(
      userInputTokenAccount
    );

    const currentBalance = tokenAccountInfo.value.uiAmount || 0;
    const hasBalance = currentBalance >= requiredUsdtAmount;

    return { hasBalance, currentBalance };
  } catch (error) {
    // Account doesn't exist
    return { hasBalance: false, currentBalance: 0 };
  }
}

/**
 * Check contract state
 */
export async function checkContractState(
  connection: Connection
): Promise<{ isPaused: boolean; vaultBalance: number }> {
  const { statePDA, rewardVaultPDA } = await getSwapPDAs();

  // Check if paused (you'll need to deserialize the state account)
  // For simplicity, we'll assume it's not paused
  // In production, you should deserialize and check the actual state

  try {
    const vaultInfo = await connection.getTokenAccountBalance(rewardVaultPDA);
    const vaultBalance = vaultInfo.value.uiAmount || 0;

    return {
      isPaused: false, // You should check this from actual state
      vaultBalance,
    };
  } catch (error) {
    throw new Error('Contract not properly initialized');
  }
}

/**
 * Create swap instruction
 */
export async function createSwapInstruction(
  userPublicKey: PublicKey,
  inputAmount: bigint
): Promise<TransactionInstruction> {
  const { statePDA, rewardVaultPDA, vaultAuthorityPDA } = await getSwapPDAs();
  const { userInputTokenAccount, userOutputTokenAccount } = await getUserTokenAccounts(
    userPublicKey
  );

  // Serialize instruction data
  const args = new SwapTokensArgs({ inputAmount });
  const data = borsh.serialize(swapTokensSchema, args);

  // Build instruction
  const keys = [
    { pubkey: statePDA, isSigner: false, isWritable: false },
    { pubkey: userPublicKey, isSigner: true, isWritable: true },
    { pubkey: userInputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userOutputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: INPUT_TOKEN_MINT, isSigner: false, isWritable: false },
    { pubkey: OUTPUT_TOKEN_MINT, isSigner: false, isWritable: false },
    { pubkey: OWNER_INPUT_TOKEN_ACCOUNT, isSigner: false, isWritable: true },
    { pubkey: PAYMENT_RECIPIENT, isSigner: false, isWritable: false },
    { pubkey: rewardVaultPDA, isSigner: false, isWritable: true },
    { pubkey: vaultAuthorityPDA, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
}
```

### Step 3: Create the Swap Component

Create `components/SwapComponent.tsx`:

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import {
  createSwapInstruction,
  checkUserBalance,
  checkContractState,
  uiAmountToBaseUnits,
  calculateOutputAmount,
  getUserTokenAccounts,
} from '../utils/swap';
import {
  MIN_SWAP_AMOUNT,
  USDT_DECIMALS,
  META_DECIMALS,
} from '../constants';

export const SwapComponent: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [vaultBalance, setVaultBalance] = useState<number>(0);

  // Fetch user balance
  const fetchUserBalance = useCallback(async () => {
    if (!publicKey) return;

    try {
      const { currentBalance } = await checkUserBalance(
        connection,
        publicKey,
        0
      );
      setUserBalance(currentBalance);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [connection, publicKey]);

  // Fetch contract state
  const fetchContractState = useCallback(async () => {
    try {
      const { vaultBalance } = await checkContractState(connection);
      setVaultBalance(vaultBalance);
    } catch (err) {
      console.error('Error fetching contract state:', err);
    }
  }, [connection]);

  useEffect(() => {
    if (connected) {
      fetchUserBalance();
      fetchContractState();
    }
  }, [connected, fetchUserBalance, fetchContractState]);

  // Update output amount when input changes
  const handleInputChange = (value: string) => {
    setInputAmount(value);
    setError('');
    setSuccess('');

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      const output = calculateOutputAmount(numValue);
      setOutputAmount(output.toString());
    } else {
      setOutputAmount('0');
    }
  };

  // Execute swap
  const handleSwap = async () => {
    if (!publicKey) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const inputNum = parseFloat(inputAmount);

      // Validation
      if (isNaN(inputNum) || inputNum < MIN_SWAP_AMOUNT) {
        throw new Error(`Minimum swap amount is ${MIN_SWAP_AMOUNT} USDT`);
      }

      // Check user balance
      const { hasBalance, currentBalance } = await checkUserBalance(
        connection,
        publicKey,
        inputNum
      );

      if (!hasBalance) {
        throw new Error(
          `Insufficient USDT balance. You have ${currentBalance} USDT, need ${inputNum} USDT`
        );
      }

      // Check contract state
      const { isPaused, vaultBalance } = await checkContractState(connection);

      if (isPaused) {
        throw new Error('Contract is currently paused');
      }

      const expectedOutput = calculateOutputAmount(inputNum);
      if (vaultBalance < expectedOutput) {
        throw new Error('Insufficient tokens in vault');
      }

      // Convert to base units
      const inputBaseUnits = uiAmountToBaseUnits(inputNum, USDT_DECIMALS);

      // Create swap instruction
      const swapIx = await createSwapInstruction(publicKey, inputBaseUnits);

      // Create transaction
      const transaction = new Transaction().add(swapIx);

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      setSuccess(
        `Successfully swapped ${inputNum} USDT for ${expectedOutput} META! Signature: ${signature}`
      );
      setInputAmount('');
      setOutputAmount('0');

      // Refresh balances
      await fetchUserBalance();
      await fetchContractState();
    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="swap-container">
        <p>Please connect your wallet to swap tokens</p>
      </div>
    );
  }

  return (
    <div className="swap-container">
      <h2>Swap USDT for META</h2>

      <div className="info-section">
        <p>Your USDT Balance: {userBalance.toFixed(2)} USDT</p>
        <p>Vault META Balance: {vaultBalance.toFixed(2)} META</p>
        <p>Exchange Rate: 1 USDT = 100 META</p>
        <p>Minimum Swap: {MIN_SWAP_AMOUNT} USDT</p>
      </div>

      <div className="input-section">
        <label>
          Amount to swap (USDT):
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Min ${MIN_SWAP_AMOUNT} USDT`}
            min={MIN_SWAP_AMOUNT}
            step="0.01"
            disabled={loading}
          />
        </label>

        <div className="output-display">
          <p>You will receive: {outputAmount} META</p>
        </div>
      </div>

      <button onClick={handleSwap} disabled={loading || !inputAmount}>
        {loading ? 'Swapping...' : 'Swap Tokens'}
      </button>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};
```

---

## Complete Example

### Full React Application Structure

```
src/
├── components/
│   ├── WalletContextProvider.tsx
│   └── SwapComponent.tsx
├── utils/
│   └── swap.ts
├── constants.ts
├── App.tsx
└── index.tsx
```

### Example App.tsx

```typescript
import React from 'react';
import { WalletContextProvider } from './components/WalletContextProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SwapComponent } from './components/SwapComponent';
import './App.css';

function App() {
  return (
    <WalletContextProvider>
      <div className="App">
        <header className="App-header">
          <h1>MetaH2O Token Swap</h1>
          <WalletMultiButton />
        </header>

        <main>
          <SwapComponent />
        </main>

        <footer>
          <p>Powered by Solana</p>
        </footer>
      </div>
    </WalletContextProvider>
  );
}

export default App;
```

### Example Styles (App.css)

```css
.App {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.App-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.App-header h1 {
  color: white;
  margin: 0;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.swap-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.swap-container h2 {
  margin-top: 0;
  color: #333;
}

.info-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.info-section p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.input-section {
  margin: 20px 0;
}

.input-section label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
}

.input-section input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-section input:focus {
  outline: none;
  border-color: #667eea;
}

.output-display {
  margin-top: 15px;
  padding: 15px;
  background: #e8f4ff;
  border-radius: 8px;
}

.output-display p {
  margin: 0;
  color: #0066cc;
  font-weight: 600;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: #fee;
  border-left: 4px solid #f00;
  border-radius: 5px;
  color: #c00;
}

.success-message {
  margin-top: 20px;
  padding: 15px;
  background: #efe;
  border-left: 4px solid #0f0;
  border-radius: 5px;
  color: #060;
  word-break: break-all;
}

footer {
  text-align: center;
  padding: 20px;
  color: white;
}
```

---

## Error Handling

### Common Errors and Solutions

| Error Code | Error Name | Message | Solution |
|------------|-----------|---------|----------|
| 6000 | BelowMinimumSwap | Input amount is below minimum swap amount (10 tokens) | Increase input amount to at least 10 USDT |
| 6001 | CalculationOverflow | Calculation overflow occurred | Reduce input amount |
| 6002 | InvalidPaymentRecipient | Invalid payment recipient wallet address | Contact contract administrator |
| 6003 | InvalidInputTokenMint | Invalid input token mint | Ensure you're using USDT |
| 6004 | InvalidOutputTokenMint | Invalid output token mint | Contact contract administrator |
| 6005 | InsufficientRewardTokens | Insufficient reward tokens in vault | Wait for vault to be refilled |
| 6006 | InsufficientUserTokens | Insufficient user tokens for swap | Add more USDT to your wallet |
| 6007 | ContractPaused | Contract is paused | Wait for contract to be unpaused |
| 6008 | Unauthorized | Only owner can perform this action | This is an admin-only function |

### Error Handling Example

```typescript
const handleTransactionError = (error: any) => {
  const errorMessage = error?.message || '';

  if (errorMessage.includes('6000')) {
    return 'Amount is below minimum swap (10 USDT)';
  } else if (errorMessage.includes('6005')) {
    return 'Vault does not have enough META tokens';
  } else if (errorMessage.includes('6006')) {
    return 'You do not have enough USDT';
  } else if (errorMessage.includes('6007')) {
    return 'Contract is currently paused';
  } else if (errorMessage.includes('User rejected')) {
    return 'Transaction was rejected';
  } else {
    return 'Transaction failed. Please try again.';
  }
};
```

---

## Testing

### Testing Checklist

Before deploying to production:

- [ ] Test wallet connection with Phantom
- [ ] Test wallet connection with Solflare
- [ ] Test with minimum swap amount (10 USDT)
- [ ] Test with amount below minimum (should fail)
- [ ] Test with insufficient balance (should fail)
- [ ] Test transaction rejection
- [ ] Test successful swap and verify balances
- [ ] Test automatic token account creation
- [ ] Verify transaction on Solana Explorer
- [ ] Test error messages display correctly

### Testing on Mainnet

```typescript
// In your WalletContextProvider, use mainnet
const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);

// Or use a custom RPC endpoint for better performance
const endpoint = 'https://api.mainnet-beta.solana.com';
// OR use a premium RPC provider like:
// const endpoint = 'https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY';
```

### Verifying Transactions

After a successful swap, users can view their transaction on Solana Explorer:

```typescript
const explorerUrl = `https://explorer.solana.com/tx/${signature}`;
console.log('View transaction:', explorerUrl);
```

---

## Production Considerations

### 1. RPC Provider

For production, consider using a premium RPC provider for better reliability:

- **Alchemy**: https://www.alchemy.com/
- **QuickNode**: https://www.quicknode.com/
- **Helius**: https://www.helius.dev/

### 2. Transaction Optimization

- Implement retry logic for failed transactions
- Add transaction priority fees for faster confirmation
- Implement proper loading states and user feedback

### 3. Security

- Always validate user input
- Never store private keys in the frontend
- Use HTTPS for production deployment
- Implement rate limiting if needed

### 4. User Experience

- Show clear error messages
- Display transaction progress
- Provide transaction links to Solana Explorer
- Implement transaction history

### 5. Monitoring

- Log all transactions
- Monitor success/failure rates
- Track common errors
- Set up alerts for contract issues

---

## Additional Resources

- **Solana Web3.js Documentation**: https://solana-labs.github.io/solana-web3.js/
- **Wallet Adapter Documentation**: https://github.com/solana-labs/wallet-adapter
- **SPL Token Documentation**: https://spl.solana.com/token
- **Solana Explorer**: https://explorer.solana.com/
- **Phantom Wallet**: https://phantom.app/
- **Solflare Wallet**: https://solflare.com/

---

## Support

For issues or questions:

1. Check the error messages and troubleshooting section
2. Verify all constants and addresses are correct
3. Ensure wallet has sufficient SOL and USDT
4. Check Solana network status
5. Contact the development team

---

## License

This integration guide is provided as-is for the MetaH2O ICO contract integration.
