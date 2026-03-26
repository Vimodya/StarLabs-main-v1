import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const roadmapData = [
  {
    phase: "Q1 2024",
    status: "completed",
    items: [
      "Project Inception & Team Formation",
      "Whitepaper Release",
      "Smart Contract Development",
      "Security Audit Completion",
    ],
  },
  {
    phase: "Q2 2024",
    status: "active",
    items: [
      "ICO Launch on Solana",
      "Community Building Campaign",
      "Strategic Partnerships",
      "Exchange Listings (DEX)",
    ],
  },
  {
    phase: "Q3 2024",
    status: "upcoming",
    items: [
      "Platform Beta Launch",
      "CEX Listings",
      "Mobile App Development",
      "Governance Token Implementation",
    ],
  },
  {
    phase: "Q4 2024",
    status: "upcoming",
    items: [
      "Full Platform Launch",
      "Staking Rewards Program",
      "DeFi Integrations",
      "Global Marketing Campaign",
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-6 w-6 text-primary" />;
    case "active":
      return <Clock className="h-6 w-6 text-secondary" />;
    default:
      return <Circle className="h-6 w-6 text-muted-foreground" />;
  }
};

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Roadmap</h2>
          <p className="text-muted-foreground text-lg">Our journey to revolutionize DeFi</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {roadmapData.map((phase, index) => (
              <Card
                key={index}
                className={`glass-card p-6 shadow-card ${
                  phase.status === "active" ? "border-primary glow-effect" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(phase.status)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{phase.phase}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          phase.status === "completed"
                            ? "bg-primary/20 text-primary"
                            : phase.status === "active"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                      </span>
                    </div>
                    
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
