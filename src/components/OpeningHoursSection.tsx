import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { OpeningHoursData, OpeningHourDay } from '../types.js';
import { getShopStatus } from '../utils/openingHours.js';

interface OpeningHoursSectionProps {
  openingHoursData: OpeningHoursData;
}

export const OpeningHoursSection: React.FC<OpeningHoursSectionProps> = ({ openingHoursData }) => {
  const status = getShopStatus(openingHoursData.schedule);

  // Determine current day in UK
  const now = new Date();
  const ukDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday ...

  return (
    <section id="hours" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3 mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Balham High Road Workshop Hours
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Opening Hours
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Open 7 days a week for walk-in key cutting, duplication, and spare keys in Balham.
          </p>
        </motion.div>

        {/* Live Shop Status Card with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  status.isOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">{status.statusText}</span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  London Local Time · {status.nextEventText}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="divide-y divide-slate-100 pt-4">
            {openingHoursData.schedule.map((item: OpeningHourDay) => {
              const isToday = item.dayIndex === ukDayIndex;

              return (
                <div
                  key={item.day}
                  className={`py-3 px-3 rounded-lg flex items-center justify-between transition-colors ${
                    isToday ? 'bg-[#F5B942]/10 font-bold border-l-4 border-[#F5B942]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-900">{item.day}</span>
                    {isToday && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#111827] text-white px-2 py-0.5 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="text-sm tabular-nums">
                    {item.isClosed ? (
                      <span className="text-rose-600 font-semibold">Closed</span>
                    ) : (
                      <span className="text-slate-800">
                        {item.openTime} – {item.closeTime}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
