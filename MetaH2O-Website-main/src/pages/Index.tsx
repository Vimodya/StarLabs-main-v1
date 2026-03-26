import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutVision from "@/components/AboutVision";
import CelebritySection from "@/components/SocialGallery";
import BrandsSection from "@/components/FeatureCards";
import Ecosystem from "@/components/Ecosystem";
import TokenUtilitySection from "@/components/Heritage";
import CtaSection from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main>
        <Hero />
        {/* <AboutVision /> */}
        <CelebritySection />
        <BrandsSection />
        {/* <Ecosystem /> */}
        {/* <TokenUtilitySection /> */}
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;