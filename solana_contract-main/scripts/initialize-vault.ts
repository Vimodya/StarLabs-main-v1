import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

/**
 * Script to initialize the MetaH2O ICO Contract token vault
 *
 * ⚠️ IMPORTANT: This must be signed by the ADMIN wallet
 * Admin wallet: 7Gd9QU5uEDtTBU6VbirDzdJNxew4tRSoD1iQoNC2kFtU
 *
 * Run with: anchor run initialize-vault
 */

const ADMIN_WALLET = new PublicKey("7Gd9QU5uEDtTBU6VbirDzdJNxew4tRSoD1iQoNC2kFtU");
const PAYMENT_RECIPIENT = new PublicKey("2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng");
const OUTPUT_TOKEN_MINT = new PublicKey("Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF");

async function main() {
  console.log("=== MetaH2O ICO Contract - Initialize Token Vault ===\n");

  // Configure the client to use devnet
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();

  console.log("✓ Connected to:", provider.connection.rpcEndpoint);
  console.log("✓ Wallet (admin):", provider.wallet.publicKey.toBase58());
  console.log("✓ Payment recipient:", PAYMENT_RECIPIENT.toBase58());

  // Check if current wallet is the admin
  if (!provider.wallet.publicKey.equals(ADMIN_WALLET)) {
    console.error("\n❌ ERROR: Wrong wallet!");
    console.error("   Current wallet:", provider.wallet.publicKey.toBase58());
    console.error("   Required admin wallet:", ADMIN_WALLET.toBase58());
    console.error("\n⚠️  This operation MUST be signed by the admin wallet.");
    process.exit(1);
  }

  // Check wallet balance
  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log("✓ Wallet balance:", balance / 1e9, "SOL\n");

  if (balance < 0.002 * 1e9) {
    console.error("❌ Insufficient balance. Need at least 0.002 SOL");
    console.log("Run: solana airdrop 1");
    process.exit(1);
  }

  // Load the program
  const program = anchor.workspace.Metah2oIcoContract as any;
  console.log("✓ Program ID:", program.programId.toBase58());

  // Derive PDAs
  const [statePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("state")],
    program.programId
  );
  console.log("✓ State PDA:", statePDA.toBase58());

  const [vaultPDA, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault")],
    program.programId
  );
  console.log("✓ Vault PDA:", vaultPDA.toBase58());
  console.log("  Bump:", vaultBump);

  const [vaultAuthorityPDA, authBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_authority")],
    program.programId
  );
  console.log("✓ Vault Authority PDA:", vaultAuthorityPDA.toBase58());
  console.log("  Bump:", authBump);

  console.log("✓ Output Token Mint (MetaH2O):", OUTPUT_TOKEN_MINT.toBase58());

  // Check if vault already exists
  try {
    const vaultInfo = await provider.connection.getAccountInfo(vaultPDA);
    if (vaultInfo !== null) {
      console.log("\n⚠️  Token vault already initialized!");
      console.log("   Vault address:", vaultPDA.toBase58());

      // Try to get balance
      try {
        const tokenBalance = await provider.connection.getTokenAccountBalance(vaultPDA);
        console.log("   Vault balance:", tokenBalance.value.uiAmount, "META tokens");
      } catch (err) {
        console.log("   (Could not fetch balance)");
      }

      console.log("\nNothing to do. Exiting.");
      return;
    }
  } catch (err) {
    // Account doesn't exist - this is expected
  }

  console.log("✓ Vault account not found (will create)\n");

  console.log("--- Initializing Token Vault ---\n");

  try {
    const tx = await program.methods
      .initializeVault()
      .accounts({
        state: statePDA,
        vault: vaultPDA,
        vaultAuthority: vaultAuthorityPDA,
        outputTokenMint: OUTPUT_TOKEN_MINT,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Token vault initialized successfully!");
    console.log("   Transaction signature:", tx);
    const cluster = provider.connection.rpcEndpoint.includes("devnet") ? "devnet" : "";
    const clusterParam = cluster ? `?cluster=${cluster}` : "";
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}${clusterParam}\n`);

    // Wait for confirmation
    await provider.connection.confirmTransaction(tx, "confirmed");

    // Verify initialization
    console.log("--- Vault Information ---");
    console.log("   Vault address:", vaultPDA.toBase58());
    console.log("   Authority:", vaultAuthorityPDA.toBase58());
    console.log("   Token mint:", OUTPUT_TOKEN_MINT.toBase58());

    const tokenBalance = await provider.connection.getTokenAccountBalance(vaultPDA);
    console.log("   Current balance:", tokenBalance.value.uiAmount, "META tokens");

    console.log("\n🎉 Vault initialization complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Fund the vault with META tokens");
    console.log("      Transfer META to:", vaultPDA.toBase58());
    console.log("   2. Recommended initial amount: 100,000 - 1,000,000 META");
    console.log("   3. Then run: anchor run test-swap");

  } catch (err: any) {
    console.error("\n❌ Failed to initialize token vault");

    if (err.logs) {
      console.error("\nProgram logs:");
      err.logs.forEach((log: string) => console.error("  ", log));
    }

    if (err.message && err.message.includes("already in use")) {
      console.error("\nVault account already exists. This script can only be run once.");
    }

    console.error("\nError:", err.message || err);
    throw err;
  }
}

main()
  .then(() => {
    console.log("\n✓ Script completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Script failed:", err);
    process.exit(1);
  });
