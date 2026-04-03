import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  hero?: boolean;
}

const team: TeamMember[] = [
  {
    name: "Andrea Horblitt",
    role: "CEO (Star Lab Holdings) / Chairwoman (Star Lab Fund)",
    bio: "Founder of Star Lab with 25 years of experience in celebrity-backed products and blockchain engagement. Mentored by advertising legend George Lois, she has built authentic celebrity brands generating substantial sales across global markets.",
    image: "/team/Andrea Horblitt.png", // User mentioned this may need updating
    hero: true,
  },
  {
    name: "Oz Sultan",
    role: "CEO (Star Lab Fund) / Advisor (Star Lab Holdings)",
    bio: "Blockchain and big data strategist with two decades of experience advising global organizations. Oz is a recognized leader in RWA digital asset tokenization, cryptocurrency policy, and large-scale data strategy.",
    image: "/team/Oz Sultan.jpg",
  },
  {
    name: "Colleen Ferrier",
    role: "President (Star Lab Holdings)",
    bio: "Marketing strategist with 20+ years guiding early-stage growth to multimillion-dollar exits. Previously COO of Infomercials Inc., she has scaled brands past $500M through data-driven storytelling and execution.",
    image: "/team/Colleen Ferrier.jpg",
  },
  {
    name: "Kyle Rudden",
    role: "CFO/COO (Star Lab Holdings & Star Lab Fund)",
    bio: "Expert in global corporate finance and capital markets. A former Institutional Investor-ranked analyst at J.P. Morgan, Kyle specializes in energy M&A, blockchain-enabled supply chains, and operational infrastructure.",
    image: "/team/Kyle Rudden.png",
  },
  {
    name: "Manos E. Megagiannis",
    role: "Chief Technology Officer (Star Lab Fund)",
    bio: "Senior technology executive focusing on mission-critical infrastructures, cybersecurity, and blockchain architecture. Manos has scaled platforms supporting millions of users and billions in transactions globally.",
    image: "/team/Manos E. Megagiannis.png",
  },
  {
    name: "Solomon Onyebuchi",
    role: "Chief Marketing Officer (Star Lab Fund)",
    bio: "Certified Business Analyst and blockchain marketing expert. Solomon scaled user adoption for major Web3 initiatives reach billions in market cap, leveraging 15+ years in the global entertainment industry.",
    image: "/team/Solomon Onyebuchi.png",
  },
  {
    name: "Nicole Andani",
    role: "Vice President (Star Lab Holdings)",
    bio: "Global consumer brand specialist with 25+ years experience. Nicole has led international expansion into 90 global markets for brands like Proactiv and Meaningful Beauty, generating hundreds of millions in revenue.",
    image: "/team/Nicole Andani.jpg",
  },
  {
    name: "Shayne Ferrier",
    role: "Executive Director (Star Lab Holdings)",
    bio: "Operations leader focused on brand expansion and community-centered service delivery. Shayne optimizes performance through scalable systems and builds brand reputation through service-first communication.",
    image: "/team/Shayne Ferrier.png",
  },
  {
    name: "Jason Gastwirth",
    role: "Advisor (Star Lab Holdings)",
    bio: "Former President of Entertainment at Caesars Entertainment. Jason specializes in live programming and disciplined marketing strategy for some of the largest entertainment portfolios in the world.",
    image: "/team/Jason Gastwirth.png",
  },
  {
    name: "Loretta Joseph",
    role: "Advisor (Star Lab Holdings)",
    bio: "Globally recognized FinTech and regulatory advisor. A blockchain consultant to the OECD, Loretta has led digital asset policy and held executive roles at top global investment banks like Deutsche Bank.",
    image: "/team/Loretta Joseph.jpg",
  },
  {
    name: "Barry Shaich",
    role: "Star Lab Fund (Egg Beauty Labs)",
    bio: "Beauty industry founder with a record of building iconic brands including Aveda and American Crew. Barry specializes in digital reinvention and scaling brands for successful global acquisitions.",
    image: "/team/Barry Shaich.jpg",
  },
  {
    name: "Howard V. Lewis",
    role: "Star Lab Fund (Egg Beauty Labs)",
    bio: "Beauty industry executive with extensive experience scaling influential brands like L'Oréal and Shea Moisture. Howard specializes in growth strategy and omni-channel distribution networks.",
    image: "/team/Howard V. Lewis.png", // Note: Verify if this file exists or needs placeholder
  },
  {
    name: "Josanta Gray Emagano",
    role: "Star Lab Fund (Egg Beauty Labs)",
    bio: "Senior beauty executive and former COO of Beauty Bakerie Cosmetics. Josanta blends marketing insights and celebrity branding expertise to build culturally relevant and scalable consumer brands.",
    image: "/team/Josanta Gray Emagano.jpg",
  },
];
const Team = () => {
  const heroMember = team.find(m => m.hero);
  const gridMembers = team.filter(m => !m.hero);

  // Helper to determine the checkerboard pattern color
  const getBgColor = (idx: number) => {
    // We want a mix of White and Light Blue/Grey as in the image
    const colors = ["bg-white", "bg-[#E0F7F9]", "bg-white", "bg-[#F5F5F5]"];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1920px] mx-auto pt-24">
        {/* Top Hero Section - 2 columns wide matching image style */}
        {heroMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden max-w-6xl mx-auto"
          >
            <div className="aspect-[16/9] lg:aspect-auto h-[300px] lg:h-[450px] overflow-hidden">
              <img
                src={heroMember.image}
                alt={heroMember.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center items-center text-center p-9 lg:p-15 bg-[#E0F7F9]">
              <h1 className="font-sans text-2xl lg:text-3xl text-stone-900 font-bold mb-4 tracking-[0.1em] uppercase">
                {heroMember.name}
              </h1>
              <p className="font-sans text-stone-600 text-base leading-relaxed max-w-lg mb-6">
                {heroMember.bio}
              </p>
              <div className="w-9 h-[1px] bg-stone-300 mb-6" />
              <div className="text-stone-900">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* Secondary Members Grid - 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {gridMembers.map((member, i) => {
            // Calculate if we should show [Image, Text] or [Text, Image]
            // We want to alternate specifically such that they form a checkerboard.
            // Row index (in 4 column grid): Math.floor(i / 2) - since each member takes 2 cells (img + txt)
            // But we are mapping members, and each member is TWO cells.
            
            // Actually, in a 4-column grid, we want:
            // Row 1: I T I T
            // Row 2: T I T I
            // Row 3: I T I T
            // etc.

            const rowNum = Math.floor(i / 2);
            const isReverse = rowNum % 2 === 1;
            const bgIndex = (i * 2 + (isReverse ? 1 : 0));

            return (
              <div key={i} className="contents">
                {!isReverse ? (
                  <>
                    {/* Profile Image Cell */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="aspect-square overflow-hidden"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </motion.div>

                    {/* Text Description Cell */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className={`aspect-square flex flex-col justify-center items-center p-10 text-center border-stone-50 ${getBgColor(bgIndex)}`}
                    >
                      <h3 className="font-sans text-xl text-stone-900 font-bold tracking-[0.1em] mb-4 uppercase">
                        {member.name}
                      </h3>
                      <p className="font-sans text-stone-600 text-xs leading-relaxed max-w-[220px] mb-6 line-clamp-4">
                        {member.bio}
                      </p>
                      <div className="w-8 h-[1px] bg-stone-300 mb-6" />
                      <div className="text-stone-900 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Text Description Cell FIRST */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className={`aspect-square flex flex-col justify-center items-center p-10 text-center border-stone-50 ${getBgColor(bgIndex)}`}
                    >
                      <h3 className="font-sans text-xl text-stone-900 font-bold tracking-[0.1em] mb-4 uppercase">
                        {member.name}
                      </h3>
                      <p className="font-sans text-stone-600 text-xs leading-relaxed max-w-[220px] mb-6 line-clamp-4">
                        {member.bio}
                      </p>
                      <div className="w-8 h-[1px] bg-stone-300 mb-6" />
                      <div className="text-stone-900 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      </div>
                    </motion.div>

                    {/* Profile Image Cell SECOND */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="aspect-square overflow-hidden"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </motion.div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};;

export default Team;
