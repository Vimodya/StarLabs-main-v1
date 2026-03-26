import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const opBrands = [
  {
    title: "The Salmon Sperm",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.29.jpeg",
    subtitle: "science-based facial skincare line with purified salmon PDRN (polydeoxyribonucleotides) taking center stage as the star ingredient. ",
    status: "Live"
  },
  {
    title: "Soothe Stick",
    image: "/images/Soothe & Heal Stick.png",
    subtitle: "Low-CAC, viral single-product brand for skin relief.",
    status: "Live"
  },
  {
    title: "Made Men",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.29.jpeg",
    subtitle: "A natural, sustainable men’s grooming and skincare line with a $1 million annual run rate and a footprint in over 30,000 barbershops",
    status: "Live"
  },
];

const upcomingBrands = [
  {
    title: "NIXT",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.32.jpeg",
    subtitle: "A patent-pending hair removal and growth-inhibition line with mass Gen Z appeal.",
    status: "Coming Soon"
  },
  {
    title: "High Heels and Hustle",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.34.jpeg",
    subtitle: "A luxury lifestyle brand for the modern woman on the go.",
    status: "Coming Soon"
  },
  {
    title: "Mom Pro",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.32.jpeg",
    subtitle: "Innovative breastfeeding and postpartum products created in partnership with celebrity Coco Austin",
    status: "Coming Soon"
  },
  {
    title: "High Heels & Hustle",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.32.jpeg",
    subtitle: "A specialized foot care line for women that relieves pain and reduces swelling from wearing heels.",
    status: "Coming Soon"
  },
  {
    title: "Dubai Chocolate",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.32.jpeg",
    subtitle: "A celebrity-branded chocolate line entering a global distribution funnel that moves 5 million bars per month",
    status: "Coming Soon"
  },
  {
    title: "Hot girl Protein",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.32.jpeg",
    subtitle: "A functional salad dressing line that is high-protein and metabolism-boosting, designed to taste sinful while staying healthy",
    status: "Coming Soon"
  },
];

const BrandsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const renderBrand = (brand: any, index: number) => (
    <motion.div
      key={brand.title}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-elegant hover:border-gold/50 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-video w-full overflow-hidden bg-white/5 relative">
        <img
          src={brand.image}
          alt={brand.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-gold/50 text-gold text-xs px-3 py-1 font-sans rounded-full uppercase tracking-wider font-semibold">
          {brand.status}
        </div>
      </div>

      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-2xl xl:text-3xl text-foreground font-semibold mb-3 group-hover:text-gold transition-colors duration-300 leading-tight">
            {brand.title}
          </h3>
          <p className="text-sm sm:text-base mt-2 text-muted-foreground font-sans line-clamp-3 leading-relaxed">
            {brand.subtitle}
          </p>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <span className="text-xs sm:text-sm uppercase text-gold font-sans font-semibold tracking-wider hover:opacity-80 transition-opacity">
            Learn More
          </span>
          <span className="w-8 h-px bg-gold" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <section ref={ref} id="brands" className="py-24 md:py-32 px-6 sm:px-10 lg:px-16 xl:px-24 bg-background">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-16 text-center md:text-left">
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">Our Products</h2>
          <p className="text-muted-foreground max-w-2xl font-sans text-lg">
            A diversified ecosystem of celebrity-backed brands spanning beauty, wellness, and consumer goods each anchored by tangible revenue and global distribution      </p>
        </div>

        <div className="mb-16">
          <h3 className="font-sans text-xl uppercase tracking-widest text-gold mb-10 font-semibold border-b border-border/50 pb-4 inline-block">Operational Brands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {opBrands.map((b, i) => renderBrand(b, i))}
          </div>
        </div>

        <div className="mt-20 xl:mt-24">
          <h3 className="font-sans text-xl uppercase tracking-widest text-muted-foreground mb-10 font-semibold border-b border-border/50 pb-4 inline-block">Upcoming Launches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {upcomingBrands.map((b, i) => renderBrand(b, i + 2))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;