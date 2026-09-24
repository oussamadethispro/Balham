import React from 'react';
import { Navigation, Phone } from 'lucide-react';
import { BusinessSettings } from '../types.js';

interface FinalCTAProps {
  business: BusinessSettings;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ business }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  return (
    <section className="py-14 sm:py-16 bg-[#070b13] text-white relative overflow-hidden border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Need a Key Cut in Balham Today?
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
          Fast, reliable and professional key cutting services when you need them.
        </p>

        {/* 2 Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a
            href={`tel:${business.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#F5B942] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-all shadow-md active:scale-98"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call Now: {business.phone}</span>
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-transparent hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider transition-all active:scale-98"
          >
            <Navigation className="w-4 h-4 text-slate-300" />
            <span>Get Directions</span>
          </a>
        </div>

      </div>
    </section>
  );
};
