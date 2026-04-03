import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Gem, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const Hero = () => {
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Soft gradient background blending with the cream theme */}
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />

      {/* Subtle decorative elements for a softer, premium beauty feel */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] mix-blend-multiply" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-primary/20 shadow-sm mb-8 hover:shadow-md transition-shadow">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold tracking-wide text-foreground uppercase">TOKEN SALE COMING SOON</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-foreground">
            Invest in the <br />
            <span className="gradient-text italic pr-4">Star Ecosystem</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Join a new era where celebrity influence turns into real-world value
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            <Link to="/buy">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg px-10 py-7 text-primary-foreground font-semibold rounded-2xl">
                Buy Tokens
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>

            <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="border-black/10 bg-white/60 backdrop-blur-md hover:bg-white/90 text-lg px-10 py-7 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-foreground">
                  Read Whitepaper
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                  <DialogTitle>Star Labs Whitepaper</DialogTitle>
                </DialogHeader>
                <div className="flex-1 px-6 pb-6">
                  <iframe
                    src=""
                    className="w-full h-full rounded-xl border"
                    title="Star Labs Whitepaper"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Key Advantages */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group flex flex-col items-center p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Pioneering Tech</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Integrating blockchain directly into next-gen beauty solutions</p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Gem className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Curated Excellence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Backed by industry leaders and premium beauty innovators</p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Global Access</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">A completely decentralized ecosystem built for mass adoption</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
