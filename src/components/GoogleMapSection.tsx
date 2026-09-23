import React from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Train, Bus } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings, OpeningHourDay } from '../types.js';
import { getShopStatus } from '../utils/openingHours.js';

interface GoogleMapSectionProps {
  business: BusinessSettings;
  openingHours: OpeningHourDay[];
}

export const GoogleMapSection: React.FC<GoogleMapSectionProps> = ({ business, openingHours }) => {
  const status = getShopStatus(openingHours);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.businessName} ${business.address} ${business.postcode}`
  )}`;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${business.latitude},${business.longitude}&hl=en&z=16&output=embed`;

  return (
    <section id="location" className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Visit Our South London Shop
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Balham Key Cutting
          </h2>
          <p className="text-base text-slate-600">
            Conveniently situated on Balham High Road in the heart of South West London (SW12).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Business Details & Transport with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Address Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#F5B942] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Shop Address</h3>
                  <p className="text-sm text-slate-700 font-medium mt-1">
                    {business.businessName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {business.address}, {business.area}
                  </p>
                  <p className="text-sm text-slate-600">
                    {business.city}, <strong>{business.postcode}</strong>
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{status.statusText}</span>
                </div>
                <span className="text-slate-500">{status.nextEventText}</span>
              </div>

              {/* Direction CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#F5B942] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Get Directions</span>
                </a>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Interactive Map with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[420px] sm:h-[480px] relative">
              <iframe
                title="Balham Key Cutting Google Map Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Map Pin Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-md flex items-center gap-3 text-xs">
                <div className="w-3 h-3 rounded-full bg-[#F5B942] animate-ping shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">Balham Key Cutting</span>
                  <span className="text-slate-500 text-[11px]">Balham High Road · Walk-in service</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
