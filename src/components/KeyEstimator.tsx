import React from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeyTypeOption {
  id: string;
  name: string;
  subtitle: string;
  estTime: string;
  priceGuide: string;
}

const keyTypes: KeyTypeOption[] = [
  {
    id: 'cylinder',
    name: 'Standard Cylinder Key',
    subtitle: 'Front door rim latches & Yale locks',
    estTime: '2 – 3 mins',
    priceGuide: 'From £5.50',
  },
  {
    id: 'euro-cylinder',
    name: 'Euro Profile Cylinder',
    subtitle: 'UPVC doors, patio doors & composite doors',
    estTime: '3 – 4 mins',
    priceGuide: 'From £7.00',
  },
  {
    id: 'mortice',
    name: 'Mortice & Chubb Lever Key',
    subtitle: 'Heavy-duty 3-lever & 5-lever deadlocks',
    estTime: '5 – 8 mins',
    priceGuide: 'From £9.50',
  },
  {
    id: 'commercial',
    name: 'Cabinet, Desk & Locker Key',
    subtitle: 'Office filing cabinets, postboxes & lockers',
    estTime: '2 – 3 mins',
    priceGuide: 'From £6.00',
  },
  {
    id: 'padlock',
    name: 'Padlock & Security Chain Key',
    subtitle: 'Bicycle locks, shed latches & gates',
    estTime: '2 – 4 mins',
    priceGuide: 'From £6.00',
  },
  {
    id: 'window',
    name: 'Window Lock Key',
    subtitle: 'UPVC and timber window handles',
    estTime: '2 – 3 mins',
    priceGuide: 'From £5.00',
  },
];

interface KeyEstimatorProps {
  onSelectServiceForEnquiry: (serviceName: string) => void;
}

export const KeyEstimator: React.FC<KeyEstimatorProps> = ({ onSelectServiceForEnquiry }) => {
  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#F5B942]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#F5B942]">
            Turnaround & Price Guide
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Key Cutting Turnaround Times
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Immediate shop turnaround times and price guidelines for all standard key types.
          </p>
        </motion.div>

        {/* Clean Responsive Grid of Key Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {keyTypes.map((key, idx) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F5B942]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F5B942]">
                    {key.estTime}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">{key.name}</h4>
                <p className="text-xs text-slate-400 mb-4">{key.subtitle}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/70 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{key.priceGuide}</span>
                <button
                  type="button"
                  onClick={() => onSelectServiceForEnquiry(key.name)}
                  className="text-xs font-bold text-[#F5B942] hover:text-[#e6ab33] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
