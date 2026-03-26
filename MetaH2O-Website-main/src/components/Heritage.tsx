import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Coins, Gift, ShoppingBag, Ticket, Mic2 } from "lucide-react";

const utilities = [
  { icon: <Coins className="w-6 h-6" />, title: "Community rewards" },
  { icon: <Gift className="w-6 h-6" />, title: "Discounts" },
  { icon: <ShoppingBag className="w-6 h-6" />, title: "Exclusive product drops" },
  { icon: <Ticket className="w-6 h-6" />, title: "Backstage access" },
  { icon: <Mic2 className="w-6 h-6" />, title: "Artist sessions" },
];

const TokenUtilitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} id="token" className="py-24 md:py-32 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl text-foreground mb-4"
          >
            The <span className="text-gold">$STAR</span> Token
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-muted-foreground text-lg"
          >
            More than investment — unlock experiences.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {utilities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background rounded-lg p-8 border border-border/50 flex flex-col items-center text-center shadow-sm hover:border-gold/50 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded bg-card flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TokenUtilitySection;