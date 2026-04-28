// Simple JavaScript integration for existing websites
// Add this to your HTML page

// ========== CONFIGURATION ==========
const CONFIG = {
    PROGRAM_ID: "4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44",
    USDT_MINT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    META_MINT: "Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF",
    PAYMENT_RECIPIENT: "2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng",
    RPC_URL: "https://api.mainnet-beta.solana.com" // Use paid RPC for production
};

// ========== WALLET CONNECTION ==========
async function connectWallet() {
    try {
        // Try Phantom first
        if (window.solana?.isPhantom) {
            await window.solana.connect();
            console.log("Connected to Phantom:", window.solana.publicKey.toString());
            return window.solana;
        }
        // Try Solflare
        else if (window.solflare?.isSolflare) {
            await window.solflare.connect();
            console.log("Connected to Solflare:", window.solflare.publicKey.toString());
            return window.solflare;
        }
        else {
            alert("Please install Phantom or Solflare wallet!");
            return null;
        }
    } catch (error) {
        console.error("Connection error:", error);
        alert("Failed to connect wallet: " + error.message);
        return null;
    }
}

// ========== TOKEN SWAP FUNCTION ==========
async function swapTokens(usdtAmount) {
    // Note: This requires @solana/web3.js and @coral-xyz/anchor libraries
    // Include them via CDN or npm

    const wallet = window.solana || window.solflare;

    if (!wallet?.publicKey) {
        alert("Please connect your wallet first!");
        return;
    }

    if (usdtAmount < 10) {
        alert("Minimum swap amount is 10 USDT");
        return;
    }

    try {
        // You need to load these libraries first:
        // <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
        // <script src="https://unpkg.com/@coral-xyz/anchor@latest/dist/browser/index.js"></script>

        const { Connection, PublicKey, SystemProgram, Transaction } = solanaWeb3;
        const { Program, AnchorProvider, BN } = anchor;

        const connection = new Connection(CONFIG.RPC_URL);

        // Create provider
        const provider = new AnchorProvider(
            connection,
            wallet,
            { commitment: 'confirmed' }
        );

        // Load program (you need to include your IDL)
        const idl = await fetch('../target/idl/metah2o_ico_contract.json').then(r => r.json());
        const program = new Program(idl, new PublicKey(CONFIG.PROGRAM_ID), provider);

        // Convert USDT amount to smallest units (6 decimals)
        const inputAmount = new BN(usdtAmount * 1_000_000);

        // Derive PDAs
        const [statePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state")],
            new PublicKey(CONFIG.PROGRAM_ID)
        );

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("token_vault")],
            new PublicKey(CONFIG.PROGRAM_ID)
        );

        const [vaultAuthority] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault_authority")],
            new PublicKey(CONFIG.PROGRAM_ID)
        );

        // Get token accounts
        const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

        const userInputTokenAccount = await getAssociatedTokenAddress(
            new PublicKey(CONFIG.USDT_MINT),
            wallet.publicKey
        );

        const userOutputTokenAccount = await getAssociatedTokenAddress(
            new PublicKey(CONFIG.META_MINT),
            wallet.publicKey
        );

        const ownerInputTokenAccount = await getAssociatedTokenAddress(
            new PublicKey(CONFIG.USDT_MINT),
            new PublicKey(CONFIG.PAYMENT_RECIPIENT)
        );

        // Execute swap
        const tx = await program.methods
            .swapTokens(inputAmount)
            .accounts({
                state: statePda,
                user: wallet.publicKey,
                userInputTokenAccount,
                userOutputTokenAccount,
                inputTokenMint: new PublicKey(CONFIG.USDT_MINT),
                outputTokenMint: new PublicKey(CONFIG.META_MINT),
                ownerInputTokenAccount,
                ownerWallet: new PublicKey(CONFIG.PAYMENT_RECIPIENT),
                rewardVault: vaultPda,
                vaultAuthority,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("Transaction signature:", tx);
        alert(`Success! Transaction: https://solscan.io/tx/${tx}`);
        return tx;

    } catch (error) {
        console.error("Swap error:", error);
        alert("Swap failed: " + error.message);
        throw error;
    }
}

// Helper function to get associated token address
async function getAssociatedTokenAddress(mint, owner) {
    const { PublicKey } = solanaWeb3;
    const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

    const [address] = await PublicKey.findProgramAddress(
        [
            owner.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return address;
}

// ========== EXAMPLE USAGE IN YOUR HTML ==========
/*
<!DOCTYPE html>
<html>
<head>
    <title>MetaH2O ICO</title>
    <!-- Include required libraries -->
    <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
    <script src="https://unpkg.com/@coral-xyz/anchor@latest/dist/browser/index.js"></script>
</head>
<body>
    <button onclick="connectWallet()">Connect Wallet</button>

    <input type="number" id="usdtAmount" placeholder="USDT Amount" min="10">
    <button onclick="swapTokens(document.getElementById('usdtAmount').value)">
        Swap Tokens
    </button>

    <script src="simple-integration.js"></script>
</body>
</html>
*/
