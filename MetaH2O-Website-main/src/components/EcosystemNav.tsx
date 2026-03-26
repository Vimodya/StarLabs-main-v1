import { Link, useLocation } from "react-router-dom";

const EcosystemNav = () => {
  const location = useLocation();
  const isCel = location.pathname.includes("/celebrities");
  const isProd = location.pathname.includes("/products");

  return (
    <div className="w-full flex justify-center mt-32 mb-16 px-6 z-20 relative">
      <div className="flex items-center p-1.5 bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-full shadow-lg">
        <Link
          to="/ecosystem/celebrities"
          className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 ${isCel ? "bg-primary text-black shadow-md shadow-primary/20" : "text-foreground/60 hover:text-foreground"}`}
        >
          Celebrities
        </Link>
        <Link
          to="/ecosystem/products"
          className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 ${isProd ? "bg-primary text-black shadow-md shadow-primary/20" : "text-foreground/60 hover:text-foreground"}`}
        >
          Products
        </Link>
      </div>
    </div>
  );
};

export default EcosystemNav;
