import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import social1 from "@/assets/social-1.jpg";
import social2 from "@/assets/social-2.jpg";
import social3 from "@/assets/social-3.jpg";
import social4 from "@/assets/social-4.jpg";

const images = [
  { src: social1, alt: "Meta H2O at the beach during sunset" },
  { src: social2, alt: "Meta H2O fitness lifestyle flat lay" },
  { src: social3, alt: "Meta H2O on modern office desk" },
  { src: social4, alt: "Meta H2O outdoor hiking adventure" },
];

const SocialGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} id="dining" className="py-16 md:py-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            Meta H2O <em className="text-gold">Lifestyle</em>
          </h2>
          <p className="font-sans text-muted-foreground text-sm max-w-lg mx-auto">
            At Meta H2O,® we celebrate hydration in every moment — from beach sunsets 
            to mountain peaks, fitness goals to focused work days.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-cobalt-deep/0 group-hover:bg-cobalt-deep/40 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.instagram.com/meta.h2o/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors duration-300 font-sans text-sm tracking-luxury uppercase"
          >
            <span>Follow Us</span>
            <span className="w-6 h-px bg-current" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialGallery;