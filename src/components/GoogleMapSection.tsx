import React from 'react';
import { MapPin, Navigation, Bus, Car } from 'lucide-react';
import { BusinessSettings, OpeningHourDay } from '../types.js';

interface FindUsAndHoursProps {
  business: BusinessSettings;
  openingHours: OpeningHourDay[];
}

export const GoogleMapSection: React.FC<FindUsAndHoursProps> = ({ business, openingHours }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${business.latitude},${business.longitude}&hl=en&z=15&output=embed`;

  // Standard hours format matching reference design
  const hoursList = [
    { day: 'Monday', time: '9:00 AM – 6:00 PM', closed: false },
    { day: 'Tuesday', time: '9:00 AM – 6:00 PM', closed: false },
    { day: 'Wednesday', time: '9:00 AM – 6:00 PM', closed: false },
    { day: 'Thursday', time: '9:00 AM – 6:00 PM', closed: false },
    { day: 'Friday', time: '9:00 AM – 6:00 PM', closed: false },
    { day: 'Saturday', time: '9:00 AM – 5:00 PM', closed: false },
    { day: 'Sunday', time: 'Closed', closed: true },
  ];

  return (
    <section id="location" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Column Layout: Details | Map | Opening Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Column 1: Find Us Details */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                FIND US
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {business.businessName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {business.address}<br />
                {business.city} {business.postcode}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>2 min walk from Balham Station</span>
              </div>
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Bus routes: 77, 219, 315, 333</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Easy parking nearby</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F5B942] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Column 2: Map Preview */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs h-64 md:h-72 bg-slate-100 relative">
            <iframe
              title="Balham Key Cutting Map Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[0.2]"
            />
            {/* Map badge overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-900 shadow-xs border border-slate-200 flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Balham Key Cutting</span>
            </div>
          </div>

          {/* Column 3: Opening Hours Table */}
          <div id="hours" className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              OPENING HOURS
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
              {hoursList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50/80 transition-colors">
                  <span className="text-slate-700 font-medium">{item.day}</span>
                  <span className={`tabular-nums font-semibold ${item.closed ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
