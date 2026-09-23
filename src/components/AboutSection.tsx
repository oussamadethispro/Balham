import React from 'react';
import { MapPin, Check, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings } from '../types.js';
import craftImage from '../assets/images/balham_key_cutting_craft_1790184239513.jpg';

interface AboutSectionProps {
  business: BusinessSettings;
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ business }) => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual workshop image with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
              <img
                src={craftImage}
                alt="Balham Key Cutting craftsman workbench and key profiles"
                className="w-full h-80 sm:h-[400px] object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column: Narrative & Values with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                About Our Workshop
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Accurate, Friendly Key Cutting on Balham High Road
              </h2>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">
              At <strong>Balham Key Cutting</strong>, we believe cutting a spare key should be quick, accurate, and completely hassle-free. Too many automatic machines in supermarkets produce keys with rough burrs that stick or refuse to turn in British rim latches and mortice locks.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our high street workshop combines computer-calibrated precision duplicating machinery with experienced hand finishing. Whether you have just moved into a new flat on Bedford Hill, need spare sets for your tenants, or need commercial keys for your shop, we deliver duplicate keys that work on the very first turn.
            </p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Standard & High-Security Blanks</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Hand-Deburred & Polished</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Open 7 Days a Week</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>100% Fit & Function Guarantee</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Call Our Workshop</span>
              </a>

              <a
                href="#location"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-300"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-700" />
                <span>Shop Location & Hours</span>
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
