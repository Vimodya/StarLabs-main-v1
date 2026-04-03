import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import fs from 'fs';

const WALLET_PATH = './authority-wallet.json';

async function createNewToken() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  let payer;

  // 1. Load or Generate Wallet
  if (fs.existsSync(WALLET_PATH)) {
    const secretKeyString = fs.readFileSync(WALLET_PATH, 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    payer = Keypair.fromSecretKey(secretKey);
    console.log(`Loaded existing wallet: ${payer.publicKey.toBase58()}`);
  } else {
    payer = Keypair.generate();
    fs.writeFileSync(WALLET_PATH, JSON.stringify(Array.from(payer.secretKey)));
    console.log(`=========================================`);
    console.log(` NEW WALLET GENERATED!`);
    console.log(` Wallet Public Key: ${payer.publicKey.toBase58()}`);
    console.log(` Secret key saved to: ${WALLET_PATH}`);
    console.log(`=========================================\n`);
    console.log(`ACTION REQUIRED: `);
    console.log(`You need Devnet SOL to pay for the token creation.`);
    console.log(`1. Go to https://faucet.solana.com`);
    console.log(`2. Paste your Wallet Public Key: ${payer.publicKey.toBase58()}`);
    console.log(`3. Request 1 or 2 SOL (Devnet).`);
    console.log(`4. Once you have received the SOL, RUN THIS SCRIPT AGAIN.\n`);
    return;
  }

  // 2. Check Balance
  const balance = await connection.getBalance(payer.publicKey);
  console.log(`Current Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance < 0.05 * LAMPORTS_PER_SOL) {
    console.log(`\nERROR: Not enough SOL in your wallet.`);
    console.log(`Please go to https://faucet.solana.com and request Devnet SOL for ${payer.publicKey.toBase58()}`);
    return;
  }

  console.log('Creating SPL Token Mint (This can take a few seconds)...');
  
  try {
    const mint = await createMint(
      connection,
      payer, // Payer of the transaction
      payer.publicKey, // Mint Authority
      payer.publicKey, // Freeze Authority
      6 // 6 decimals (standard)
    );
    console.log(`\n=================================================`);
    console.log(`✨ Token Mint Created Successfully!`);
    console.log(`Mint Address: ${mint.toBase58()}`);
    console.log(`=================================================\n`);

    console.log('Creating an Associated Token Account to hold your tokens...');
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );
    console.log(`Associated Token Account Address: ${tokenAccount.address.toBase58()}`);

    console.log('Minting 1,000,000 tokens to your account...');
    // 1,000,000 tokens * 10^6 decimals = 1,000,000,000,000
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer.publicKey,
      1000000000000
    );

    console.log(`\n=================================================`);
    console.log(`🚀 SUCCESS!`);
    console.log(`- You minted 1,000,000 tokens.`);
    console.log(`- Token Address (Mint): ${mint.toBase58()}`);
    console.log(`- You can view this token by pasting the Mint Address on https://explorer.solana.com/?cluster=devnet`);
    console.log(`=================================================\n`);
    
  } catch (error) {
    console.error("🚨 Failed to generate token! Error details below:");
    console.error(error);
  }
}

createNewToken().catch(err => {
  console.error("Fatal Script Error:", err);
});
