import React from 'react';
import { Navigation, Phone, Clock, Zap, Calendar, Star, MapPin, Award, ShieldCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings, GoogleReviewData, OpeningHourDay } from '../types.js';
import heroImage from '../assets/images/coretech_storefront_1790249245485.jpg';
import { getShopStatus } from '../utils/openingHours.js';

interface HeroProps {
  business: BusinessSettings;
  googleReviews: GoogleReviewData;
  openingHours?: OpeningHourDay[];
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ business, googleReviews, openingHours }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  const shopStatus = openingHours ? getShopStatus(openingHours) : { isOpen: true, statusText: 'Open today until 6:00 PM', nextEventText: '' };

  const ratingValue = googleReviews?.rating ? googleReviews.rating.toFixed(1) : '5.0';
  const totalReviewsCount = googleReviews?.totalReviews || 11;

  return (
    <section id="hero" className="relative bg-[#070b13] text-white pt-8 pb-14 lg:pt-14 lg:pb-16 overflow-hidden border-b border-slate-800">
      {/* Subtle background radial glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#F5B942]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill/badge: LOCAL • FAST • RELIABLE */}
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F5B942]">
              <span>LOCAL</span>
              <span className="text-slate-500">•</span>
              <span>FAST</span>
              <span className="text-slate-500">•</span>
              <span>RELIABLE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
              Professional Key Cutting{' '}
              <span className="text-[#F5B942]">in Balham</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              Fast key cutting while you wait. Most house keys copied in minutes by local experts you can trust.
            </p>

            {/* 3 feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span className="font-medium">While You Wait Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span className="font-medium">Most Keys Cut in Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span className="font-medium">No Appointment Needed</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Primary Call CTA */}
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F5B942] text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-all duration-150 shadow-md active:scale-98 whitespace-nowrap"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call Now: {business.phone}</span>
              </a>

              {/* Secondary Directions CTA */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-98 whitespace-nowrap"
              >
                <Navigation className="w-4 h-4 text-slate-300" />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Bottom Status / Metro metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-medium">Open today until 6:00 PM</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>2 min from Balham Station</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset with Floating Review Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
              <img
                src={heroImage}
                alt="CoreTech storefront at 180 Balham High Road next to Costa Coffee"
                className="w-full h-72 sm:h-[380px] object-cover object-center transform transition-transform duration-500 group-hover:scale-102"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Google Review Card at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md text-slate-900 rounded-xl p-3 sm:px-4 sm:py-3 shadow-xl border border-slate-200/90 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-extrabold text-slate-900 leading-none">{ratingValue}</span>
                      <div className="flex text-[#F5B942]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {totalReviewsCount} Google Reviews
                    </span>
                  </div>
                </div>

                <a
                  href="#reviews"
                  className="text-xs font-bold text-slate-900 hover:text-[#c48e22] underline underline-offset-2 transition-colors shrink-0"
                >
                  Read Reviews
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Item Trust Bar below Hero */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-[#F5B942]/10 text-[#F5B942] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Highly Rated Local Business</p>
              <p className="text-[11px] text-slate-400">11 5-Star Google Reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-[#F5B942]/10 text-[#F5B942] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Expert Key Cutting</p>
              <p className="text-[11px] text-slate-400">Precision cuts every time</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-[#F5B942]/10 text-[#F5B942] flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Wide Range of Keys</p>
              <p className="text-[11px] text-slate-400">House, Car, Safe & More</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-[#F5B942]/10 text-[#F5B942] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Great Prices</p>
              <p className="text-[11px] text-slate-400">Competitive & Transparent</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
