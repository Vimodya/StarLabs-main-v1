import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Coins, Gift, ShoppingBag, Ticket, Mic2 } from "lucide-react";

const utilities = [
  { 
    icon: <Coins className="w-8 h-8" />, 
    title: "Community Rewards",
    description: "Earn $STAR tokens and gain ecosystem prestige through active engagement and governance."
  },
  { 
    icon: <Gift className="w-8 h-8" />, 
    title: "Eco-Discounts",
    description: "Unlock special pricing and curated offers across our network of premium celebrity brands."
  },
  { 
    icon: <ShoppingBag className="w-8 h-8" />, 
    title: "Exclusive Drops",
    description: "Secure priority access to limited-edition products and rare digital collectibles before they hit the market."
  },
  { 
    icon: <Ticket className="w-8 h-8" />, 
    title: "Backstage Access",
    description: "Go beyond the velvet rope with VIP passes to global events and exclusive behind-the-scenes content."
  },
  { 
    icon: <Mic2 className="w-8 h-8" />, 
    title: "Artist Sessions",
    description: "Participate in intimate digital meetups and private Q&A sessions with your favorite world-class artists."
  },
];

const TokenUtilitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="rewards" className="relative py-24 md:py-32 px-6 md:px-12 bg-[#FDF3DD] overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#C29240]/5 to-transparent rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#B2A3A1]/10 to-transparent rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-6"
          >
            The Ecosystem Advantage
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2D2D2D] mb-6 leading-tight"
          >
            Empowering Your <br className="hidden md:block" /> 
            <span className="text-gradient-gold italic">Fandom Experience</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-[#2D2D2D]/60 text-lg md:text-xl font-light"
          >
            Interaction meets innovation. Become more than a fan — become a direct stakeholder in the culture you love.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {utilities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="relative group h-full"
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 h-full border border-[#C29240]/10 flex flex-col items-start transition-all duration-500 hover:border-[#C29240]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C29240]/10">
                
                {/* Icon Wrapper */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-[#FDF3DD] flex items-center justify-center text-[#C29240] mb-8 shadow-sm group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#C29240] group-hover:to-[#B38B31] group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="font-serif text-2xl font-semibold text-[#2D2D2D] mb-4 group-hover:text-[#C29240] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-sans text-[#2D2D2D]/70 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Subtle Arrow (Hover) */}
                <div className="mt-auto opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C29240]">Learn More →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TokenUtilitySection;