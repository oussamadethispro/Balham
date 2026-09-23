import React from 'react';
import { KeyRound, Cog, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings } from '../types.js';

interface HowItWorksProps {
  business: BusinessSettings;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ business }) => {
  const steps = [
    {
      step: 'Step 01',
      title: 'Bring Your Key',
      description: 'Visit our Balham High Road shop counter with your existing key, whether house, mortice, office, or padlock.',
      icon: <KeyRound className="w-6 h-6 text-[#F5B942]" />,
    },
    {
      step: 'Step 02',
      title: 'We Cut Your Key',
      description: 'We match the exact blank profile and cut your duplicate using computer-calibrated precision machinery while you wait.',
      icon: <Cog className="w-6 h-6 text-[#F5B942]" />,
    },
    {
      step: 'Step 03',
      title: 'Ready to Go',
      description: 'Your duplicate is deburred, checked for high tolerances, polished, and ready to use in your door immediately.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#F5B942]" />,
    },
  ];

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#F5B942]">
            Fast Walk-in Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-base text-slate-300">
            No booking required. Walk into our Balham shop counter and leave with duplicate keys in minutes.
          </p>
        </motion.div>

        {/* Steps Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group hover:border-slate-500 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5B942]">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center text-xs text-slate-400">
                <span>{idx === 0 ? 'No appointment needed' : idx === 1 ? 'Under 3 mins average' : '100% Fit Guarantee'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F5B942] text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-colors shadow-lg active:scale-98"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Visit Our Balham Counter Today</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
