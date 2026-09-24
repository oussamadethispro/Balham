import React, { useState } from 'react';
import { ChevronDown, Phone, MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../types.js';

interface FAQItem {
  question: string;
  answer: string;
}

const faqsLeft: FAQItem[] = [
  {
    question: 'How much does key cutting cost?',
    answer: 'Standard cylinder and latch keys start from £5.50. Mortice deadlock keys start from £9.50. We provide competitive, transparent prices with bulk discounts for multiple copies.',
  },
  {
    question: 'How long does key cutting take?',
    answer: 'Most standard house and cylinder keys are cut in 2 to 3 minutes while you wait. Mortice, safe, and specialist keys typically take 5 to 8 minutes.',
  },
  {
    question: 'Do I need the original key?',
    answer: 'Yes, for the best and most accurate duplicate, an existing working key is required. If your key is slightly worn or snapped in two, we can usually still decode and copy it.',
  },
];

const faqsRight: FAQItem[] = [
  {
    question: 'Can you cut car keys and key fobs?',
    answer: 'Yes! We cut and duplicate electronic apartment RFID building fobs, as well as selected vehicle key blades and transponder duplicates. Contact us or bring your key in.',
  },
  {
    question: 'Do you cut high security keys?',
    answer: 'Yes, we carry a wide range of security blanks including dimple keys, restricted profile blanks, and security cylinder keys.',
  },
  {
    question: 'Are walk-ins welcome?',
    answer: 'Absolutely. No appointment is needed. Our workshop is open 6 days a week on Balham High Road for immediate counter service.',
  },
];

interface FAQSectionProps {
  business: BusinessSettings;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ business }) => {
  const [openLeft, setOpenLeft] = useState<number | null>(null);
  const [openRight, setOpenRight] = useState<number | null>(null);

  return (
    <section id="faq" className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
            KEY CUTTING QUESTIONS & ANSWERS
          </h2>
        </div>

        {/* 2-Column Accordion matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
          
          {/* Left Column */}
          <div className="space-y-3">
            {faqsLeft.map((faq, idx) => {
              const isOpen = openLeft === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenLeft(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-slate-700"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {faqsRight.map((faq, idx) => {
              const isOpen = openRight === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenRight(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-slate-700"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Help bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-medium">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Still have questions? We're happy to help!</span>
          </div>

          <a
            href={`tel:${business.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-bold transition-colors shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-slate-800" />
            <span>Call Us: {business.phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
