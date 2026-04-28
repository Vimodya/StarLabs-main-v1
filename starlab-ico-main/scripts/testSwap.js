import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import fs from "fs";
import crypto from "crypto";
import BN from "bn.js";

async function testSwap() {
    console.log("=== Testing Smart Contract Swap Flow via Raw Transaction ===");

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const secretKeyString = fs.readFileSync("./authority-wallet.json", "utf-8");
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const userWallet = Keypair.fromSecretKey(secretKey);

    const programId = new PublicKey("BzGwMb1Cp6P16CzYEiZUN3wfVCCz59Lwj3zV7EWtPDWr");
    const usdtMint = new PublicKey("6gWLtgTa3oS1UTa4Q4Qevu5AwYwT9ohnh8MQZwTL1xVh");
    const starMint = new PublicKey("Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF");
    const treasuryWallet = new PublicKey("9UCKSVjTtxxSCyuLf38WW69Z4D4wzNxt7w9AN8rE2bPn");

    const [statePDA] = PublicKey.findProgramAddressSync([Buffer.from("state")], programId);
    const [vaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("token_vault")], programId);
    const [vaultAuthPDA] = PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], programId);

    const userInputAta = await getAssociatedTokenAddress(usdtMint, userWallet.publicKey);
    const userOutputAta = await getAssociatedTokenAddress(starMint, userWallet.publicKey);
    const ownerInputAta = await getAssociatedTokenAddress(usdtMint, treasuryWallet);

    console.log("User wallet buying tokens:", userWallet.publicKey.toBase58());
    console.log("Input Amount: 10 Dummy USDT");

    // "global:swap_tokens" discriminator
    const discriminator = crypto.createHash("sha256").update("global:swap_tokens").digest().slice(0, 8);
    const amountData = Buffer.from(new BN(10 * 1_000_000).toArray("le", 8));
    const data = Buffer.concat([discriminator, amountData]);

    const ix = new TransactionInstruction({
        programId: programId,
        data: data,
        keys: [
            { pubkey: statePDA, isSigner: false, isWritable: true },
            { pubkey: userWallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: userInputAta, isSigner: false, isWritable: true },
            { pubkey: userOutputAta, isSigner: false, isWritable: true },
            { pubkey: usdtMint, isSigner: false, isWritable: false },
            { pubkey: starMint, isSigner: false, isWritable: false },
            { pubkey: ownerInputAta, isSigner: false, isWritable: true },
            { pubkey: treasuryWallet, isSigner: false, isWritable: false },
            { pubkey: vaultPDA, isSigner: false, isWritable: true },
            { pubkey: vaultAuthPDA, isSigner: false, isWritable: false },
            { pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), isSigner: false, isWritable: false },
            { pubkey: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), isSigner: false, isWritable: false },
            { pubkey: new PublicKey("11111111111111111111111111111111"), isSigner: false, isWritable: false },
        ]
    });

    const tx = new Transaction().add(ix);

    try {
        const sig = await connection.sendTransaction(tx, [userWallet]);
        console.log("✅ Swap successful!");
        console.log("Transaction Signature:", sig);
        console.log("Check it on Solana Explorer: https://explorer.solana.com/tx/" + sig + "?cluster=devnet");
    } catch (e) {
        console.error("❌ Swap failed:", e);
    }
}

testSwap().catch(console.error);
