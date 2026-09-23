import React, { useState, useEffect } from 'react';
import { Send, Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessSettings, ServiceItem } from '../types.js';
import { isStaticHost, addCustomerEnquiry } from '../admin/adminStorage.js';

interface ContactSectionProps {
  business: BusinessSettings;
  services: ServiceItem[];
  selectedServicePreset?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  business,
  services,
  selectedServicePreset,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: selectedServicePreset || 'Key Duplication',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedServicePreset) {
      setFormData((prev) => ({ ...prev, service: selectedServicePreset }));
    }
  }, [selectedServicePreset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Please fill in your name and message.');
      return;
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setError('Please provide at least a phone number or email address.');
      return;
    }

    setLoading(true);
    try {
      if (isStaticHost()) {
        addCustomerEnquiry({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          message: formData.message,
        });
        await new Promise((r) => setTimeout(r, 400));
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'Key Duplication',
          message: '',
        });
        return;
      }

      try {
        const res = await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');
        } else {
          // Static host returned HTML
          addCustomerEnquiry({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service: formData.service,
            message: formData.message,
          });
        }
      } catch (fetchErr: any) {
        // Fallback for offline / static hosting
        addCustomerEnquiry({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          message: formData.message,
        });
      }

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Key Duplication',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error sending enquiry');
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    'Hello Balham Key Cutting, I would like to enquire about key cutting.'
  )}`;

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
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
            Send an Enquiry
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Balham Key Cutting
          </h2>
          <p className="text-base text-slate-600">
            Have a question about a rare key, bulk duplicating, or specialist locks? Send a message or visit our shop.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Fast Channels with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Phone Card */}
            <a
              href={`tel:${business.phone.replace(/\s+/g, '')}`}
              className="block p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#F5B942] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Call Workshop Directly</h3>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">{business.phone}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Counter advice · Immediate answer</p>
                </div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">WhatsApp Messaging</h3>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">Send Key Photo</p>
                  <p className="text-xs text-slate-500 mt-0.5">Send a photo of your key for instant verification</p>
                </div>
              </div>
            </a>

          </motion.div>

          {/* Right Column: Interactive Form with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
          >
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Enquiry Received!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Balham Key Cutting. A member of our workshop team will review your enquiry and respond promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Enquiry Form</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We respond to online enquiries throughout the day.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Davies"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#F5B942] focus:outline-none transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="07700 900000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#F5B942] focus:outline-none transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.co.uk"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#F5B942] focus:outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service of Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-[#F5B942] focus:outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Bulk Duplication (Landlord / Estate Agent)">
                      Bulk Duplication (Landlord / Estate Agent)
                    </option>
                    <option value="Specialist / Safe / High Security">
                      Specialist / Safe / High Security Key
                    </option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Key Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what key you need duplicated, quantity, or if you have any questions..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#F5B942] focus:outline-none transition-shadow"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-lg bg-slate-900 hover:bg-[#111827] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F5B942]" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#F5B942]" />
                      <span>Submit Key Cutting Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </motion.div>

        </div>

      </div>
    </section>
  );
};
