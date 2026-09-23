import React from 'react';
import { Navigation, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings } from '../types.js';

interface FinalCTAProps {
  business: BusinessSettings;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ business }) => {
  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I need a key duplicated.'
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  return (
    <section className="py-16 sm:py-20 bg-[#0d1117] text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F5B942]/10 blur-3xl pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6"
      >
        {/* Anti-slop: Unboxed text kicker */}
        <p className="text-xs font-bold uppercase tracking-widest text-[#F5B942]">
          Independent Balham High Road Workshop
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Need a Key Cut in Balham Today?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
          No waiting around or appointments. Walk into our shop counter on Balham High Road and have your duplicate keys cut accurately in under 3 minutes.
        </p>

        {/* 3 CTAs in prioritized sequence */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F5B942] text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-all shadow-lg active:scale-98"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Get Directions to Shop</span>
          </a>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-[#F5B942]" />
            <span>WhatsApp Enquiry</span>
          </a>

          <a
            href={`tel:${business.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all active:scale-98"
          >
            <Phone className="w-4 h-4 text-[#F5B942]" />
            <span>Call {business.phone}</span>
          </a>
        </div>

        {/* Guarantee footnote */}
        <div className="pt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#F5B942]" />
          <span>Backed by the Balham 100% Fit & Function Guarantee</span>
        </div>

      </motion.div>
    </section>
  );
};
