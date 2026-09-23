import React from 'react';
import { MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../types.js';

interface FloatingWhatsAppProps {
  business: BusinessSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ business }) => {
  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I would like to enquire about key cutting.'
  )}`;

  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-20 md:bottom-6 right-6 z-30 group">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3 md:px-4 md:py-3 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden md:inline font-bold text-xs tracking-tight">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
};
