import React, { useState } from 'react';
import { ChevronDown, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings } from '../types.js';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Do I need to book an appointment before visiting the shop?',
    answer: 'No appointment is necessary. We operate a walk-in counter service 7 days a week on Balham High Road. Simply bring your key in and we cut duplicates while you wait.',
  },
  {
    question: 'How long does it take to cut duplicate keys?',
    answer: 'Most standard cylinder, Yale, and Euro cylinder house keys are cut in 2 to 3 minutes. Traditional mortice deadlocks or specialist safe keys take around 5 to 8 minutes.',
  },
  {
    question: 'What happens if my newly cut key does not turn in the lock?',
    answer: 'We offer the 100% Balham Fit & Function Guarantee. If any duplicate feels tight or does not turn smoothly, bring it back along with the original and we will recalibrate or recut it free of charge.',
  },
  {
    question: 'Can you cut a key from a snapped or bent original?',
    answer: 'In most cases, yes. As long as you bring both pieces of the broken key to the workshop, our technicians can measure the cuts and reconstruct the original bitting profile onto a fresh blank.',
  },
  {
    question: 'Do you offer bulk key duplication discounts for landlords or agencies?',
    answer: 'Yes. We regularly cut volume sets for local Balham letting agents, housing associations, and landlords. Contact us or bring your key batch in for trade pricing and itemised VAT receipts.',
  },
  {
    question: 'What payment methods do you accept at the counter?',
    answer: 'We accept all major debit and credit cards, Apple Pay, Google Pay, contactless payments, and cash.',
  },
];

interface FAQSectionProps {
  business: BusinessSettings;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ business }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I have a question about key cutting.'
  )}`;

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3 mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Frequently Asked Questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Cutting Questions & Answers
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about our walk-in duplication service, guarantees, and turnaround times in Balham.
          </p>
        </motion.div>

        {/* Accordion List with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="divide-y divide-slate-200 border-y border-slate-200"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left flex items-center justify-between gap-4 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-6 text-sm text-slate-600 leading-relaxed animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Still have questions banner with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900">Have a question about an unusual key?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Send a quick photo of your key or call our Balham workshop counter.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${business.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Call Us</span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F5B942] text-slate-950 text-xs font-bold hover:bg-[#e6ab33] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
