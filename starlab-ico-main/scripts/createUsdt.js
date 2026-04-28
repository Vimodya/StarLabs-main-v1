import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import fs from 'fs';

async function main() {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const secretKeyString = fs.readFileSync('./authority-wallet.json', 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const payer = Keypair.fromSecretKey(secretKey);

    const mint = await createMint(connection, payer, payer.publicKey, null, 6);
    console.log("DUMMY_USDT_MINT=" + mint.toBase58());

    const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
    await mintTo(connection, payer, mint, ata.address, payer.publicKey, 1_000_000 * 1000000); // 1 Million USDT
}
main().catch(console.error);
