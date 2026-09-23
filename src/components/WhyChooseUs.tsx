import React from 'react';
import { MapPin, Zap, Award, CheckCircle2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: 'Local Balham Service',
      description: 'Conveniently located on Balham High Road within easy reach of Balham tube & train station. We know the local lock and key profiles inside out.',
      icon: <MapPin className="w-5 h-5 text-[#F5B942]" />,
    },
    {
      title: 'Fast & Convenient',
      description: 'Most domestic cylinder keys duplicated in under 3 minutes while you wait. Pop in on your commute or during your high street errands.',
      icon: <Zap className="w-5 h-5 text-[#F5B942]" />,
    },
    {
      title: 'Professional Key Cutting',
      description: 'Using commercial-grade computer-calibrated rotary key cutters and traditional bit machines for precise, clean tolerances.',
      icon: <Award className="w-5 h-5 text-[#F5B942]" />,
    },
    {
      title: 'Reliable Results',
      description: 'Every key is thoroughly deburred, polished, and checked before leaving our counter so it glides smoothly into your lock barrel.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#F5B942]" />,
    },
    {
      title: 'Friendly Customer Service',
      description: 'Clear, straightforward advice from knowledgeable staff who take pride in providing dependable service to South London neighbours.',
      icon: <HeartHandshake className="w-5 h-5 text-[#F5B942]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
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
            Balham Service Standards
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Balham Key Cutting
          </h2>
          <p className="text-base text-slate-600">
            South London residents trust our workshop for accuracy, speed, and dependable local service.
          </p>
        </motion.div>

        {/* Benefits Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: (idx % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}

          {/* Guarantee Card with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-7 rounded-2xl bg-[#111827] text-white flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#F5B942]/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F5B942] text-slate-950 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                The Balham 100% Fit Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If a key cut at our counter does not turn smoothly in your lock, bring it back and we will immediately recut or recalibrate it free of charge. No quibbles.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-[#F5B942]">Peace of Mind</span>
              <span>100% Guaranteed</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
