import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Package, TrendingUp, Users } from "lucide-react";

const steps = [
  { icon: <Star className="w-8 h-8 text-background fill-background" />, title: "Celebrity", desc: "Partnering with cultural icons" },
  { icon: <Package className="w-8 h-8 text-background" />, title: "Brand", desc: "Creating high-margin, scalable CPGs" },
  { icon: <TrendingUp className="w-8 h-8 text-background" />, title: "Growth", desc: "Global distribution & retail scaling" },
  { icon: <Users className="w-8 h-8 text-background" />, title: "Community", desc: "Tokenized revenue & fandom rewards" },
];

const Ecosystem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} id="ecosystem" className="py-24 md:py-32 px-6 md:px-12 bg-background border-y border-border/50">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl md:text-5xl text-foreground mb-16"
        >
          The Growth Engine
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-border hidden lg:block -z-10" />
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center bg-card p-8 rounded-xl border border-border/50 relative overflow-hidden group"
            >
              <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mb-6 shadow-glow transition-transform duration-500 group-hover:scale-110">
                {step.icon}
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3 font-semibold">{step.title}</h3>
              <p className="font-sans text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
