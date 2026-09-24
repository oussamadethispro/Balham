import React from 'react';
import {
  KeyRound,
  Home,
  CopyCheck,
  Building2,
  Wrench,
  ShieldCheck,
  Lock,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { ServiceItem } from '../types.js';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceName: string) => void;
}

// Icon mapping helper
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Home':
      return <Home className="w-5 h-5" />;
    case 'CopyCheck':
      return <CopyCheck className="w-5 h-5" />;
    case 'Building2':
      return <Building2 className="w-5 h-5" />;
    case 'Wrench':
      return <Wrench className="w-5 h-5" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5" />;
    case 'Lock':
      return <Lock className="w-5 h-5" />;
    case 'KeyRound':
    default:
      return <KeyRound className="w-5 h-5" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  return (
    <section id="services" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Key Cutting Services
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Fast, accurate key duplication while you wait at our Balham High Road workshop.
          </p>
        </div>

        {/* Clean & Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service.name)}
              className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all duration-150 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-slate-900 text-slate-800 group-hover:text-[#F5B942] flex items-center justify-center transition-colors">
                    {getServiceIcon(service.icon)}
                  </div>
                  {service.turnaround && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Clock className="w-3 h-3 text-[#F5B942]" />
                      {service.turnaround}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-black">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-[#c48e22]">
                <span>Enquire about this key</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

