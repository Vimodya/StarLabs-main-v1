import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { api, type ICOStatistics } from "@/services/api";

const TokenSaleProgress = () => {
  const [stats, setStats] = useState<ICOStatistics | null>(null);
  const totalSupply = Number(import.meta.env.VITE_TOTAL_SUPPLY) || 1000000000;

  useEffect(() => {
    fetchStatistics();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await api.getICOStatistics();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch ICO statistics:", error);
    }
  };

  const tokensSold = stats?.total_tokens_sold || 0;
  const progressPercentage = (tokensSold / totalSupply) * 100;
  const tokensRemaining = totalSupply - tokensSold;
  const totalRaised = (stats?.total_usdt_raised || 0) + ((stats?.total_sol_raised || 0) * 100);

  const tokenRate = Number(import.meta.env.VITE_TOKEN_RATE) || 2000;
  const tokenPrice = 1 / tokenRate;
  const hardCap = Number(import.meta.env.VITE_HARD_CAP) || 500000;
  const minPurchase = Number(import.meta.env.VITE_MIN_PURCHASE) || 10;

  return (
    <section className="py-24 relative bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {/* <h2 className="text-4xl font-bold mb-4 text-foreground">Token Sale Coming Soon</h2> */}
            <p className="text-muted-foreground text-lg">STAR tokens power rewards, access, and participation across the ecosystem</p>
          </div>

          <Card className="glass-card p-8 border border-black/5 shadow-md bg-white/70">
            <div className="space-y-10">

              {/* Progress Bar Section */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      {progressPercentage.toFixed(2)}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">Sold</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Target: </span>
                    <span className="font-semibold text-primary">${(hardCap / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-4 rounded-full bg-black/5" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Total Supply</p>
                  <p className="text-3xl font-extrabold text-foreground tracking-tight">
                    {totalSupply.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">STAR</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Tokens Sold</p>
                  <p className="text-3xl font-extrabold text-foreground tracking-tight">
                    {tokensSold.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">STAR</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Remaining</p>
                  <p className="text-3xl font-extrabold text-foreground tracking-tight">
                    {tokensRemaining.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">STAR</p>
                </div>
              </div>

              {/* Extra Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-black/5">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Current Price</p>
                  <p className="text-xl font-bold text-foreground">${tokenPrice.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Total Raised</p>
                  <p className="text-xl font-bold text-foreground">
                    ${totalRaised.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Hard Cap</p>
                  <p className="text-xl font-bold text-foreground">${hardCap.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Min. Entry</p>
                  <p className="text-xl font-bold text-foreground">{minPurchase} USDT</p>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TokenSaleProgress;
