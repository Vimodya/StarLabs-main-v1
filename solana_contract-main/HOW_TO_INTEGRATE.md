# How to Integrate MetaH2O Swap into Your Website

## Overview

Your smart contract is deployed and ready. You just need to add a few lines of code to your website to let users swap USDT for META tokens.

**Contract Details:**
- Program ID: `4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44`
- Network: Solana Mainnet
- Swap Rate: 1 USDT = 100 META
- Minimum: 10 USDT

---

## Step-by-Step Integration

### Step 1: Add Required Libraries

Add these script tags to your HTML `<head>` section:

```html
<script src="https://unpkg.com/@solana/web3.js@1.95.8/lib/index.iife.min.js"></script>
<script src="https://unpkg.com/@coral-xyz/anchor@0.29.0/dist/browser/index.js"></script>
```

### Step 2: Add the IDL File

Copy your IDL file to your website's public folder:
- From: `target/idl/metah2o_ico_contract.json`
- To: Your website's `/public/` or `/assets/` folder

### Step 3: Add HTML Elements

Add these to your webpage wherever you want the swap interface:

```html
<!-- Wallet Connection -->
<button id="connectWalletBtn" onclick="connectWallet()">
    Connect Wallet
</button>

<div id="walletConnected" style="display:none;">
    <!-- Show connected wallet -->
    <p>Wallet: <span id="walletAddress"></span></p>
    <button onclick="disconnectWallet()">Disconnect</button>

    <!-- Swap Interface -->
    <div>
        <label>USDT Amount:</label>
        <input type="number" id="usdtInput" min="10" step="0.01" placeholder="Enter USDT amount">

        <p>You will receive: <span id="metaOutput">0</span> META tokens</p>

        <button id="swapBtn" onclick="performSwap()">Swap Tokens</button>

        <div id="statusMessage"></div>
    </div>
</div>
```

### Step 4: Add the JavaScript Code

Add this complete JavaScript code to your page (or in a separate .js file):

```javascript
// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    PROGRAM_ID: "4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44",
    USDT_MINT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    META_MINT: "Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF",
    PAYMENT_RECIPIENT: "2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng",
    RPC_URL: "https://api.mainnet-beta.solana.com", // Use paid RPC for production!
    IDL_PATH: "/public/metah2o_ico_contract.json" // Update this path!
};

let currentWallet = null;
let anchorProgram = null;

// ============================================
// FUNCTION 1: CONNECT WALLET
// ============================================
async function connectWallet() {
    try {
        let wallet = null;

        // Try Phantom
        if (window.solana?.isPhantom) {
            await window.solana.connect();
            wallet = window.solana;
            console.log("Connected to Phantom");
        }
        // Try Solflare
        else if (window.solflare?.isSolflare) {
            await window.solflare.connect();
            wallet = window.solflare;
            console.log("Connected to Solflare");
        }
        else {
            showStatus("Please install Phantom or Solflare wallet!", "error");
            window.open("https://phantom.app", "_blank");
            return;
        }

        currentWallet = wallet;

        // Update UI
        document.getElementById('connectWalletBtn').style.display = 'none';
        document.getElementById('walletConnected').style.display = 'block';
        document.getElementById('walletAddress').textContent =
            wallet.publicKey.toString().slice(0, 4) + '...' +
            wallet.publicKey.toString().slice(-4);

        showStatus("Wallet connected successfully!", "success");

        // Initialize the program
        await initializeProgram();

    } catch (error) {
        console.error("Connection error:", error);
        showStatus("Failed to connect: " + error.message, "error");
    }
}

// ============================================
// FUNCTION 2: DISCONNECT WALLET
// ============================================
async function disconnectWallet() {
    if (currentWallet) {
        await currentWallet.disconnect();
        currentWallet = null;
        anchorProgram = null;
    }

    document.getElementById('connectWalletBtn').style.display = 'block';
    document.getElementById('walletConnected').style.display = 'none';
    document.getElementById('usdtInput').value = '';
    document.getElementById('metaOutput').textContent = '0';
    showStatus("", "");
}

// ============================================
// FUNCTION 3: INITIALIZE ANCHOR PROGRAM
// ============================================
async function initializeProgram() {
    try {
        // Load IDL
        const response = await fetch(CONFIG.IDL_PATH);
        const idl = await response.json();

        // Create connection
        const connection = new solanaWeb3.Connection(CONFIG.RPC_URL, 'confirmed');

        // Create provider
        const provider = new anchor.AnchorProvider(
            connection,
            currentWallet,
            { commitment: 'confirmed' }
        );

        // Initialize program
        const programId = new solanaWeb3.PublicKey(CONFIG.PROGRAM_ID);
        anchorProgram = new anchor.Program(idl, programId, provider);

        console.log("Program initialized successfully");

    } catch (error) {
        console.error("Failed to initialize program:", error);
        showStatus("Failed to initialize program: " + error.message, "error");
    }
}

// ============================================
// FUNCTION 4: PERFORM TOKEN SWAP (MAIN FUNCTION)
// ============================================
async function performSwap() {
    if (!currentWallet || !anchorProgram) {
        showStatus("Please connect your wallet first!", "error");
        return;
    }

    const usdtAmount = parseFloat(document.getElementById('usdtInput').value);

    // Validate amount
    if (!usdtAmount || usdtAmount < 10) {
        showStatus("Minimum swap amount is 10 USDT", "error");
        return;
    }

    showStatus("Processing swap...", "info");
    document.getElementById('swapBtn').disabled = true;

    try {
        // Convert USDT amount to smallest units (USDT has 6 decimals)
        const inputAmount = new anchor.BN(Math.floor(usdtAmount * 1_000_000));

        // Derive Program Derived Addresses (PDAs)
        const programId = new solanaWeb3.PublicKey(CONFIG.PROGRAM_ID);

        const [statePda] = solanaWeb3.PublicKey.findProgramAddressSync(
            [Buffer.from("state")],
            programId
        );

        const [vaultPda] = solanaWeb3.PublicKey.findProgramAddressSync(
            [Buffer.from("token_vault")],
            programId
        );

        const [vaultAuthorityPda] = solanaWeb3.PublicKey.findProgramAddressSync(
            [Buffer.from("vault_authority")],
            programId
        );

        // Token program IDs
        const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        );
        const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey(
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        );

        // Get user's token accounts
        const userInputTokenAccount = await getAssociatedTokenAddress(
            new solanaWeb3.PublicKey(CONFIG.USDT_MINT),
            currentWallet.publicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const userOutputTokenAccount = await getAssociatedTokenAddress(
            new solanaWeb3.PublicKey(CONFIG.META_MINT),
            currentWallet.publicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        // Get payment recipient's token account
        const ownerInputTokenAccount = await getAssociatedTokenAddress(
            new solanaWeb3.PublicKey(CONFIG.USDT_MINT),
            new solanaWeb3.PublicKey(CONFIG.PAYMENT_RECIPIENT),
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        // Execute the swap transaction
        const txSignature = await anchorProgram.methods
            .swapTokens(inputAmount)
            .accounts({
                state: statePda,
                user: currentWallet.publicKey,
                userInputTokenAccount: userInputTokenAccount,
                userOutputTokenAccount: userOutputTokenAccount,
                inputTokenMint: new solanaWeb3.PublicKey(CONFIG.USDT_MINT),
                outputTokenMint: new solanaWeb3.PublicKey(CONFIG.META_MINT),
                ownerInputTokenAccount: ownerInputTokenAccount,
                ownerWallet: new solanaWeb3.PublicKey(CONFIG.PAYMENT_RECIPIENT),
                rewardVault: vaultPda,
                vaultAuthority: vaultAuthorityPda,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: solanaWeb3.SystemProgram.programId,
            })
            .rpc();

        console.log("Swap successful! Transaction:", txSignature);

        // Show success message
        const metaAmount = usdtAmount * 100;
        showStatus(
            `Success! Swapped ${usdtAmount} USDT for ${metaAmount} META. ` +
            `<a href="https://solscan.io/tx/${txSignature}" target="_blank">View Transaction</a>`,
            "success"
        );

        // Clear input
        document.getElementById('usdtInput').value = '';
        document.getElementById('metaOutput').textContent = '0';

    } catch (error) {
        console.error("Swap failed:", error);

        // Parse error message
        let errorMsg = "Swap failed: ";
        if (error.message.includes("0x1771")) {
            errorMsg += "Insufficient tokens in vault. Please contact support.";
        } else if (error.message.includes("0x1")) {
            errorMsg += "Insufficient USDT balance in your wallet.";
        } else if (error.message.includes("User rejected")) {
            errorMsg += "Transaction cancelled by user.";
        } else {
            errorMsg += error.message;
        }

        showStatus(errorMsg, "error");
    } finally {
        document.getElementById('swapBtn').disabled = false;
    }
}

// ============================================
// HELPER FUNCTION: Calculate META Output
// ============================================
document.getElementById('usdtInput')?.addEventListener('input', function(e) {
    const usdtAmount = parseFloat(e.target.value) || 0;
    const metaAmount = usdtAmount * 100; // 1 USDT = 100 META
    document.getElementById('metaOutput').textContent = metaAmount.toFixed(2);
});

// ============================================
// HELPER FUNCTION: Get Associated Token Address
// ============================================
async function getAssociatedTokenAddress(mint, owner, tokenProgramId, associatedTokenProgramId) {
    const [address] = await solanaWeb3.PublicKey.findProgramAddress(
        [
            owner.toBuffer(),
            tokenProgramId.toBuffer(),
            mint.toBuffer(),
        ],
        associatedTokenProgramId
    );
    return address;
}

// ============================================
// HELPER FUNCTION: Show Status Messages
// ============================================
function showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) return;

    statusElement.innerHTML = message;
    statusElement.className = 'status-' + type;

    // Auto-clear after 10 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusElement.innerHTML = '';
            statusElement.className = '';
        }, 10000);
    }
}
```

### Step 5: Add CSS (Optional but Recommended)

```css
<style>
#walletConnected {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
}

#usdtInput {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin: 10px 0;
    border: 2px solid #667eea;
    border-radius: 5px;
}

#swapBtn {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    background-color: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

#swapBtn:hover {
    background-color: #5568d3;
}

#swapBtn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.status-success {
    padding: 10px;
    background-color: #d1fae5;
    color: #065f46;
    border-radius: 5px;
    margin-top: 10px;
}

.status-error {
    padding: 10px;
    background-color: #fee2e2;
    color: #991b1b;
    border-radius: 5px;
    margin-top: 10px;
}

.status-info {
    padding: 10px;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 5px;
    margin-top: 10px;
}
</style>
```

---

## The Main Function Explained

### `performSwap()` - This is the core function

Here's what it does step by step:

1. **Validates** the USDT amount (minimum 10 USDT)
2. **Converts** the amount to smallest units (multiply by 1,000,000 for USDT's 6 decimals)
3. **Derives PDAs** (Program Derived Addresses) for:
   - Contract state
   - Token vault
   - Vault authority
4. **Gets token accounts** for:
   - User's USDT account
   - User's META account
   - Payment recipient's USDT account
5. **Calls** the smart contract's `swapTokens` method with all required accounts
6. **Shows** success message with transaction link

### Required Accounts for `swapTokens`:

| Account | Description |
|---------|-------------|
| `state` | Contract state PDA |
| `user` | User's wallet public key |
| `userInputTokenAccount` | User's USDT token account |
| `userOutputTokenAccount` | User's META token account |
| `inputTokenMint` | USDT mint address |
| `outputTokenMint` | META mint address |
| `ownerInputTokenAccount` | Payment recipient's USDT account |
| `ownerWallet` | Payment recipient's wallet |
| `rewardVault` | Contract's META token vault (PDA) |
| `vaultAuthority` | Vault authority PDA |
| `tokenProgram` | SPL Token program |
| `associatedTokenProgram` | Associated Token program |
| `systemProgram` | System program |

---

## Testing Your Integration

### Before Testing:
1. ✅ Make sure the vault is funded with META tokens
2. ✅ Get some USDT in your wallet (at least 10 USDT)
3. ✅ Use a mainnet RPC endpoint

### Test Steps:
1. Click "Connect Wallet" → Approve in Phantom/Solflare
2. Enter USDT amount (try 10 first)
3. Check that META output shows correctly (10 USDT = 1000 META)
4. Click "Swap Tokens"
5. Approve transaction in wallet
6. Wait for confirmation
7. Check transaction on Solscan
8. Verify META tokens in your wallet

---

## Common Errors and Solutions

| Error | Solution |
|-------|----------|
| "Insufficient reward tokens in vault" | Vault needs more META tokens. Fund it using the vault script |
| "Insufficient USDT balance" | User needs more USDT in their wallet |
| "User rejected transaction" | User cancelled in wallet - this is normal |
| "Failed to fetch IDL" | Check the IDL_PATH in CONFIG matches your file location |
| "Network error" | RPC endpoint might be down, try a different one |

---

## Production Checklist

Before going live:

- [ ] Replace RPC URL with paid endpoint (Helius/QuickNode)
- [ ] Fund the vault with enough META tokens
- [ ] Test with small amounts first
- [ ] Test with both Phantom and Solflare
- [ ] Add error tracking (Sentry, etc.)
- [ ] Add transaction history display
- [ ] Add balance display for USDT/META
- [ ] Set up monitoring for vault balance
- [ ] Create admin panel to pause/unpause contract

---

## Quick Reference

### Configuration:
```javascript
PROGRAM_ID: "4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44"
USDT_MINT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
META_MINT: "Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF"
```

### Key Functions:
- `connectWallet()` - Connect Phantom or Solflare
- `performSwap()` - Execute the token swap
- `disconnectWallet()` - Disconnect wallet

### Swap Formula:
```
META tokens = USDT amount × 100
Input amount in transaction = USDT amount × 1,000,000
```

---

## Need Help?

1. Check browser console for detailed errors
2. Verify transaction on https://solscan.io
3. Check the example files in the `web/` folder
4. Make sure wallet has SOL for transaction fees (~0.01 SOL)

---

## Complete Working Example

See `web/index.html` for a complete, standalone example that you can open directly in your browser to test the functionality.
