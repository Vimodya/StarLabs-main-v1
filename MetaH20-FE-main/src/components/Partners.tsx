
const mainPartners = [
  { name: "50 Cent", image: "/partners/50 Cent.webp" },
  { name: "Megan Thee Stallion", image: "/partners/Megan Thee Stallion.webp" },
  { name: "Sabrina Carpenter", image: "/partners/Sabrina Carpenter.webp" },
  { name: "Sydney Sweeney", image: "/partners/Sydney Sweeney.webp" },
  { name: "Addison Rae", image: "/partners/Addison Rae.webp" },
];

const otherPartners = [
  { name: "Alix Earle", image: "/partners/Alix Earle.webp" },
  { name: "Ashley Graham", image: "/partners/Ashley Graham.webp" },
  { name: "Brie Garcia", image: "/partners/Brie Garcia.jpg" },
  { name: "Brooks Nader", image: "/partners/Brooks Nader.webp" },
  { name: "Coco Austin", image: "/partners/Coco Austin.webp" },
  { name: "Eva Longoria", image: "/partners/Eva Longoria.webp" },
  { name: "Hailey Bieber", image: "/partners/Hailey Bieber.webp" },
  { name: "Ice Spice", image: "/partners/Ice Spice.webp" },
  { name: "Lindsey Vonn", image: "/partners/Lindsey Vonn.webp" },
  { name: "Madison Beer", image: "/partners/Madison Beer.webp" },
  { name: "Neil Patrick Harris", image: "/partners/Neil Patrick Harris.webp" },
  { name: "Nikki Garcia", image: "/partners/Nikki Garcia.webp" },
  { name: "Post Malone", image: "/partners/Post Malone.webp" },
  { name: "Snoop Dogg", image: "/partners/Snoop Dogg.webp" },
  { name: "Travis Scott", image: "/partners/Travis Scott.webp" },
];

const Partners = () => {
  return (
    <section id="partners" className="py-24 bg-white/30 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-[1100px]">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground uppercase tracking-tighter">Partners</h2>
          <div className="h-1 w-24 bg-gradient-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Our exclusive network of global icons shaping the future of culture and decentralization.
          </p>
        </div>

        {/* Main Partners */}
        <div className="mb-20">
          <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-x-16 lg:gap-x-20">
            {mainPartners.map((partner, index) => {
              const pos = index % 5;
              let gridClass = "col-span-6 md:col-span-4";
              if (pos === 3) {
                gridClass = "col-span-6 md:col-span-4 md:col-start-3";
              }

              return (
                <div
                  key={partner.name}
                  className={`group cursor-pointer bg-white/70 backdrop-blur-md p-4 md:p-5 rounded-[2rem] shadow-sm border border-black/5 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-in-out ${gridClass}`}
                >
                  <div className="relative overflow-hidden aspect-[4/5] bg-secondary/10 rounded-[1.25rem] mb-5">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-extrabold text-foreground uppercase tracking-widest text-center group-hover:text-primary transition-colors">
                    {partner.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Partners - Slightly smaller cards */}
        <div>
          <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-x-16 lg:gap-x-20">
            {otherPartners.map((partner, index) => {
              const pos = index % 5;
              let gridClass = "col-span-6 md:col-span-4";
              if (pos === 3) {
                gridClass = "col-span-6 md:col-span-4 md:col-start-3";
              }

              return (
                <div
                  key={partner.name}
                  className={`group cursor-pointer bg-white/50 backdrop-blur-sm p-3 md:p-4 rounded-[1.5rem] shadow-sm border border-black/5 hover:border-black/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-in-out ${gridClass}`}
                >
                  <div className="relative overflow-hidden aspect-[4/5] bg-secondary/10 rounded-xl mb-4">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-foreground/80 uppercase tracking-widest text-center group-hover:text-primary transition-colors">
                    {partner.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;

