import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Vision", href: "#vision" },
    { label: "Our Network", href: "#celebrities" },
    { label: "Our Products", href: "#brands" },
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "$STAR Token", href: "#token" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md bg-background/50 border-b border-border/10">
        <nav className="relative z-50 flex items-center justify-between">
        {/* Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 text-foreground tracking-luxury text-sm font-sans uppercase hover:text-gold transition-colors duration-300"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="font-semibold tracking-[0.2em]">{isMenuOpen ? "Close" : "Menu"}</span>
        </button>

        {/* Logo */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/images/logo.png" alt="Star Labs Logo" className="h-10 md:h-12 w-auto filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" style={{ WebkitFilter: "drop-shadow(0px 0px 1px white)" }} />
        </a>

        {/* CTA Button */}
        <a
          href="http://localhost:8081/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-gold tracking-[0.2em] text-sm font-sans font-semibold uppercase hover:text-gold-light transition-colors duration-300"
        >
          Early Access
        </a>
        </nav>
      </header>

      {/* Dim Background Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 1/4 Screen Side Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] sm:w-[60vw] lg:w-1/4 bg-[#0A0A0F] z-40 border-r border-[#EEA62C]/20 shadow-[20px_0_60px_-15px_rgba(255,191,0,0.1)] flex flex-col pt-32 px-10 md:px-16"
          >
            <nav className="flex-1 flex flex-col mt-10">
              <ul className="space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-serif text-3xl md:text-4xl text-white hover:text-[#EEA62C] transition-colors duration-300 block drop-shadow-md"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            
            <div className="pb-12 text-white/50 text-xs uppercase tracking-widest font-sans font-semibold">
              Star Labs © 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;