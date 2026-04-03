import { Instagram, Twitter } from "lucide-react";
import logo from "@/assets/meta-h2o-logo.png"; // We will rename the import name but it doesn't matter, we'll use "/images/logo.png"

const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <img src="/images/logo.png" alt="Star Labs Logo" className="h-10 w-auto mb-3 filter brightness-0 invert" style={{ WebkitFilter: "drop-shadow(0px 0px 1px white)" }} />
            <p className="font-sans text-xs text-muted-foreground tracking-wider font-semibold">
              Star Labs
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold transition-colors duration-300"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="font-sans text-xs text-muted-foreground mb-1">
              © {new Date().getFullYear()} Star Labs Holdings. All rights reserved.
            </p>
            <p className="font-sans text-xs text-muted-foreground/50 max-w-xs">
              Not financial advice. Please do your own research before participating in the token ecosystem.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;