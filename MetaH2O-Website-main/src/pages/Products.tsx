import { motion } from "framer-motion";

export const opBrands = [
  {
    title: "The Salmon Sperm",
    image: "/images/WhatsApp Image 2026-03-17 at 20.38.29.jpeg",
    subtitle: "science-based facial skincare line with purified salmon PDRN (polydeoxyribonucleotides) taking center stage as the star ingredient.",
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

export const upcomingBrands = [
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

const Products = () => {
  const renderBrand = (brand: any, index: number) => (
    <motion.div
      key={brand.title}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 * (index % 3) }}
      className="group bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-[0_10px_30px_-5px_rgba(238,166,44,0.3)] transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-black/5 relative">
        <img
          src={brand.image}
          alt={brand.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-primary/50 text-primary text-[10px] md:text-xs px-3 py-1 font-sans rounded-full uppercase tracking-wider font-bold shadow-md">
          {brand.status}
        </div>
      </div>
      
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-2xl xl:text-3xl text-foreground font-semibold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
            {brand.title}
          </h3>
          <p className="text-sm sm:text-base mt-2 text-muted-foreground font-sans line-clamp-3 leading-relaxed">
            {brand.subtitle}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          {brand.status === "Live" ? (
            <button className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-[#ffe399] hover:-translate-y-0.5 transition-all duration-300">
              Buy Product
            </button>
          ) : (
            <button className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-primary/20 hover:-translate-y-0.5 transition-all duration-300">
              Notify Me
            </button>
          )}
          
          <button className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-lg border border-border text-foreground font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-300">
            Participate in Campaign
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pb-32">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        
        <div className="mb-20">
          <h3 className="font-sans text-xl sm:text-2xl uppercase tracking-widest text-primary mb-12 font-bold border-b border-border pb-4 inline-block w-full text-center">Operational Brands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {opBrands.map((b, i) => renderBrand(b, i))}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-xl sm:text-2xl uppercase tracking-widest text-muted-foreground mb-12 font-bold border-b border-border pb-4 inline-block w-full text-center">Upcoming Launches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {upcomingBrands.map((b, i) => renderBrand(b, i + 2))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Products;
