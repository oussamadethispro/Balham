import React from 'react';
import { Phone, MessageSquare, Navigation } from 'lucide-react';
import { BusinessSettings } from '../types.js';

interface MobileStickyBarProps {
  business: BusinessSettings;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ business }) => {
  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I would like to enquire about key cutting.'
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111827] border-t border-slate-800 shadow-2xl px-2 py-2">
      <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
        <a
          href={`tel:${business.phone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-700 transition-colors text-center active:scale-95"
        >
          <Phone className="w-4 h-4 text-[#F5B942] mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight">Call</span>
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#F5B942] text-[#111827] hover:bg-[#e6ab33] transition-colors text-center active:scale-95 shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-[#111827] mb-0.5 fill-current" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-700 transition-colors text-center active:scale-95"
        >
          <Navigation className="w-4 h-4 text-[#F5B942] mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight">Directions</span>
        </a>
      </div>
    </div>
  );
};
