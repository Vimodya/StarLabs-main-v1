import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import fs from 'fs';

async function prepTest() {
    console.log("Preparing Test Environment...");
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Admin Wallet (Has Mint Authority for both tokens)
    const secretKeyString = fs.readFileSync('./authority-wallet.json', 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const admin = Keypair.fromSecretKey(secretKey);

    // Mints
    const starMint = new PublicKey("Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF");
    const usdtMint = new PublicKey("6gWLtgTa3oS1UTa4Q4Qevu5AwYwT9ohnh8MQZwTL1xVh");
    
    // User / Treasury Wallet
    const userWallet = new PublicKey("9UCKSVjTtxxSCyuLf38WW69Z4D4wzNxt7w9AN8rE2bPn");

    // 1. Create Treasury USDT Account (Required to receive payments)
    console.log("Setting up Treasury USDT Account...");
    const treasuryUsdtAta = await getOrCreateAssociatedTokenAccount(
        connection,
        admin,
        usdtMint,
        userWallet // Treasury Wallet
    );
    console.log("Treasury USDT Account:", treasuryUsdtAta.address.toBase58());

    // 2. Mint test USDT to the User Wallet so they can buy STAR tokens!
    console.log("Minting 5,000 Dummy USDT to your Wallet for testing...");
    await mintTo(
        connection,
        admin,
        usdtMint,
        treasuryUsdtAta.address,
        admin.publicKey,
        5_000 * 1_000_000 // 5000 USDT (6 decimals)
    );

    console.log("✅ Ready! Your wallet (" + userWallet.toBase58() + ") now has the required USDT Accounts and 5000 Test USDT.");
}

prepTest().catch(console.error);
