import React from 'react';
import { MapPin, Check, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings } from '../types.js';

interface AboutSectionProps {
  business: BusinessSettings;
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ business }) => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          {/* Narrative & Values with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                About Our Workshop
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Accurate Key Cutting & Fob Duplication on Balham High Road
              </h2>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">
              At <strong>Balham Key Cutting (CoreTech)</strong>, we believe duplicating a key or building fob should be quick, accurate, and completely hassle-free. Too many automatic machines produce keys with rough burrs that stick or refuse to turn in British rim latches and mortice locks.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our high street workshop combines computer-calibrated precision duplicating machinery, RFID fob duplication programmers, and experienced hand finishing. Whether you need spare door keys, high-security cylinder keys, or access fobs for modern London apartment buildings, we deliver duplicates that work on the very first try.
            </p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Standard & High-Security Keys</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>RFID & Electronic Key Fobs</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Open 7 Days a Week at 180 Balham High Rd</span>
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
