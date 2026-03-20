import { Instagram } from "lucide-react";
import logo from "@/assets/meta-h2o-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 bg-cobalt-deep border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <img src={logo} alt="Meta H2O Logo" className="h-12 w-auto mb-2" />
            <p className="font-sans text-xs text-muted-foreground tracking-wider">
              Premium Alkaline Spring Water
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/meta.h2o/"
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
            <p className="font-sans text-xs text-muted-foreground">
              © 2024 Meta H2O Water Co.
            </p>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;