import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Check } from "lucide-react";

export const celebs = [
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

const Celebrities = () => {
  const [followed, setFollowed] = useState<string[]>([]);
  
  const toggleFollow = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setFollowed(prev => prev.includes(name) 
      ? prev.filter(n => n !== name)
      : [...prev, name]
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pb-32">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
      >
        {celebs.map((celeb, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
            key={i} 
            className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer bg-card border border-border"
          >
            <img 
              src={celeb.src} 
              alt={celeb.name} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" 
            />
            {/* Elegant dark overlay strictly bound to bottom to push text forward */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/90 via-[#0A0A0F]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Name & Action Hover Reveal over the gradient */}
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center justify-end transition-all duration-700 transform translate-y-8 group-hover:translate-y-0 text-center opacity-0 group-hover:opacity-100">
              <h3 className="font-serif text-2xl md:text-3xl text-white font-bold tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-4">
                {celeb.name}
              </h3>
              
              <button 
                onClick={(e) => toggleFollow(e, celeb.name)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  followed.includes(celeb.name) 
                  ? "bg-white/20 text-white border border-white/50 backdrop-blur-md" 
                  : "bg-primary text-black hover:bg-[#ffe399] hover:scale-105 shadow-lg shadow-primary/20"
                }`}
              >
                {followed.includes(celeb.name) ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Celebrities;
