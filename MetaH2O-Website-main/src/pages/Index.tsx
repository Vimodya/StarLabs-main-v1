import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const firstVisit = localStorage.getItem("starlabs_first_visit");
      const now = Date.now();

      if (!firstVisit) {
        // First time visit - set timestamp and redirect to signup
        localStorage.setItem("starlabs_first_visit", now.toString());
        navigate("/signup");
      } else {
        // Returning visit - check if 24 hours have passed
        const visitTime = parseInt(firstVisit, 10);
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - visitTime > twentyFourHours) {
          navigate("/login");
        }
      }
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main>
        <Hero />
        {/* <AboutVision /> */}
        <CelebritySection />
        <BrandsSection />
        {/* <Ecosystem /> */}
        <TokenUtilitySection />
        {/* <CtaSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;