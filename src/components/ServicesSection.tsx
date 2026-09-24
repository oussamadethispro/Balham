import React from 'react';
import {
  KeyRound,
  Home,
  ShieldCheck,
  Lock,
  ArrowRight,
  Car,
  Radio,
  Vault,
  Mail,
  FolderLock,
  PlusCircle,
} from 'lucide-react';
import { ServiceItem } from '../types.js';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceName: string) => void;
}

interface ServiceCardData {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const cards: ServiceCardData[] = [
    {
      id: 'house-keys',
      name: 'House Keys',
      desc: 'Standard, high security & mortice keys cut while you wait.',
      icon: <Home className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'car-keys',
      name: 'Car Keys',
      desc: 'Car key cutting & transponder key programming available.',
      icon: <Car className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'key-fobs',
      name: 'Key Fobs',
      desc: 'Duplicate & replacement key fobs for most makes & models.',
      icon: <Radio className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'safe-keys',
      name: 'Safe Keys',
      desc: 'We cut keys for most domestic & commercial safes.',
      icon: <Vault className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'padlocks',
      name: 'Padlocks',
      desc: 'Keys for padlocks, sheds, gates & security locks.',
      icon: <Lock className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'mailbox-keys',
      name: 'Mailbox Keys',
      desc: 'Replacement keys for most mailbox locks.',
      icon: <Mail className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'cabinet-keys',
      name: 'Cabinet Keys',
      desc: 'Keys for office furniture, lockers & cabinets.',
      icon: <FolderLock className="w-5 h-5 text-slate-800" />,
    },
    {
      id: 'and-more',
      name: 'And More',
      desc: 'If it has a key, we can probably cut it!',
      icon: <PlusCircle className="w-5 h-5 text-slate-800" />,
    },
  ];

  return (
    <section id="services" className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
            WHAT WE DO
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Key Cutting Services
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Professional key cutting for all your needs
          </p>
        </div>

        {/* 8-Card Grid matching reference design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectService(card.name)}
              className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-800">
                  {card.icon}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {card.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-[#c48e22] transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
