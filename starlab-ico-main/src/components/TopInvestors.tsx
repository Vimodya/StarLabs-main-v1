import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { api, type TopInvestor, type ICOStatistics } from "@/services/api";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500 drop-shadow-sm" />;
    case 2:
      return <Medal className="h-6 w-6 text-slate-400 drop-shadow-sm" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600 drop-shadow-sm" />;
    default:
      return <Star className="h-5 w-5 text-muted-foreground/50" />;
  }
};

const formatAddress = (address: string) => {
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const TopInvestors = () => {
  const [investors, setInvestors] = useState<TopInvestor[]>([]);
  const [stats, setStats] = useState<ICOStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topInvestors, icoStats] = await Promise.all([
          api.getTopInvestors(10),
          api.getICOStatistics()
        ]);
        setInvestors(topInvestors);
        setStats(icoStats);
      } catch (error) {
        console.error("Failed to fetch top investors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="investors" className="py-24 bg-white/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 text-foreground">Top Investors</h2>
            <p className="text-muted-foreground text-lg">Leading supporters in the Star Labs ecosystem</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card p-12 shadow-sm border border-black/5 flex justify-center">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="investors" className="py-24 bg-white/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-foreground">Top Investors</h2>
          <p className="text-muted-foreground text-lg">Leading supporters in the Star Labs ecosystem</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-8 shadow-md border border-black/5 bg-white/70 backdrop-blur-md">
            {investors.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No active investors yet</h3>
                <p className="text-muted-foreground">The sale just started. Be the first to secure your position.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {investors.map((investor, index) => {
                    const rank = index + 1;
                    const totalSupply = Number(import.meta.env.VITE_TOTAL_SUPPLY) || 1000000000;
                    const percentage = (investor.total_tokens / totalSupply) * 100;

                    return (
                      <div
                        key={investor.public_key}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white/50 border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 font-black text-xl text-muted-foreground w-12 shrink-0">
                            {getRankIcon(rank)}
                          </div>

                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm shrink-0 bg-primary/10">
                            <AvatarFallback className="text-primary font-bold bg-transparent">
                              {investor.public_key.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="font-mono font-bold text-foreground truncate" title={investor.public_key}>
                              {formatAddress(investor.public_key)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {investor.total_tokens.toLocaleString()} STAR • <span className="text-green-600 font-medium">${investor.total_invested.toLocaleString()} invested</span>
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right flex items-center gap-3 sm:block sm:w-auto w-full pt-3 sm:pt-0 border-t border-black/5 sm:border-0 mt-2 sm:mt-0">
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider sm:hidden">Allocation:</span>
                          <div className="flex items-center gap-3 ml-auto sm:ml-0">
                            <div className="w-32 bg-black/5 rounded-full h-2.5 overflow-hidden shadow-inner hidden sm:block">
                              <div
                                className="h-full bg-gradient-primary rounded-full"
                                style={{ width: `${Math.min(percentage * 40, 100)}%` }} // *40 just to make it visually pleasing for small numbers
                              />
                            </div>
                            <span className="font-extrabold text-foreground min-w-[60px] text-right">
                              {percentage.toFixed(3)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-black/10">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-primary/5 rounded-xl p-6 border border-primary/20">
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-semibold text-primary uppercase tracking-wide">Community Size</p>
                      <h4 className="text-3xl font-black text-foreground mt-1">
                        {stats?.unique_investors.toLocaleString() || '0'} Unique Holders
                      </h4>
                    </div>
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-primary/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TopInvestors;
