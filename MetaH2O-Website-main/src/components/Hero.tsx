import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effectHandler: any = null;

    // By relying directly on the <head> tags we injected, we cleanly bypass Vite's strict module resolution errors.
    const BIRDS = (window as any).VANTA?.BIRDS;

    if (!effectHandler && vantaRef.current && typeof BIRDS === "function") {
      try {
        effectHandler = BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          // Star Labs specific color palette setup
          backgroundColor: 0xfdf3dd,
          color1: 0xc29240,
          color2: 0xb2a3a1,
          colorMode: "varianceGradient",
          birdSize: 1.50,
          wingSpan: 30.00,
          speedLimit: 5.00,
          separation: 80.00,
          alignment: 20.00,
          cohesion: 20.00,
          quantity: 4.00,
        });
        setVantaEffect(effectHandler);
      } catch (error) {
        console.error("Vanta CDN init failed:", error);
      }
    } else if (!BIRDS) {
      console.warn("Vanta.js scripts are not loaded on the window yet.");
    }

    return () => {
      if (effectHandler) {
        effectHandler.destroy();
      }
    };
  }, []);

  return (
    <section ref={vantaRef} className="relative min-h-screen w-full flex overflow-hidden">

      {/* Glowing transition: Subtle gold radial glow on Cream background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(194,146,64,0.1)_0%,_transparent_70%)] z-10 pointer-events-none" />

      {/* Main Container - Centered */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center mt-32 mb-auto pb-10">

        {/* Participation Token Top Stylish Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs font-bold text-[#c29240] mb-4 drop-shadow-sm"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c29240] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c29240]"></span>
          </div>
          <span>Participation Token</span>
          <span className="text-[#2D2D2D]/40 font-light px-1">•</span>
          <span className="text-[#2D2D2D]/80 tracking-[0.2em]">Coming Soon</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col tracking-wide leading-[1.15]"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] uppercase text-[#2D2D2D] drop-shadow-sm">
            <span className="font-serif font-normal block">YOUR WORLD,</span>
            <span className="font-serif font-normal block mt-2">POWERED BY STARS.</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-serif font-normal text-[#2D2D2D]/90 text-[15px] sm:text-base lg:text-[1.1rem] max-w-3xl text-center leading-relaxed drop-shadow-sm mt-8 mb-12"
        >
          Where innovation meets celebrity influence and fandom engagement to<br className="hidden md:block" /> create cultural phenomena. It's not just a brand; it's a new era of shared value
        </motion.p>

        {/* Explore Ecosystem CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6"
        >
          <Link
            to="/ecosystem"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm font-bold text-[#fdf3dd] transition-all duration-300 bg-[#c29240] font-sans rounded-full gap-4 tracking-[0.2em] uppercase shadow-xl hover:scale-105 hover:bg-[#b2a3a1]"
          >
            <span>Explore Ecosystem</span>
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2] group-hover:translate-y-1 transition-transform" />
          </Link>
        </motion.div>

      </div>

    </section>
  );
};

export default Hero;