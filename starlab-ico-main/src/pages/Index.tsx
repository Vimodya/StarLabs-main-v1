import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TokenSaleProgress from "@/components/TokenSaleProgress";
import TopInvestors from "@/components/TopInvestors";
import Tokenomics from "@/components/Tokenomics";
import Footer from "@/components/Footer";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     const firstVisit = localStorage.getItem("starlabs_fe_visit");
  //     const now = Date.now();
  //
  //     if (!firstVisit) {
  //       // First time visit - set timestamp and redirect to signup
  //       localStorage.setItem("starlabs_fe_visit", now.toString());
  //       navigate("/signup");
  //     } else {
  //       // Returning visit - check if 24 hours have passed
  //       const visitTime = parseInt(firstVisit, 10);
  //       const twentyFourHours = 24 * 60 * 60 * 1000;
  //
  //       if (now - visitTime > twentyFourHours) {
  //         navigate("/login");
  //       }
  //     }
  //   }
  // }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TokenSaleProgress />
      {/* <TopInvestors /> */}
      <Tokenomics />
      {/* <Roadmap /> */}
      <Footer />
    </div>
  );
};

export default Index;
