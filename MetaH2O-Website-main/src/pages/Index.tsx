import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Heritage from "@/components/Heritage";
import FeatureCards from "@/components/FeatureCards";
import SocialGallery from "@/components/SocialGallery";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Heritage />
        <FeatureCards />
        <SocialGallery />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;