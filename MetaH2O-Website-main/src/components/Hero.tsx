import { motion } from "framer-motion";
import heroImage from "@/assets/hero-water.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium Saratoga Spring Water with elegant glass"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cobalt-deep/40 via-transparent to-cobalt-deep/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-12">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gold tracking-wide-luxury text-xs md:text-sm uppercase mb-4 font-sans"
          >
            Discover Meta H2O Alkaline Spring Water
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-foreground/90 font-sans text-sm md:text-base leading-relaxed max-w-md"
          >
            Meta H2O® Alkaline Spring Water enriches life's grand and subtle moments with its 
            naturally high alkaline pH and refreshing taste. Premium spring water with no sugar, 
            no calories, and no caffeine. Pure hydration, elevated.
          </motion.p>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-20 right-6 md:right-12 text-right"
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground">
            The <em className="text-gold">Pure</em> Difference
          </h2>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;