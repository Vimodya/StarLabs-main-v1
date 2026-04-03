import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wallet, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "@/services/api";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from "@solana/spl-token";

const BuyTokens = () => {
  const [usdtAmount, setUsdtAmount] = useState("10");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { publicKey, connected, signTransaction } = useWallet();

  // Configuration from environment variables with safe fallbacks
  const TOKEN_RATE = Number(import.meta.env.VITE_TOKEN_RATE) || 2000;
  const MIN_PURCHASE = Number(import.meta.env.VITE_MIN_PURCHASE) || 10;
  const DEVNET_RPC = import.meta.env.VITE_DEVNET_RPC || "https://api.devnet.solana.com";
  const USDT_MINT = import.meta.env.VITE_USDT_MINT || "GHkQSTZ6YqJ4YQe6v64dY2p3Wq5gX2e2zR4jU6Q7dZ9R"; // Dummy for fallback
  const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS || "GHkQSTZ6YqJ4YQe6v64dY2p3Wq5gX2e2zR4jU6Q7dZ9R"; // Dummy for fallback
  const USDT_DECIMALS = Number(import.meta.env.VITE_USDT_DECIMALS) || 6;

  const tokenAmount = usdtAmount ? (parseFloat(usdtAmount) * TOKEN_RATE).toFixed(2) : "0";
  const tokenPrice = 1 / TOKEN_RATE;

  const handleBuy = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Solana wallet to purchase tokens.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(usdtAmount);
    if (!usdtAmount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid USDT amount.",
        variant: "destructive",
      });
      return;
    }

    if (amount < MIN_PURCHASE) {
      toast({
        title: "Amount Too Low",
        description: `The minimum purchase requirement is ${MIN_PURCHASE} USDT.`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const connection = new Connection(DEVNET_RPC, 'confirmed');

      const mintPublicKey = new PublicKey(USDT_MINT);
      const treasuryPublicKey = new PublicKey(TREASURY_ADDRESS);

      toast({
        title: "Preparing Transaction",
        description: "Setting up token accounts...",
      });

      const fromTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        treasuryPublicKey
      );

      const { blockhash } = await connection.getLatestBlockhash('finalized');

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      });

      try {
        await getAccount(connection, fromTokenAccount);
      } catch (error) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            fromTokenAccount, // associated token account address
            publicKey, // owner
            mintPublicKey // mint
          )
        );
      }

      try {
        await getAccount(connection, toTokenAccount);
      } catch (error) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            toTokenAccount, // associated token account address
            treasuryPublicKey, // owner
            mintPublicKey // mint
          )
        );
      }

      const transferAmount = BigInt(Math.floor(amount * Math.pow(10, USDT_DECIMALS)));

      transaction.add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          publicKey,
          transferAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      toast({
        title: "Awaiting Signature",
        description: "Please securely approve the transaction in your wallet.",
      });

      const signedTransaction = await signTransaction(transaction);

      toast({
        title: "Sending Transaction",
        description: "Broadcasting to the Solana network...",
      });

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3,
        }
      );

      toast({
        title: "Confirming Transaction",
        description: "Waiting for blockchain confirmation...",
      });

      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      console.log('Transaction confirmed:', signature);

      // Record the transaction in the backend
      try {
        await api.createTransaction({
          publicKey: publicKey.toBase58(),
          transactionHash: signature,
          paymentCurrency: "USDT",
          amountPaid: amount,
          tokensReceived: parseFloat(tokenAmount),
          exchangeRate: TOKEN_RATE,
        });
      } catch (e) {
        console.error("Backend recording failed but TX succeeded:", e);
      }

      toast({
        title: "Purchase Successful! 🎉",
        description: `You've secured ${tokenAmount} STAR tokens. Transaction tracked on-chain.`,
      });

      setUsdtAmount("");
    } catch (error: any) {
      console.error("Purchase failed:", error);

      let errorMessage = "Failed to process your purchase. Please try again.";

      if (error.message?.includes("User rejected")) {
        errorMessage = "You canceled the transaction in your wallet.";
      } else if (error.message?.includes("insufficient")) {
        errorMessage = "Your wallet has insufficient USDT balance for this purchase.";
      } else if (error.message?.includes("TokenAccountNotFoundError")) {
        errorMessage = "We couldn't find your USDT account. Please ensure your wallet has USDT.";
      }

      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
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
                    ? `Minimum entry is ${MIN_PURCHASE} USDT`
                    : "A Solana wallet (Phantom, Solflare) is required."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Information Panels */}
          <div className="lg:col-span-2 space-y-6">

            {/* Security Card */}
            <Card className="bg-white/60 border-border/50 shadow-sm backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Secure Transaction</h3>
                    <p className="text-sm text-muted-foreground">Your transaction is executed directly on the Solana blockchain through an audited smart contract.</p>
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
                  <span className="text-muted-foreground text-sm">Target Token Price</span>
                  <span className="font-bold text-foreground">${tokenPrice.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-black/5">
                  <span className="text-muted-foreground text-sm">Fixed Exchange Rate</span>
                  <span className="font-bold text-foreground">1 USDT = {TOKEN_RATE.toLocaleString()} STAR</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-black/5">
                  <span className="text-muted-foreground text-sm">Network standard</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
                    {/* Solana SPL */}
                  </span>
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
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">1. Connect Wallet:</strong> Link your Phantom or Solflare wallet.</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">2. Enter USDT:</strong> Input the amount you wish to invest (min. {MIN_PURCHASE} USDT).</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">3. Authorize:</strong> Confirm the signature prompt in your wallet.</p>
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
