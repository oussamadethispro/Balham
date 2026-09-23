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
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    <section id="services" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
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
            Workshop Key Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Key Cutting Services
          </h2>
          <p className="text-base text-slate-600">
            Precision key duplication cut on high-spec computer calibrated and bit-cutting machinery. Visit our Balham shop for immediate counter service.
          </p>
        </motion.div>

        {/* Services Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: (index % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col justify-between group hover:border-slate-400"
            >
              <div>
                {/* Header with icon & unboxed turnaround metadata */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#F5B942] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#F5B942]" />
                    <span>{service.turnaround}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-950 transition-colors">
                  {service.name}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {service.shortDescription}
                </p>

                {/* Features List */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 pt-3 mb-6 border-t border-slate-100">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-[#F5B942] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectService(service.name)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-slate-900 hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150 active:scale-98 shadow-sm group-hover:bg-[#111827]"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 text-[#F5B942]" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
