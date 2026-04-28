import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wallet, TrendingUp, Clock, ArrowDownRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { api, type UserStats, type Transaction } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { CheckCircle2 } from "lucide-react";

const STAR_TOKEN_MINT = new PublicKey(import.meta.env.VITE_STAR_MINT || "Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF");

const MyInvestments = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchData();
    }
  }, [connected, publicKey]);

  const fetchData = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const publicKeyString = publicKey.toBase58();
      
      // Fetch STAR token balance (Live from blockchain)
      try {
        const ata = await getAssociatedTokenAddress(STAR_TOKEN_MINT, publicKey);
        const balanceInfo = await connection.getTokenAccountBalance(ata);
        setTokenBalance(balanceInfo.value.uiAmount || 0);
      } catch (err) {
        console.log("Error fetching token balance or ATA does not exist:", err);
        setTokenBalance(0);
      }

      const [userStats, userTransactions] = await Promise.all([
        api.getUserStats(publicKeyString),
        api.getUserTransactions(publicKeyString)
      ]);

      setStats(userStats);
      setTransactions(Array.isArray(userTransactions) ? userTransactions : []);
    } catch (error: any) {
      if (error.message.includes('404')) {
        setStats(null);
        setTransactions([]);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch your investment data. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 bg-background">
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <Link to="/" className="inline-block mb-6">
              <Button variant="ghost" className="hover:bg-transparent text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground text-lg">Monitor your Star Labs investments in real-time.</p>
          </div>

          <Card className="glass-card border-black/5 max-w-lg mx-auto bg-white/70 shadow-lg backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Wallet className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-foreground tracking-tight">Access Required</h3>
              <p className="text-muted-foreground text-center mb-8 text-lg">
                Please connect your Solana wallet to view your personal holdings and transaction history.
              </p>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select wallet from the navigation menu above</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalInvested = (stats?.total_usdt_invested || 0) + ((stats?.total_sol_invested || 0) * 100);
  const averagePrice = tokenBalance > 0 ? totalInvested / tokenBalance : 0;

  return (
    <div className="min-h-screen relative pt-24 pb-16 bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-secondary/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Page Header */}
        <div className="mb-12">
          <Link to="/">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">Investor Dashboard</h1>
              <div className="flex items-center gap-2 text-muted-foreground bg-white/40 px-3 py-1.5 rounded-full border border-black/5 w-fit">
                <Wallet className="h-4 w-4" />
                <span className="font-mono text-sm">
                  {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                </span>
              </div>
            </div>
            <Link to="/buy">
              <Button size="lg" className="bg-gradient-primary shadow-lg hover:shadow-xl text-primary-foreground font-bold px-8 transition-all rounded-xl">
                <Activity className="mr-2 h-5 w-5" />
                Invest More
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Fetching portfolio data...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="glass-card border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                    <Wallet className="h-4 w-4 text-primary" />
                    Live Balance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">{tokenBalance.toLocaleString()}</div>
                  <p className="text-sm text-primary font-medium mt-1">STAR (On-chain)</p>
                </CardContent>
              </Card>

              <Card className="glass-card border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Investment Total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-1">USDT equivalent</p>
                </CardContent>
              </Card>

              <Card className="glass-card border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                    <ArrowDownRight className="h-4 w-4 text-blue-500" />
                    Avg. Entry Price
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    ${averagePrice.toFixed(4)}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Per STAR Token</p>
                </CardContent>
              </Card>
            </div>

            {/* History Feed */}
            <Card className="glass-card border border-black/5 bg-white/80 shadow-md backdrop-blur-md">
              <CardHeader className="border-b border-black/5 pb-6 mb-2">
                <CardTitle className="text-2xl font-bold text-foreground">Transaction History (Off-chain)</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Recent purchases and confirmed transfers</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No Transactions Detected</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                      You haven't made any purchases yet. Your history will appear here once you buy tokens.
                    </p>
                    <Link to="/buy">
                      <Button className="bg-gradient-primary hover:opacity-90 shadow-md transition-all text-primary-foreground font-bold px-8 h-12 rounded-xl">
                        Start Investing
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(transactions) && transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-black/5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-5 mb-4 sm:mb-0">
                          <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                            <ArrowDownRight className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-extrabold text-xl text-foreground tracking-tight">
                              +{tx.tokens_received.toLocaleString()} <span className="text-sm font-semibold text-muted-foreground">STAR</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-1">
                              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{new Date(tx.created_at).toLocaleDateString()}</span>
                              <span className="text-black/20">•</span>
                              <span>{new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-xs font-semibold tracking-wider text-muted-foreground">Transaction confirmed on blockchain</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-4 sm:pt-0 border-t border-black/5 sm:border-0 mt-2 sm:mt-0">
                          <div className="text-xl font-bold text-foreground">
                            {tx.amount_paid} <span className="text-sm text-muted-foreground">{tx.payment_currency}</span>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              tx.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-200' :
                              tx.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                              'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MyInvestments;
