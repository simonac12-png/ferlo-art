import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src="/ferlo-logo.png" alt="FerLo Logo" className="h-8 md:h-10" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#waitlist" className="hover:text-primary transition-colors">Waitlist</a>
        </div>

        <a 
          href="#waitlist" 
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          data-testid="nav-join-waitlist"
        >
          Join waitlist
        </a>
      </div>
    </motion.nav>
  );
}