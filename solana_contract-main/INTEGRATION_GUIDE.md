# Integration Guide - Adding Swap to Your Existing Website

## What You Need

Your smart contract is already deployed at:
- **Program ID**: `4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44`
- **Network**: Solana Mainnet

## Three Integration Methods

---

## Method 1: Pure HTML/JavaScript (Easiest)

Add these script tags to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>MetaH2O ICO</title>

    <!-- Required libraries -->
    <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
    <script src="https://unpkg.com/@project-serum/anchor@latest/dist/browser/index.js"></script>
</head>
<body>
    <!-- Your existing website content -->

    <div id="swap-section">
        <button id="connectBtn" onclick="connectWallet()">Connect Wallet</button>
        <div id="walletInfo" style="display:none;">
            <p>Connected: <span id="walletAddress"></span></p>

            <input type="number" id="usdtAmount" placeholder="Enter USDT amount" min="10" step="0.01">
            <p>You will receive: <span id="metaAmount">0</span> META</p>

            <button onclick="executeSwap()">Swap Tokens</button>
        </div>
    </div>

    <script>
        // Configuration
        const PROGRAM_ID = "4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44";
        const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
        const META_MINT = "Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF";
        const PAYMENT_RECIPIENT = "2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng";

        let wallet = null;

        // Connect wallet function
        async function connectWallet() {
            try {
                if (window.solana?.isPhantom) {
                    await window.solana.connect();
                    wallet = window.solana;
                } else if (window.solflare?.isSolflare) {
                    await window.solflare.connect();
                    wallet = window.solflare;
                } else {
                    alert("Please install Phantom or Solflare wallet!");
                    return;
                }

                document.getElementById('walletAddress').textContent =
                    wallet.publicKey.toString().slice(0, 4) + '...' +
                    wallet.publicKey.toString().slice(-4);
                document.getElementById('connectBtn').style.display = 'none';
                document.getElementById('walletInfo').style.display = 'block';

                console.log("Connected:", wallet.publicKey.toString());
            } catch (error) {
                alert("Connection failed: " + error.message);
            }
        }

        // Calculate META amount
        document.getElementById('usdtAmount')?.addEventListener('input', (e) => {
            const usdt = parseFloat(e.target.value) || 0;
            document.getElementById('metaAmount').textContent = (usdt * 100).toFixed(2);
        });

        // Execute swap function
        async function executeSwap() {
            if (!wallet) {
                alert("Please connect wallet first!");
                return;
            }

            const usdtAmount = parseFloat(document.getElementById('usdtAmount').value);

            if (usdtAmount < 10) {
                alert("Minimum swap amount is 10 USDT");
                return;
            }

            try {
                // Load your IDL
                const idlResponse = await fetch('/path/to/metah2o_ico_contract.json');
                const idl = await idlResponse.json();

                // Create connection
                const connection = new solanaWeb3.Connection(
                    'https://api.mainnet-beta.solana.com'
                );

                // Create provider
                const provider = new anchor.AnchorProvider(
                    connection,
                    wallet,
                    { commitment: 'confirmed' }
                );

                // Initialize program
                const programId = new solanaWeb3.PublicKey(PROGRAM_ID);
                const program = new anchor.Program(idl, programId, provider);

                // Convert amount (USDT has 6 decimals)
                const inputAmount = new anchor.BN(usdtAmount * 1_000_000);

                // Derive PDAs
                const [statePda] = solanaWeb3.PublicKey.findProgramAddressSync(
                    [Buffer.from("state")],
                    programId
                );

                const [vaultPda] = solanaWeb3.PublicKey.findProgramAddressSync(
                    [Buffer.from("token_vault")],
                    programId
                );

                const [vaultAuthority] = solanaWeb3.PublicKey.findProgramAddressSync(
                    [Buffer.from("vault_authority")],
                    programId
                );

                // Get associated token addresses
                const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey(
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                );
                const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey(
                    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
                );

                const userInputAta = await getAssociatedTokenAddress(
                    new solanaWeb3.PublicKey(USDT_MINT),
                    wallet.publicKey,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );

                const userOutputAta = await getAssociatedTokenAddress(
                    new solanaWeb3.PublicKey(META_MINT),
                    wallet.publicKey,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );

                const ownerInputAta = await getAssociatedTokenAddress(
                    new solanaWeb3.PublicKey(USDT_MINT),
                    new solanaWeb3.PublicKey(PAYMENT_RECIPIENT),
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );

                // Execute swap
                const tx = await program.methods
                    .swapTokens(inputAmount)
                    .accounts({
                        state: statePda,
                        user: wallet.publicKey,
                        userInputTokenAccount: userInputAta,
                        userOutputTokenAccount: userOutputAta,
                        inputTokenMint: new solanaWeb3.PublicKey(USDT_MINT),
                        outputTokenMint: new solanaWeb3.PublicKey(META_MINT),
                        ownerInputTokenAccount: ownerInputAta,
                        ownerWallet: new solanaWeb3.PublicKey(PAYMENT_RECIPIENT),
                        rewardVault: vaultPda,
                        vaultAuthority: vaultAuthority,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                        systemProgram: solanaWeb3.SystemProgram.programId,
                    })
                    .rpc();

                alert(`Success! View transaction: https://solscan.io/tx/${tx}`);
                console.log("Transaction:", tx);

            } catch (error) {
                console.error("Swap error:", error);
                alert("Swap failed: " + error.message);
            }
        }

        // Helper: Get associated token address
        async function getAssociatedTokenAddress(mint, owner, tokenProgramId, ataProgram) {
            const [address] = await solanaWeb3.PublicKey.findProgramAddress(
                [
                    owner.toBuffer(),
                    tokenProgramId.toBuffer(),
                    mint.toBuffer(),
                ],
                ataProgram
            );
            return address;
        }
    </script>
</body>
</html>
```

---

## Method 2: Using npm packages (Recommended for React/Next.js)

### Step 1: Install dependencies

```bash
npm install @solana/web3.js @coral-xyz/anchor @solana/spl-token @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui
```

### Step 2: Use the swap component

```javascript
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';

// Import your IDL
import idl from './metah2o_ico_contract.json';

export function SwapComponent() {
    const wallet = useWallet();

    async function handleSwap(usdtAmount) {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const provider = new AnchorProvider(connection, wallet, {});
        const program = new Program(idl, PROGRAM_ID, provider);

        // ... (use the account derivation code from above)

        const tx = await program.methods
            .swapTokens(new BN(usdtAmount * 1_000_000))
            .accounts({ /* accounts here */ })
            .rpc();

        return tx;
    }

    return (
        <div>
            <button onClick={() => handleSwap(10)}>Swap 10 USDT</button>
        </div>
    );
}
```

---

## Method 3: Backend API (For security)

Create a backend endpoint that handles swaps:

```javascript
// backend/swap.js
const anchor = require('@coral-xyz/anchor');
const { Connection, Keypair } = require('@solana/web3.js');

app.post('/api/swap', async (req, res) => {
    const { userPublicKey, usdtAmount } = req.body;

    // Create transaction
    // Sign with your backend wallet (if needed)
    // Return transaction for user to sign

    res.json({ transaction: tx });
});
```

---

## Key Integration Points

### 1. Connect Wallet
```javascript
await window.solana.connect(); // Phantom
// or
await window.solflare.connect(); // Solflare
```

### 2. Call Swap Function
```javascript
const tx = await program.methods
    .swapTokens(inputAmount)  // Amount in smallest units
    .accounts({ /* all required accounts */ })
    .rpc();
```

### 3. Required Accounts for Swap:
- `state` - Program state PDA
- `user` - User's wallet
- `userInputTokenAccount` - User's USDT account
- `userOutputTokenAccount` - User's META account
- `inputTokenMint` - USDT mint
- `outputTokenMint` - META mint
- `ownerInputTokenAccount` - Payment recipient's USDT account
- `ownerWallet` - Payment recipient address
- `rewardVault` - Token vault PDA
- `vaultAuthority` - Vault authority PDA

---

## Important Notes

1. **IDL File**: You need to serve your IDL file (`target/idl/metah2o_ico_contract.json`) so the frontend can access it

2. **RPC Endpoint**: Use a paid RPC for production:
   - Helius: https://helius.xyz
   - QuickNode: https://quicknode.com
   - Alchemy: https://alchemy.com

3. **Amount Conversion**: USDT has 6 decimals, so multiply by 1,000,000

4. **Minimum Amount**: 10 USDT minimum

5. **Rate**: 1 USDT = 100 META (fixed ratio)

---

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] UI shows correct conversion (1 USDT → 100 META)
- [ ] Transaction requires user approval
- [ ] Success shows transaction link
- [ ] Error messages are user-friendly
- [ ] Works with both Phantom and Solflare
- [ ] Token accounts are created if needed
- [ ] Vault has sufficient META tokens

---

## Need Help?

Check the files in the `web/` folder for complete working examples:
- `web/index.html` - Standalone HTML demo
- `web/swap-component.jsx` - React component
- `web/simple-integration.js` - Vanilla JS implementation
