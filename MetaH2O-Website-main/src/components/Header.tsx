import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/meta-h2o-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Our Story", href: "#story" },
    { label: "Products", href: "#products" },
    { label: "Fine Dining", href: "#dining" },
    { label: "Sustainability", href: "#sustainability" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12">
      <nav className="flex items-center justify-between">
        {/* Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 text-foreground tracking-luxury text-sm font-sans uppercase hover:text-gold transition-colors duration-300"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span>Menu</span>
        </button>

        {/* Logo */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2">
          <img src={logo} alt="Meta H2O Logo" className="h-10 md:h-12 w-auto" />
        </a>

        {/* CTA Button */}
        <Link
          to="/buy"
          className="hidden md:block text-foreground tracking-luxury text-sm font-sans uppercase hover:text-gold transition-colors duration-300"
        >
          Buy Now
        </Link>
      </nav>

      {/* Full-screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 left-0 bg-cobalt-deep z-40 flex items-center justify-center"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center"
            >
              <ul className="space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-serif text-4xl md:text-6xl text-foreground hover:text-gold transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;