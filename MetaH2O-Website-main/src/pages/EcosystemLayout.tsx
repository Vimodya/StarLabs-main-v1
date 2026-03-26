import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import EcosystemNav from "../components/EcosystemNav";

const EcosystemLayout = () => {
  const location = useLocation();

  if (location.pathname === "/ecosystem" || location.pathname === "/ecosystem/") {
    return <Navigate to="/ecosystem/celebrities" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-10 font-sans">
      <Header />
      <EcosystemNav />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default EcosystemLayout;
