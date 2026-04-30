import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Menu, X } from 'lucide-react';

const Navbar = ({ onLogoClick, analysisCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass-navbar shadow-glass-lg' 
          : 'bg-transparent'
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onLogoClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-accent-purple flex items-center justify-center shadow-glow-brand transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(33,118,255,0.5)]">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-teal animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight font-display">
                DocEYE <span className="gradient-text">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase hidden sm:block leading-none">
                Medical Intelligence
              </p>
            </div>
          </motion.div>

          {/* Center Tagline */}
          <div className="hidden lg:flex items-center">
            <p className="text-sm text-slate-400 font-medium">
              <Zap className="w-3.5 h-3.5 inline mr-1.5 text-accent-amber" />
              Seeing the Truth Behind Medical Reports
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {analysisCount > 0 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-glass-light border border-glass-border"
              >
                <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                <span className="text-xs font-medium text-slate-300">
                  {analysisCount} {analysisCount === 1 ? 'scan' : 'scans'}
                </span>
              </motion.div>
            )}
            
            <button 
              className="lg:hidden p-2 rounded-xl bg-glass-light border border-glass-border text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Glow line at bottom */}
      <div className={`glow-line transition-opacity duration-500 ${scrolled ? 'opacity-50' : 'opacity-0'}`} />
    </motion.header>
  );
};

export default Navbar;
