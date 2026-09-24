import React from 'react';
import { Phone, Mail, MapPin, Lock } from 'lucide-react';
import { BusinessSettings } from '../types.js';

interface FooterProps {
  business: BusinessSettings;
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookies') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ business, onOpenLegal, onOpenAdmin }) => {
  return (
    <footer className="bg-[#070b13] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F5B942]/10 border border-[#F5B942]/30 flex items-center justify-center text-[#F5B942]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14ZM12.6 10C11.8 7.6 9.6 6 7 6C3.7 6 1 8.7 1 12C1 15.3 3.7 18 7 18C9.6 18 11.8 16.4 12.6 14H16V18H20V14H23V10H12.6Z" />
                </svg>
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight">
                Balham Key Cutting
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Professional key cutting services on Balham High Road. Fast, reliable and local.
            </p>

            <div className="pt-1 flex items-center gap-2 text-slate-400 text-[11px]">
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-[10px]">
                G
              </div>
              <span>Google 5.0 ★★★★★</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Services
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">House Keys</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Car Keys</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Key Fobs</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Padlocks</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Safe Keys</a></li>
            </ul>
          </div>

          {/* Col 3: Information & Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Information
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Hours & Contact
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p>Mon – Fri: 9:00 AM – 6:00 PM</p>
              <p>Saturday: 9:00 AM – 5:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            
            <div className="space-y-1.5 pt-2 text-[11px] border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#F5B942] shrink-0" />
                <a href={`tel:${business.phone.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {business.phone}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#F5B942] shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:text-white">
                  {business.email}
                </a>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-[#F5B942] shrink-0 mt-0.5" />
                <span>{business.address}, {business.postcode}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {business.businessName}. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
