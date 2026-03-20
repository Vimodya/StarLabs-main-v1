import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import artOfWater from "@/assets/art-of-water.jpg";
import fineDining from "@/assets/fine-dining.jpg";
import artOfStyle from "@/assets/art-of-style.jpg";

const features = [
  {
    title: "The Art of Water",
    image: artOfWater,
    alt: "Premium cobalt blue water bottle on marble surface",
  },
  {
    title: "The Art of Fine Dining",
    image: fineDining,
    alt: "Luxury fine dining table setting with Saratoga water",
  },
  {
    title: "The Art of Style",
    image: artOfStyle,
    alt: "Elegant woman in blue attire with sparkling water",
  },
];

const FeatureCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="products" className="py-16 md:py-24 px-6 md:px-12 bg-cobalt-deep">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.a
              key={feature.title}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative block overflow-hidden"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cobalt-deep/80 via-transparent to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl md:text-2xl text-foreground group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-0 group-hover:w-8 h-px bg-gold transition-all duration-300" />
                  <span className="text-xs tracking-luxury uppercase text-muted-foreground group-hover:text-gold transition-colors duration-300 font-sans">
                    Explore
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;