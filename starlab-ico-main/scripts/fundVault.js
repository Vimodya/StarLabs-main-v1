import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { mintTo } from '@solana/spl-token';
import fs from 'fs';

async function fundVault() {
    console.log("Starting Vault Funding Process...");
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Load your wallet that has the Mint Authority
    const secretKeyString = fs.readFileSync('./authority-wallet.json', 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const payer = Keypair.fromSecretKey(secretKey);

    const programId = new PublicKey("BzGwMb1Cp6P16CzYEiZUN3wfVCCz59Lwj3zV7EWtPDWr");
    const starMint = new PublicKey("Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF");

    // Derive the Vault PDA Address
    const [vaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("token_vault")],
        programId
    );

    console.log("Vault Address derived:", vaultPDA.toBase58());
    console.log("Transferring 500,000 STAR tokens into the Vault...");

    // Mint 500,000 tokens (with 6 decimals) directly to the Vault!
    try {
        const txSignature = await mintTo(
            connection,
            payer,
            starMint,
            vaultPDA, // Destination is the Vault!
            payer.publicKey, // Mint Authority
            500_000 * 1_000_000 // 500,000 Tokens
        );
        console.log("==============================================");
        console.log("✅ SUCCESS! The Vault is fully funded and ready.");
        console.log("Transaction Signature:", txSignature);
        console.log("==============================================");
    } catch (e) {
        console.error("Failed to fund vault! Error:", e);
    }
}

fundVault().catch(console.error);
