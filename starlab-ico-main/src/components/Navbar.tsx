import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, userAddress } = useAuth();
  const { connecting, disconnect } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleNavClick = (href: string, isAnchor: boolean) => {
    setIsMenuOpen(false);
    if (isAnchor) {
      // If we are not on the homepage, navigate there first
      if (location.pathname !== "/") {
        navigate("/");
        // Small delay to allow navigation to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(href.replace("#", ""));
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.getElementById(href.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(href);
    }
  };

  const navLinks = [
    { href: "#about", label: "About", isAnchor: true },
    { href: "#tokenomics", label: "Tokenomics", isAnchor: true },
    { href: "#partners", label: "Partners", isAnchor: true },
    { href: "/dashboard", label: "Dashboard", isAnchor: false },
    { href: "/buy", label: "Buy Tokens", isAnchor: false },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/horizontal holdings.svg"
                alt="Star Labs Logo"
                className="w-28 h-14 object-contain"
              />
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <WalletMultiButton className="!bg-gradient-primary hover:!opacity-90 !transition-opacity !glow-effect !rounded-lg !px-4 !py-2 !h-auto !text-primary-foreground" />
                {connecting && (
                  <Button
                    onClick={() => disconnect()}
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>

              {/* Menu Toggle Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 bg-white/50 hover:bg-white/80 border border-black/5 rounded-full shadow-sm transition-colors text-foreground"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Half Screen Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div className="relative w-full md:w-1/2 h-full bg-background border-l border-border/50 shadow-2xl flex flex-col justify-center animate-in slide-in-from-right duration-300">
            {/* Soft decorative background in overlay */}
            <div className="absolute top-0 right-0 w-full h-1/2 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-secondary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white/80 border border-black/5 rounded-full shadow-sm transition-colors text-foreground"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col px-12 sm:px-24 space-y-8">
              <div className="mb-8">
                <img
                  src="/star-labs-logo.png"
                  alt="Star Labs"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>

              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.isAnchor)}
                    className="text-left text-2xl md:text-4xl font-bold text-foreground/70 hover:text-primary hover:translate-x-2 transition-all flex items-center group"
                  >
                    <span className="w-8 h-1 bg-primary mr-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></span>
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Added trust indicators to menu */}
              {/* <div className="mt-16 pt-8 border-t border-black/5 flex items-center gap-6">
                <div className="text-sm">
                  <p className="text-muted-foreground font-semibold uppercase tracking-wider mb-1">Network</p>
                  <p className="font-bold text-foreground">Solana SPL</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground font-semibold uppercase tracking-wider mb-1">Security</p>
                  <p className="font-bold text-foreground">Audited</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
