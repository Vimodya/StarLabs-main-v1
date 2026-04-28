import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

/**
 * Script to initialize the MetaH2O ICO Contract state
 * Run with: anchor run initialize
 */

async function main() {
  console.log("=== MetaH2O ICO Contract - Initialize State ===\n");

  // Configure the client to use devnet
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();

  console.log("✓ Connected to:", provider.connection.rpcEndpoint);
  console.log("✓ Wallet:", provider.wallet.publicKey.toBase58());

  // Check wallet balance
  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log("✓ Wallet balance:", balance / 1e9, "SOL\n");

  if (balance < 0.001 * 1e9) {
    console.error("❌ Insufficient balance. Need at least 0.001 SOL");
    console.log("Run: solana airdrop 1");
    process.exit(1);
  }

  // Load the program
  const program = anchor.workspace.Metah2oIcoContract as any;
  console.log("✓ Program ID:", program.programId.toBase58());

  // Derive state PDA
  const [statePDA, stateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("state")],
    program.programId
  );
  console.log("✓ State PDA:", statePDA.toBase58());
  console.log("  Bump:", stateBump);

  // Check if already initialized
  try {
    const stateAccount = await program.account.contractState.fetch(statePDA);
    console.log("\n⚠️  Contract state already initialized!");
    console.log("   Is paused:", stateAccount.isPaused);
    console.log("\nNothing to do. Exiting.");
    return;
  } catch (err) {
    // State doesn't exist yet - this is expected
    console.log("✓ State account not found (will create)\n");
  }

  console.log("--- Initializing Contract State ---\n");

  try {
    const tx = await program.methods
      .initialize()
      .accounts({
        state: statePDA,
        payer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Contract state initialized successfully!");
    console.log("   Transaction signature:", tx);
    const cluster = provider.connection.rpcEndpoint.includes("devnet") ? "devnet" : "";
    const clusterParam = cluster ? `?cluster=${cluster}` : "";
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}${clusterParam}\n`);

    // Wait for confirmation
    await provider.connection.confirmTransaction(tx, "confirmed");

    // Verify initialization
    const stateAccount = await program.account.contractState.fetch(statePDA);
    console.log("--- Contract State ---");
    console.log("   Address:", statePDA.toBase58());
    console.log("   Is paused:", stateAccount.isPaused);

    console.log("\n🎉 Initialization complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Run: anchor run initialize-vault");
    console.log("   2. Fund the vault with META tokens");
    console.log("   3. Run: anchor run test-swap");

  } catch (err: any) {
    console.error("\n❌ Failed to initialize contract state");

    if (err.logs) {
      console.error("\nProgram logs:");
      err.logs.forEach((log: string) => console.error("  ", log));
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
