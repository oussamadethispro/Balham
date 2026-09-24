import React from 'react';
import { Navigation, MessageSquare, Phone, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings, GoogleReviewData } from '../types.js';
import heroImage from '../assets/images/coretech_storefront_1790249245485.jpg';

interface HeroProps {
  business: BusinessSettings;
  googleReviews: GoogleReviewData;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ business, googleReviews }) => {
  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I would like to enquire about key cutting.'
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  return (
    <section id="hero" className="relative bg-[#0d1117] text-white pt-10 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-800">
      {/* Subtle background radial glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#F5B942]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance"
            >
              Professional Key Cutting in Balham
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal"
            >
              Fast, reliable key duplication and key cutting services in Balham, London. Duplicate cylinder, mortice, house, and commercial keys quickly and accurately.
            </motion.p>

            {/* 3 Call-To-Actions in explicit priority order */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {/* Primary CTA */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F5B942] text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-all duration-150 shadow-lg hover:shadow-xl active:scale-98 whitespace-nowrap"
              >
                <Navigation className="w-4 h-4 fill-current" />
                Get Directions
              </a>

              {/* Secondary CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-98 whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-[#F5B942]" />
                WhatsApp Us
              </a>

              {/* Third CTA */}
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-transparent hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-98 whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#F5B942]" />
                Call Now
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 group">
              <img
                src={heroImage}
                alt="CoreTech storefront at 180 Balham High Road next to Costa Coffee"
                className="w-full h-80 sm:h-[420px] object-cover object-center transform transition-transform duration-700 group-hover:scale-102"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>

        {/* Section 3: Trust Indicators below the hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-[#F5B942] shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Fast Key Duplication</p>
              <p className="text-xs text-slate-400">Ready in 2–5 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
            <MapPin className="w-5 h-5 text-[#F5B942] shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Local Balham Service</p>
              <p className="text-xs text-slate-400">South London specialists</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-[#F5B942] shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Professional Service</p>
              <p className="text-xs text-slate-400">Tested calibrated machinery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-[#F5B942] shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Convenient Location</p>
              <p className="text-xs text-slate-400">Easy walk from Balham station</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
