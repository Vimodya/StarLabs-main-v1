import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Investor Allocation (Investors)", value: 40, color: "hsl(var(--primary))" },
  { name: "Liquidity Pool", value: 10, color: "hsl(var(--chart-2))" },
  { name: "Team & Advisors", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Marketing & Growth", value: 5, color: "hsl(var(--chart-4))" },
  { name: "Community Rewards", value: 15, color: "hsl(var(--chart-5))" },
];

const Tokenomics = () => {
  return (
    <section id="tokenomics" className="py-24 relative bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-foreground">Token Distribution</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A transparent allocation designed to support product growth,
            community rewards, and long-term ecosystem development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Chart Card */}
          <Card className="glass-card p-8 shadow-sm border border-black/5 bg-white/70 backdrop-blur-md pb-12">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Distribution Breakdown</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      fontWeight: 600
                    }}
                    itemStyle={{ color: "#111" }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Details Card */}
          <Card className="glass-card p-8 shadow-sm border border-black/5 bg-white/70 backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Key Metrics</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between group p-2 hover:bg-black/[0.02] rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-foreground font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 mt-2 border-t border-black/10 space-y-5">
                <div className="flex justify-between items-center bg-black/5 p-3 rounded-xl border border-black/5">
                  <span className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Network</span>
                  <span className="font-bold text-primary flex items-center gap-2">
                    {/* <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="w-4 h-4" /> */}
                    {/* Solana SPL */}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                  <span className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Ticker Symbol</span>
                  <span className="font-extrabold text-foreground tracking-tight text-lg">STAR</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                  <span className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Max Supply</span>
                  <span className="font-extrabold text-foreground tracking-tight text-lg">1,000,000,000</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
