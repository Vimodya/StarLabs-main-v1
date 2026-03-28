import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Coins, LogIn, UserPlus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = [
    { label: "Vision", href: "#vision" },
    { label: "Our Network", href: "#celebrities" },
    { label: "Our Products", href: "#brands" },
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
            <img src="/images/horizontal holdings.svg" alt="Star Labs Logo" className="h-10 md:h-12 w-auto filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" style={{ WebkitFilter: "drop-shadow(0px 0px 1px white)" }} />
          </a>

          {/* CTA Button — Investor Buy Tokens */}
          <a
            href="http://localhost:8081/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-3 group relative overflow-hidden px-5 py-2.5 rounded-xl border border-[#EEA62C]/40 bg-[#EEA62C]/5 hover:bg-[#EEA62C]/10 hover:border-[#EEA62C]/70 transition-all duration-300 hover:shadow-[0_0_20px_rgba(238,166,44,0.2)]"
          >
            {/* shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#EEA62C]/10 to-transparent pointer-events-none" />
            <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#EEA62C]/15 border border-[#EEA62C]/30 group-hover:bg-[#EEA62C]/25 transition-colors duration-300">
              <Coins className="w-4 h-4 text-[#EEA62C]" />
            </span>
            <span className="relative flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#EEA62C]/60 font-semibold font-sans">Investor?</span>
              <span className="text-sm font-bold tracking-[0.1em] text-[#EEA62C] font-sans uppercase">Buy Tokens</span>
            </span>
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

            <div className="pb-10 pt-6 border-t border-[#EEA62C]/15 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold font-sans uppercase tracking-[0.15em] transition-all"
                    style={{ background: 'hsl(41 80% 55% / 0.15)', border: '1px solid hsl(41 80% 55% / 0.3)', color: '#EEA62C' }}
                  >
                    <User className="w-4 h-4" />
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold font-sans uppercase tracking-[0.15em] transition-all text-left"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Auth links hidden temporarily */}
                  {/* <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold font-sans uppercase tracking-[0.15em] transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold font-sans uppercase tracking-[0.15em] transition-all"
                    style={{ background: 'linear-gradient(135deg, hsl(41 80% 55%) 0%, hsl(36 70% 45%) 100%)', color: 'white' }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </Link> */}
                </>
              )}
              <p className="text-white/25 text-xs uppercase tracking-widest font-sans font-semibold pt-2">Star Labs © 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;