import React from 'react';
import { BusinessSettings } from '../types.js';

interface HowItWorksProps {
  business: BusinessSettings;
}

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps = [
    {
      num: '1',
      title: 'Bring Your Key',
      description: 'Visit our shop on Balham High Road with the key you need copied.',
    },
    {
      num: '2',
      title: 'We Cut Your Key',
      description: 'Our expert team will cut your key using precision machinery.',
    },
    {
      num: '3',
      title: 'Test & Check',
      description: 'We test the key to ensure it works perfectly.',
    },
    {
      num: '4',
      title: "You're All Set!",
      description: "Take your new key and you're good to go.",
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-16 bg-[#070b13] text-white border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F5B942] mb-1.5">
            SIMPLE PROCESS
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
        </div>

        {/* 4 Steps in a single horizontal flow with connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 relative">
          {steps.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative group">
              {/* Connector line between steps on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-[62%] right-[-38%] h-[2px] border-t-2 border-dotted border-slate-700 pointer-events-none z-0" />
              )}

              {/* Number Circle: White circle with black bold number */}
              <div className="w-10 h-10 rounded-full bg-white text-slate-950 font-extrabold text-sm flex items-center justify-center mb-4 shadow-md relative z-10">
                {item.num}
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[210px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
