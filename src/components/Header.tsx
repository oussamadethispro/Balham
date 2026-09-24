import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';
import { BusinessSettings, OpeningHourDay } from '../types.js';

interface HeaderProps {
  business: BusinessSettings;
  openingHours: OpeningHourDay[];
  onOpenContact: (service?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ business, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#0b1320]/95 backdrop-blur-md shadow-md border-b border-slate-800/80 py-3.5'
            : 'bg-[#0b1320] border-b border-slate-800/80 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Wordmark & Key Icon */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#F5B942]/10 border border-[#F5B942]/30 flex items-center justify-center text-[#F5B942] group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14ZM12.6 10C11.8 7.6 9.6 6 7 6C3.7 6 1 8.7 1 12C1 15.3 3.7 18 7 18C9.6 18 11.8 16.4 12.6 14H16V18H20V14H23V10H12.6Z" />
              </svg>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white block leading-tight">
                Balham Key Cutting
              </span>
            </div>
          </a>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold text-slate-300">
            <a href="#hero" className="text-white hover:text-[#F5B942] transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Call & Quote Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${business.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>{business.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenContact()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#F5B942] hover:bg-[#e6ab33] rounded-lg shadow-sm transition-all duration-150 active:scale-98 whitespace-nowrap"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3 h-3 text-slate-950" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e1726] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-200">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors text-white"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Services
              </a>
              <a
                href="#why-us"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Why Us
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                About Us
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Reviews
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 text-white font-bold text-xs uppercase tracking-wider"
              >
                <Phone className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Call {business.phone}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F5B942] text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
