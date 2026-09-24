import React from 'react';
import { ShieldCheck, Zap, Settings, ThumbsUp, Clock } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: 'Local & Trusted',
      description: 'Proudly serving Balham for years with 100+ 5-star reviews.',
      icon: <ShieldCheck className="w-5 h-5 text-slate-800" />,
    },
    {
      title: 'Fast & Convenient',
      description: 'Most keys cut in minutes while you wait.',
      icon: <Zap className="w-5 h-5 text-slate-800" />,
    },
    {
      title: 'Professional Quality',
      description: 'Precision key cutting using the latest equipment.',
      icon: <Settings className="w-5 h-5 text-slate-800" />,
    },
    {
      title: 'Great Prices',
      description: 'Competitive pricing with no hidden charges.',
      icon: <span className="font-bold text-base text-slate-800 leading-none">£</span>,
    },
    {
      title: 'Friendly Service',
      description: 'Expert advice and friendly service every time.',
      icon: <ThumbsUp className="w-5 h-5 text-slate-800" />,
    },
    {
      title: 'No Appointment',
      description: 'Walk-ins welcome. Open 6 days a week.',
      icon: <Clock className="w-5 h-5 text-slate-800" />,
    },
  ];

  return (
    <section id="why-us" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
            WHY CHOOSE US
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Balham Key Cutting?
          </h2>
        </div>

        {/* 6 Benefits in balanced grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-5 text-center">
          {benefits.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[170px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
