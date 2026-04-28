import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wallet, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { api } from "@/services/api";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import idl from "../idl.json";

// ─── On-chain constants (must match lib.rs) ─────────────────────────────────
const PROGRAM_ID      = new PublicKey(import.meta.env.VITE_PROGRAM_ID || "BzGwMb1Cp6P16CzYEiZUN3wfVCCz59Lwj3zV7EWtPDWr");
const STAR_MINT       = new PublicKey(import.meta.env.VITE_STAR_MINT || "Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF");
const USDT_MINT_KEY   = new PublicKey(import.meta.env.VITE_USDT_MINT || "6gWLtgTa3oS1UTa4Q4Qevu5AwYwT9ohnh8MQZwTL1xVh");
const TREASURY_WALLET = new PublicKey(import.meta.env.VITE_TREASURY_ADDRESS || "9UCKSVjTtxxSCyuLf38WW69Z4D4wzNxt7w9AN8rE2bPn");

// ─── PDAs (deterministic — no on-chain fetching needed) ──────────────────────
const [STATE_PDA]        = PublicKey.findProgramAddressSync([Buffer.from("state")],          PROGRAM_ID);
const [VAULT_PDA]        = PublicKey.findProgramAddressSync([Buffer.from("token_vault")],    PROGRAM_ID);
const [VAULT_AUTH_PDA]   = PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], PROGRAM_ID);

// ─── Sale config from env ────────────────────────────────────────────────────
const TOKEN_RATE    = Number(import.meta.env.VITE_TOKEN_RATE)    || 100;   // 1 USDT = 100 STAR
const MIN_PURCHASE  = Number(import.meta.env.VITE_MIN_PURCHASE)  || 10;    // min 10 USDT
const USDT_DECIMALS = Number(import.meta.env.VITE_USDT_DECIMALS) || 6;

const BuyTokens = () => {
  const [usdtAmount, setUsdtAmount] = useState("10");
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast }                                   = useToast();
  const { publicKey, connected, signMessage }       = useWallet();
  const { connection }                              = useConnection();

  /**
   * useAnchorWallet() returns the correct AnchorWallet interface
   * (publicKey + signTransaction + signAllTransactions) required by
   * AnchorProvider in @coral-xyz/anchor 0.30+.
   * Using useWallet() directly and manually constructing the object was
   * the primary cause of provider failures in 0.32.
   */
  const anchorWallet = useAnchorWallet();

  const tokenAmount = usdtAmount ? (parseFloat(usdtAmount) * TOKEN_RATE).toFixed(2) : "0";
  const tokenPrice  = 1 / TOKEN_RATE;

  // ─── Purchase handler ────────────────────────────────────────────────────
  const handleBuy = async () => {
    // ── Guards ────────────────────────────────────────────────────────────
    if (!connected || !publicKey || !anchorWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Solana wallet (Phantom or Solflare) to purchase tokens.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(usdtAmount);
    if (!usdtAmount || isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid USDT amount.", variant: "destructive" });
      return;
    }
    if (amount < MIN_PURCHASE) {
      toast({ title: "Amount Too Low", description: `Minimum purchase is ${MIN_PURCHASE} USDT.`, variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      // ── Step 1: Derive user token accounts ──────────────────────────────
      toast({ title: "Preparing Transaction", description: "Checking your token accounts..." });

      // Check SOL balance for network fees
      const solBalance = await connection.getBalance(publicKey);
      const MIN_SOL_REQUIRED = 5000000; // 0.005 SOL
      if (solBalance < MIN_SOL_REQUIRED) {
        toast({
          title: "Insufficient SOL for Fees",
          description: "A small amount of SOL is required for network fees.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const userUsdtAta = await getAssociatedTokenAddress(USDT_MINT_KEY, publicKey);
      const userStarAta = await getAssociatedTokenAddress(STAR_MINT, publicKey);
      const treasuryUsdtAta = await getAssociatedTokenAddress(USDT_MINT_KEY, TREASURY_WALLET);

      // ── Step 2: Preflight checks ─────────────────────────────────────────
      // 2a. Treasury USDT ATA must already exist (created by admin, not user).
      //     If it doesn't, the whole ICO hasn't been set up correctly.
      try {
        await getAccount(connection, treasuryUsdtAta);
      } catch {
        toast({
          title: "Contract Not Ready",
          description: "The treasury token account has not been set up. Please contact support.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // 2b. User must have a USDT token account with sufficient balance.
      let userUsdtBalance = BigInt(0);
      try {
        const userUsdtAccount = await getAccount(connection, userUsdtAta);
        userUsdtBalance = userUsdtAccount.amount;
      } catch {
        // ATA doesn't exist → zero balance
        userUsdtBalance = BigInt(0);
      }

      const requiredMicroUsdt = BigInt(Math.floor(amount * Math.pow(10, USDT_DECIMALS)));
      if (userUsdtBalance < requiredMicroUsdt) {
        const humanBalance = Number(userUsdtBalance) / Math.pow(10, USDT_DECIMALS);
        toast({
          title: "Insufficient USDT Balance",
          description: `You need ${amount} USDT but your wallet only holds ${humanBalance.toFixed(2)} USDT.`,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // ── Step 3: Build Anchor provider & program ──────────────────────────
      //
      // AnchorProvider is built from:
      //   - connection   : the Solana RPC connection (from useConnection)
      //   - anchorWallet : the AnchorWallet object (from useAnchorWallet)
      //
      // The IDL has "metadata.address" set to the program ID (Anchor 0.30+ format),
      // so new anchor.Program(idl, provider) correctly resolves the program.
      const provider = new anchor.AnchorProvider(connection, anchorWallet, {
        preflightCommitment: "confirmed",
        commitment: "confirmed",
      });

      const program = new anchor.Program(idl as any, provider);

      // Convert human USDT → smallest unit (6 decimals)
      // Example: 10 USDT → 10_000_000 (u64 passed to contract)
      const inputAmountBN = new BN(requiredMicroUsdt.toString());

      console.log("[StarLabs ICO] Swap params:", {
        inputAmount:       inputAmountBN.toString(),
        expectedOutput:    `${parseFloat(tokenAmount)} STAR`,
        userUsdtAta:       userUsdtAta.toBase58(),
        userStarAta:       userStarAta.toBase58(),
        treasuryUsdtAta:   treasuryUsdtAta.toBase58(),
        statePDA:          STATE_PDA.toBase58(),
        vaultPDA:          VAULT_PDA.toBase58(),
        vaultAuthPDA:      VAULT_AUTH_PDA.toBase58(),
      });

      toast({
        title: "Awaiting Signature",
        description: "Please approve the USDT token transfer in your wallet.",
      });

      // ── Step 4: Call swapTokens on-chain ─────────────────────────────────
      //
      // What Phantom will show:
      //   ✅ SPL token transfer: user USDT ATA → treasury USDT ATA  (amount USDT)
      //   ✅ SPL token transfer: vault PDA → user STAR ATA           (amount * 100 STAR)
      //   ✅ Network fee in SOL (gas only, ~0.000005 SOL)
      //   ✅ Possibly SOL rent if userStarAta doesn't exist yet (init_if_needed)
      //
      // The contract's init_if_needed handles creation of user ATAs on-chain,
      // so NO manual preInstructions are needed here. That avoids:
      //   - Double-create conflicts
      //   - User paying rent for treasury accounts (wrong)
      //
      const signature = await program.methods
        .swapTokens(inputAmountBN)
        .accounts({
          state:                  STATE_PDA,
          user:                   publicKey,
          userInputTokenAccount:  userUsdtAta,
          userOutputTokenAccount: userStarAta,
          inputTokenMint:         USDT_MINT_KEY,
          outputTokenMint:        STAR_MINT,
          ownerInputTokenAccount: treasuryUsdtAta,
          ownerWallet:            TREASURY_WALLET,
          rewardVault:            VAULT_PDA,
          vaultAuthority:         VAULT_AUTH_PDA,
          tokenProgram:           TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram:          anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // ── Step 5: Wait for confirmation ────────────────────────────────────
      toast({ title: "Confirming Transaction", description: "Waiting for blockchain confirmation..." });

      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      if (confirmation.value.err) {
        throw new Error(`Transaction confirmed but failed on-chain: ${JSON.stringify(confirmation.value.err)}`);
      }

      console.log("[StarLabs ICO] Transaction confirmed:", signature);

      // ── Step 6: Record in backend (best-effort, does not block the UI) ───
      try {
        let signatureStr = "";
        let messageStr = "";
        
        if (signMessage) {
           toast({ title: "Verification", description: "Please sign the message in your wallet to verify the transaction." });
           const timestamp = Date.now();
           const nonce = Math.random().toString(36).substring(2, 15);
           const msgText = `Sign to verify StarLabs ICO transaction: ${signature} | ${timestamp} | ${nonce}`;
           const encodedMessage = new TextEncoder().encode(msgText);
           const signedMessage = await signMessage(encodedMessage);
           signatureStr = Buffer.from(signedMessage).toString('base64');
           messageStr = msgText;
        }

        await api.createTransaction({
          publicKey:       publicKey.toBase58(),
          transactionHash: signature,
          paymentCurrency: "USDT",
          amountPaid:      amount,
          tokensReceived:  parseFloat(tokenAmount),
          exchangeRate:    TOKEN_RATE,
          message:         messageStr,
          signature:       signatureStr,
        });
      } catch (backendErr) {
        // Backend failure is non-fatal — the on-chain transaction succeeded.
        console.warn("[StarLabs ICO] Backend recording failed (tx succeeded on-chain):", backendErr);
      }

      toast({
        title: "Purchase Successful! 🎉",
        description: `You paid ${amount} USDT and received ${parseFloat(tokenAmount).toLocaleString()} STAR tokens. Transaction confirmed on blockchain.`,
      });

      setUsdtAmount("");
    } catch (error: any) {
      console.error("[StarLabs ICO] Purchase failed:", error);

      // ── Human-readable error mapping ─────────────────────────────────────
      let errorTitle   = "Purchase Failed";
      let errorMessage = "Failed to process your purchase. Please try again.";

      const msg = error?.message ?? "";
      if (msg.includes("User rejected") || msg.includes("Transaction rejected")) {
        errorTitle   = "Transaction Cancelled";
        errorMessage = "You rejected the transaction in your wallet.";
      } else if (msg.includes("InsufficientUserTokens") || msg.includes("0x1796")) {
        errorMessage = "Your USDT balance is too low for this purchase.";
      } else if (msg.includes("InsufficientRewardTokens") || msg.includes("0x1795")) {
        errorMessage = "The token vault is currently empty. Please check back later.";
      } else if (msg.includes("ContractPaused") || msg.includes("0x1797")) {
        errorMessage = "The ICO contract is temporarily paused.";
      } else if (msg.includes("BelowMinimumSwap") || msg.includes("0x1770")) {
        errorMessage = `The minimum purchase is ${MIN_PURCHASE} USDT.`;
      } else if (msg.includes("InvalidInputTokenMint")) {
        errorMessage = "Wrong USDT mint address configured. Please contact support.";
      }

      toast({ title: errorTitle, description: errorMessage, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-12">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-secondary/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 py-8 relative z-10 flex-1">
        {/* Navigation Header */}
        <div className="mb-10 max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/">
              <Button variant="ghost" className="mb-3 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">Buy STAR Tokens</h1>
            <p className="text-muted-foreground text-lg">Join the StarLabs ecosystem powering next-generation beauty innovation.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Main Purchase Form Panel */}
          <Card className="lg:col-span-3 glass-card border-border/50 shadow-md bg-white/70 backdrop-blur-md">
            <CardHeader className="border-b border-black/5 pb-6 mb-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                Token Exchange
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Current Rate: <span className="font-semibold text-foreground">1 USDT = {TOKEN_RATE.toLocaleString()} STAR</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

              {/* Payment Box */}
              <div className="space-y-3">
                <Label htmlFor="usdt-amount" className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Amount to Pay (USDT)
                </Label>
                <div className="relative">
                  <Input
                    id="usdt-amount"
                    type="number"
                    placeholder="Enter amount..."
                    value={usdtAmount}
                    onChange={(e) => setUsdtAmount(e.target.value)}
                    min={MIN_PURCHASE}
                    step="0.01"
                    className="text-2xl h-16 bg-white border-black/10 focus-visible:ring-primary font-semibold pl-6 pr-20"
                    disabled={!connected}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md border border-black/5">
                    <span className="font-bold text-sm text-foreground">USDT</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center relative py-2">
                <div className="h-px bg-border/50 absolute w-full left-0 top-1/2 -translate-y-1/2"></div>
                <div className="w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center relative z-10 shadow-sm">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Receive Box */}
              <div className="space-y-3">
                <Label htmlFor="token-amount" className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Amount You Receive (STAR)
                </Label>
                <div className="relative">
                  <Input
                    id="token-amount"
                    type="text"
                    value={tokenAmount}
                    readOnly
                    className="text-2xl h-16 bg-black/[0.02] border-none font-bold pl-6 pr-20 text-foreground cursor-default"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md">
                    <span className="font-bold text-sm text-primary">STAR</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  id="confirm-purchase-btn"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl h-16 text-lg text-primary-foreground font-bold rounded-xl"
                  onClick={handleBuy}
                  disabled={!connected || isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing Transaction...
                    </span>
                  ) : connected ? (
                    <span className="flex items-center gap-2">
                      Confirm Purchase
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </span>
                  ) : (
                    "Connect Wallet to Buy"
                  )}
                </Button>

                <p className="text-sm text-center mt-4 text-muted-foreground font-medium">
                  {connected
                    ? `Minimum entry is ${MIN_PURCHASE} USDT · Payment in SPL USDT on Solana`
                    : "A Solana wallet (Phantom, Solflare) is required."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Information Panels */}
          <div className="lg:col-span-1 space-y-6">

            {/* Security Card */}
            <Card className="bg-white/60 border-border/50 shadow-sm backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Secure SPL Token Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Payment is made in USDT (SPL token) directly on the Solana blockchain. No SOL leaves your wallet beyond the network gas fee.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Details */}
            <Card className="bg-white/60 border-border/50 shadow-sm backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Sale Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-black/5">
                  <span className="text-muted-foreground text-sm">Token Price</span>
                  <span className="font-bold text-foreground">${tokenPrice.toFixed(4)} USDT</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-black/5">
                  <span className="text-muted-foreground text-sm">Exchange Rate</span>
                  <span className="font-bold text-foreground">1 USDT = {TOKEN_RATE.toLocaleString()} STAR</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-black/5">
                  <span className="text-muted-foreground text-sm">Payment Token</span>
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    USDT (SPL)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Minimum Purchase</span>
                  <span className="font-bold text-foreground">{MIN_PURCHASE} USDT</span>
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="bg-white/60 border-border/50 shadow-sm backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">1. Connect Wallet:</strong> Link your Phantom or Solflare wallet — ensure it holds USDT on Solana Devnet.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">2. Enter USDT Amount:</strong> Input how much USDT you wish to invest (minimum {MIN_PURCHASE} USDT).
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">3. Approve in Wallet:</strong> Phantom will show a <em>token transfer</em> — approve to send USDT and receive STAR instantly.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokens;
