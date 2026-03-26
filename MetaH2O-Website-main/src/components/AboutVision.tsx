import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutVision = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="vision" className="py-24 md:py-32 px-6 md:px-12 bg-background border-y border-border/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-2xl md:text-4xl lg:text-5xl text-foreground leading-relaxed text-balance"
        >
          "Where innovation meets celebrity, influence, and fandom engagement to create cultural phenomena."
        </motion.p>
      </div>
    </section>
  );
};

export default AboutVision;
