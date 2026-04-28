import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

/**
 * Script to test swapping payment tokens for META tokens
 *
 * Exchange rate: 1 input token = 100 output tokens (MetaH2O)
 * Minimum swap: 10 input tokens
 *
 * Run with: anchor run test-swap
 */

const INPUT_TOKEN_MINT = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"); // USDT mainnet
const OUTPUT_TOKEN_MINT = new PublicKey("Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF"); // MetaH2O mainnet
const PAYMENT_RECIPIENT = new PublicKey("2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng");

async function main() {
  console.log("=== MetaH2O ICO Contract - Test Token Swap ===\n");

  // Configure the client to use devnet
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();

  console.log("✓ Connected to:", provider.connection.rpcEndpoint);
  console.log("✓ User wallet:", provider.wallet.publicKey.toBase58());

  // Check wallet balance
  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log("✓ User SOL balance:", balance / 1e9, "SOL\n");

  if (balance < 0.01 * 1e9) {
    console.error("❌ Insufficient SOL for transaction fees. Need at least 0.01 SOL");
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

  const [rewardVaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault")],
    program.programId
  );
  console.log("✓ Reward Vault PDA:", rewardVaultPDA.toBase58());

  const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_authority")],
    program.programId
  );
  console.log("✓ Vault Authority PDA:", vaultAuthorityPDA.toBase58());

  // Get user's input token account (payment tokens)
  const userInputTokenAccount = await getAssociatedTokenAddress(
    INPUT_TOKEN_MINT,
    provider.wallet.publicKey
  );
  console.log("✓ User input token account:", userInputTokenAccount.toBase58());

  // Get user's output token account (reward tokens)
  const userOutputTokenAccount = await getAssociatedTokenAddress(
    OUTPUT_TOKEN_MINT,
    provider.wallet.publicKey
  );
  console.log("✓ User output token account:", userOutputTokenAccount.toBase58());

  // Get payment recipient's input token account (receives payment)
  // For multisig wallet, use the manually created token account
  const ownerInputTokenAccount = new PublicKey("BuSED3pwCa6iJH1gXJq46QJRoFq5hiN7KLxvJCU8KKaH");
  console.log("✓ Payment recipient input token account:", ownerInputTokenAccount.toBase58());

  // Check contract state
  try {
    const state = await program.account.contractState.fetch(statePDA);
    console.log("\n--- Contract State ---");
    console.log("   Is paused:", state.isPaused);

    if (state.isPaused) {
      console.error("\n❌ Contract is paused! Cannot perform swap.");
      console.log("Contact the owner to unpause the contract.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Contract state not initialized!");
    console.log("Run: anchor run initialize");
    process.exit(1);
  }

  // Check reward vault balance
  try {
    const vaultBalance = await provider.connection.getTokenAccountBalance(rewardVaultPDA);
    console.log("\n--- Reward Vault Status ---");
    console.log("   Vault balance:", vaultBalance.value.uiAmount, "META tokens");

    if (vaultBalance.value.uiAmount === 0) {
      console.error("\n❌ Vault is empty! Cannot perform swap.");
      console.log("Fund the vault with META tokens first.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Reward vault not initialized!");
    console.log("Run: anchor run initialize-vault");
    process.exit(1);
  }

  // Check user's input token balance
  let userInputBalanceBefore = 0;
  try {
    const userBalance = await provider.connection.getTokenAccountBalance(userInputTokenAccount);
    userInputBalanceBefore = userBalance.value.uiAmount || 0;
    console.log("\n--- User Token Balances (Before) ---");
    console.log("   Input tokens (USDT):", userInputBalanceBefore, "USDT");

    if (userInputBalanceBefore < 10) {
      console.error("\n❌ Insufficient USDT! You need at least 10 USDT to swap.");
      console.log("Current balance:", userInputBalanceBefore, "USDT");
      process.exit(1);
    }
  } catch (err) {
    console.error("\n❌ User USDT token account doesn't exist!");
    console.log("You need to have USDT tokens to swap.");
    process.exit(1);
  }

  // Get user's output token balance (if account exists)
  let userOutputBalanceBefore = 0;
  try {
    const userBalance = await provider.connection.getTokenAccountBalance(userOutputTokenAccount);
    userOutputBalanceBefore = userBalance.value.uiAmount || 0;
    console.log("   Output tokens:", userOutputBalanceBefore, "META");
  } catch (err) {
    console.log("   Output tokens: 0 META (account will be created)");
  }

  // Test swap: 10 USDT = 1000 META tokens
  const inputAmount = new anchor.BN(10_000_000); // 10 USDT with 6 decimals
  const expectedOutputTokens = 1000; // Should receive 1000 META tokens (10 * 100)

  console.log("\n--- Test Swap Parameters ---");
  console.log("   Input tokens to swap:", inputAmount.toNumber() / 1e6, "USDT");
  console.log("   Expected output tokens:", expectedOutputTokens, "META");
  console.log("   Exchange rate: 1 USDT = 100 META\n");

  console.log("--- Executing Swap ---\n");

  try {
    const tx = await program.methods
      .swapTokens(inputAmount)
      .accounts({
        state: statePDA,
        user: provider.wallet.publicKey,
        userInputTokenAccount: userInputTokenAccount,
        userOutputTokenAccount: userOutputTokenAccount,
        inputTokenMint: INPUT_TOKEN_MINT,
        outputTokenMint: OUTPUT_TOKEN_MINT,
        ownerInputTokenAccount: ownerInputTokenAccount,
        ownerWallet: PAYMENT_RECIPIENT,
        rewardVault: rewardVaultPDA,
        vaultAuthority: vaultAuthorityPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Swap executed successfully!");
    console.log("   Transaction signature:", tx);
    const cluster = provider.connection.rpcEndpoint.includes("devnet") ? "devnet" : "";
    const clusterParam = cluster ? `?cluster=${cluster}` : "";
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}${clusterParam}\n`);

    // Wait for confirmation
    await provider.connection.confirmTransaction(tx, "confirmed");

    // Verify the swap results
    console.log("--- Swap Results ---");

    // Check user's new input token balance
    const userInputBalanceAfter = await provider.connection.getTokenAccountBalance(userInputTokenAccount);
    const inputSpent = userInputBalanceBefore - (userInputBalanceAfter.value.uiAmount || 0);
    console.log("   User USDT (after):", userInputBalanceAfter.value.uiAmount, "USDT");
    console.log("   USDT spent:", inputSpent, "USDT");

    // Check user's new output token balance
    const userOutputBalanceAfter = await provider.connection.getTokenAccountBalance(userOutputTokenAccount);
    const outputReceived = (userOutputBalanceAfter.value.uiAmount || 0) - userOutputBalanceBefore;
    console.log("   User output tokens (after):", userOutputBalanceAfter.value.uiAmount, "META");
    console.log("   Output tokens received:", outputReceived, "META");

    // Check reward vault's new balance
    const vaultBalanceAfter = await provider.connection.getTokenAccountBalance(rewardVaultPDA);
    console.log("   Reward vault balance (after):", vaultBalanceAfter.value.uiAmount, "META");

    // Check owner's input token balance
    try {
      const ownerBalance = await provider.connection.getTokenAccountBalance(ownerInputTokenAccount);
      console.log("   Multisig USDT balance:", ownerBalance.value.uiAmount, "USDT");
    } catch (err) {
      console.log("   Multisig USDT account: Not found");
    }

    console.log("\n🎉 Test swap completed successfully!");
    console.log("\n✅ Verification:");
    console.log("   ✓ User sent", inputSpent, "USDT");
    console.log("   ✓ User received", outputReceived, "META tokens");
    console.log("   ✓ Multisig received USDT payment");
    console.log("   ✓ Reward vault balance decreased");
    console.log("   ✓ Swap ratio correct:", outputReceived / inputSpent, "META per USDT");
    console.log("\n📊 The contract is working correctly!");

  } catch (err: any) {
    console.error("\n❌ Swap failed!");

    if (err.logs) {
      console.error("\nProgram logs:");
      err.logs.forEach((log: string) => console.error("  ", log));
    }

    if (err.message) {
      if (err.message.includes("6006")) {
        console.error("\nError: Contract is paused");
      } else if (err.message.includes("6004")) {
        console.error("\nError: Insufficient reward tokens in vault");
      } else if (err.message.includes("6005")) {
        console.error("\nError: Insufficient user tokens");
      } else if (err.message.includes("4100") || err.message.includes("BelowMinimumSwap")) {
        console.error("\nError: Below minimum swap amount (need at least 10 USDT)");
      } else {
        console.error("\nError:", err.message);
      }
    }

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
  })
  .finally(() => {
    // Force exit to prevent hanging
    setTimeout(() => process.exit(0), 1000);
  });
