import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Check } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const celebs = [
  { src: "/partners/50 Cent.webp", name: "50 Cent", id: "50-cent" },
  { src: "/partners/Addison Rae.webp", name: "Addison Rae", id: "addison-rae" },
  { src: "/partners/Alix Earle.webp", name: "Alix Earle", id: "alix-earle" },
  { src: "/partners/Ashley Graham.webp", name: "Ashley Graham", id: "ashley-graham" },
  { src: "/partners/Brie Garcia.jpg", name: "Brie Garcia", id: "brie-garcia" },
  { src: "/partners/Brooks Nader.webp", name: "Brooks Nader", id: "brooks-nader" },
  { src: "/partners/Coco Austin.webp", name: "Coco Austin", id: "coco-austin" },
  { src: "/partners/Eva Longoria.webp", name: "Eva Longoria", id: "eva-longoria" },
  { src: "/partners/Hailey Bieber.webp", name: "Hailey Bieber", id: "hailey-bieber" },
  { src: "/partners/Ice Spice.webp", name: "Ice Spice", id: "ice-spice" },
  { src: "/partners/Lindsey Vonn.webp", name: "Lindsey Vonn", id: "lindsey-vonn" },
  { src: "/partners/Madison Beer.webp", name: "Madison Beer", id: "madison-beer" },
  { src: "/partners/Megan Thee Stallion.webp", name: "Megan Thee Stallion", id: "megan-thee-stallion" },
  { src: "/partners/Neil Patrick Harris.webp", name: "Neil Patrick Harris", id: "neil-patrick-harris" },
  { src: "/partners/Nikki Garcia.webp", name: "Nikki Garcia", id: "nikki-garcia" },
  { src: "/partners/Post Malone.webp", name: "Post Malone", id: "post-malone" },
  { src: "/partners/Sabrina Carpenter.webp", name: "Sabrina Carpenter", id: "sabrina-carpenter" },
  { src: "/partners/Snoop Dogg.webp", name: "Snoop Dogg", id: "snoop-dogg" },
  { src: "/partners/Sydney Sweeney.webp", name: "Sydney Sweeney", id: "sydney-sweeney" },
  { src: "/partners/Travis Scott.webp", name: "Travis Scott", id: "travis-scott" },
];

const Celebrities = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [followed, setFollowed] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleFollow = async (e: React.MouseEvent, celeb: { name: string; id: string }) => {
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const isFollowing = followed.includes(celeb.name);

    // Optimistic UI update
    setFollowed((prev) =>
      isFollowing ? prev.filter((n) => n !== celeb.name) : [...prev, celeb.name]
    );
    setLoadingId(celeb.name);

    try {
      await axiosInstance.post("/user/follow", { celebrityId: celeb.id });
    } catch (err) {
      console.error("Follow action failed:", err);
      // Revert optimistic update on failure
      setFollowed((prev) =>
        isFollowing ? [...prev, celeb.name] : prev.filter((n) => n !== celeb.name)
      );
    } finally {
      setLoadingId(null);
    }
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
                onClick={(e) => toggleFollow(e, celeb)}
                disabled={loadingId === celeb.name}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-60 ${
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
