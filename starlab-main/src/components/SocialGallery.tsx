import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const celebs = [
  { src: "/partners/50 Cent.webp", name: "50 Cent" },
  { src: "/partners/Addison Rae.webp", name: "Addison Rae" },
  { src: "/partners/Alix Earle.webp", name: "Alix Earle" },
  { src: "/partners/Ashley Graham.webp", name: "Ashley Graham" },
  { src: "/partners/Brie Garcia.jpg", name: "Brie Garcia" },
  { src: "/partners/Brooks Nader.webp", name: "Brooks Nader" },
  { src: "/partners/Coco Austin.webp", name: "Coco Austin" },
  { src: "/partners/Eva Longoria.webp", name: "Eva Longoria" },
  { src: "/partners/Hailey Bieber.webp", name: "Hailey Bieber" },
  { src: "/partners/Ice Spice.webp", name: "Ice Spice" },
  { src: "/partners/Lindsey Vonn.webp", name: "Lindsey Vonn" },
  { src: "/partners/Madison Beer.webp", name: "Madison Beer" },
  { src: "/partners/Megan Thee Stallion.webp", name: "Megan Thee Stallion" },
  { src: "/partners/Neil Patrick Harris.webp", name: "Neil Patrick Harris" },
  { src: "/partners/Nikki Garcia.webp", name: "Nikki Garcia" },
  { src: "/partners/Post Malone.webp", name: "Post Malone" },
  { src: "/partners/Sabrina Carpenter.webp", name: "Sabrina Carpenter" },
  { src: "/partners/Snoop Dogg.webp", name: "Snoop Dogg" },
  { src: "/partners/Sydney Sweeney.webp", name: "Sydney Sweeney" },
  { src: "/partners/Travis Scott.webp", name: "Travis Scott" }
];

const CelebritySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="celebrities" className="py-24 md:py-32 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center md:text-left">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl md:text-5xl text-foreground"
        >
          Our Partners
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-muted-foreground mt-4 max-w-2xl text-lg"
        >
          A unified galaxy where ultimate talent, innovative brands, and global fans align to build the future of consumer culture       </motion.p>
      </div>

      {/* Infinite Glowing Slider */}
      <div className="relative w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-10">
        <div className="overflow-hidden w-full relative py-10">

          {/* Fading Edges for the Carousel */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-6 w-max"
            animate={isInView ? { x: [0, "-50%"] } : {}}
            transition={{ duration: 70, ease: "linear", repeat: Infinity }}
          >
            {[...celebs, ...celebs].map((celeb, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)", boxShadow: "0px 0px 0px rgba(194, 146, 64, 0)" }}
                animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)", boxShadow: "0px 8px 30px -5px rgba(194, 146, 64, 0.3)" } : {}}
                transition={{ duration: 0.8, delay: (index % celebs.length) * 0.05 + 0.3 }}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-primary/20 flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64"
              >
                <img
                  src={celeb.src}
                  alt={celeb.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />

                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center">
                  <h3 className="font-serif text-sm md:text-lg text-foreground font-bold tracking-wide text-center drop-shadow-md">
                    {celeb.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CelebritySection;