import React, { useState, useEffect } from 'react';
import { Send, Phone, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
    service: selectedServicePreset || 'House Keys',
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
          service: 'House Keys',
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
          addCustomerEnquiry({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service: formData.service,
            message: formData.message,
          });
        }
      } catch (fetchErr: any) {
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
        service: 'House Keys',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact details */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              CONTACT US
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Have a question or need a key cut? Contact us today – we're here to help!
            </p>

            <div className="space-y-4 pt-4">
              {/* Phone item */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a
                    href={`tel:${business.phone.replace(/\s+/g, '')}`}
                    className="text-sm font-bold text-slate-900 hover:text-[#c48e22] transition-colors block"
                  >
                    {business.phone}
                  </a>
                  <p className="text-[11px] text-slate-500">Call us during opening hours</p>
                </div>
              </div>

              {/* Email item */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <a
                    href={`mailto:${business.email}`}
                    className="text-sm font-bold text-slate-900 hover:text-[#c48e22] transition-colors block"
                  >
                    {business.email}
                  </a>
                  <p className="text-[11px] text-slate-500">We reply within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form matching reference layout */}
          <div className="lg:col-span-8 bg-white">
            {success ? (
              <div className="p-8 rounded-xl border border-slate-200 bg-emerald-50/50 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for contacting Balham Key Cutting. We will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:border-slate-800 focus:outline-none transition-colors text-slate-700"
                    >
                      <option value="House Keys">House Keys</option>
                      <option value="Car Keys">Car Keys</option>
                      <option value="Key Fobs">Key Fobs</option>
                      <option value="Safe Keys">Safe Keys</option>
                      <option value="Padlocks">Padlocks</option>
                      <option value="Mailbox Keys">Mailbox Keys</option>
                      <option value="Cabinet Keys">Cabinet Keys</option>
                      <option value="Other Key Cutting">Other / General Enquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your Message"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-slate-800 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#070b13] hover:bg-[#111827] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#F5B942]" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
