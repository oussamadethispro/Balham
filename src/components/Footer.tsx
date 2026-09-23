import React from 'react';
import { Phone, MessageSquare, MapPin, ShieldCheck, Lock, ArrowUp } from 'lucide-react';
import { BusinessSettings } from '../types.js';

interface FooterProps {
  business: BusinessSettings;
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookies') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ business, onOpenLegal, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I have an enquiry.'
  )}`;

  return (
    <footer className="bg-[#0b0f17] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-white tracking-tight">
                Balham Key Cutting
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Independent key duplication workshop on Balham High Road, London SW12. Fast, precision duplicate keys cut on calibrated machinery while you wait.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Key Cutting Services</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Workshop</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
              <li><a href="#location" className="hover:text-white transition-colors">Find Us on Map</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Key Cutting Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Cylinder & Yale Front Door Keys</li>
              <li>Mortice & 5-Lever Chubb Deadlocks</li>
              <li>Euro Profile Cylinder Keys</li>
              <li>Office Cabinet & Desk Keys</li>
              <li>Padlock & Shed Keys</li>
              <li>Bulk Landlord Duplication Sets</li>
            </ul>
          </div>

          {/* Col 4: Shop Location & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Balham Workshop
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#F5B942] shrink-0 mt-0.5" />
                <span>
                  {business.address}, {business.area}, {business.city} {business.postcode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5B942] shrink-0" />
                <a href={`tel:${business.phone.replace(/\s+/g, '')}`} className="hover:text-white font-semibold">
                  {business.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#F5B942] shrink-0" />
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {business.businessName}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('cookies')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Cookie Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 hover:text-white text-slate-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
