import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TokenSaleProgress from "@/components/TokenSaleProgress";
import TopInvestors from "@/components/TopInvestors";
import Partners from "@/components/Partners";
import Tokenomics from "@/components/Tokenomics";
// import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TokenSaleProgress />
      {/* <TopInvestors /> */}
      <Partners />
      <Tokenomics />
      {/* <Roadmap /> */}
      <Footer />
    </div>
  );
};

export default Index;
