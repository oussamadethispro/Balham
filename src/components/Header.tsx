import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Menu, X, Clock, MapPin, Navigation } from 'lucide-react';
import { BusinessSettings, OpeningHourDay } from '../types.js';
import { getShopStatus } from '../utils/openingHours.js';

interface HeaderProps {
  business: BusinessSettings;
  openingHours: OpeningHourDay[];
  onOpenContact: (service?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ business, openingHours, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const status = getShopStatus(openingHours);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I would like to enquire about key cutting.'
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  return (
    <>
      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-3'
            : 'bg-white border-b border-slate-200 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-3 group">
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                Balham Key Cutting
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#hero" className="hover:text-slate-950 transition-colors">Home</a>
            <a href="#services" className="hover:text-slate-950 transition-colors">Key Cutting</a>
            <a href="#about" className="hover:text-slate-950 transition-colors">About Us</a>
            <a href="#reviews" className="hover:text-slate-950 transition-colors">Reviews</a>
            <a href="#location" className="hover:text-slate-950 transition-colors">Location</a>
            <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-slate-950 transition-colors">Contact</a>
          </nav>

          {/* Zone 3: Call & WhatsApp Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${business.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-slate-900" />
              Call Now
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#F5B942] hover:bg-[#e6ab33] rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              WhatsApp
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <nav className="flex flex-col space-y-2 text-base font-semibold text-slate-800">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Key Cutting Services
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                About Our Workshop
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Customer Reviews
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Find Us on Balham High Road
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Frequently Asked Questions
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Contact & Enquiries
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold bg-slate-900 text-white"
              >
                <Phone className="w-4 h-4 text-[#F5B942]" />
                Call Now
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold bg-[#F5B942] text-slate-950"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
