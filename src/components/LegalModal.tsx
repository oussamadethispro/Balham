import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'cookies' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-200">
              <Shield className="w-5 h-5 text-[#F5B942]" />
              <h3 className="text-xl font-bold">Privacy Policy</h3>
            </div>
            <p className="font-semibold text-slate-900">
              Last updated: March 2026 · Balham Key Cutting, Balham, London, UK
            </p>
            <p>
              Balham Key Cutting respects your privacy and is committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">1. Information We Collect</h4>
            <p>
              When you submit a query via our website contact form or message us via WhatsApp or telephone, we collect your name, contact telephone number, email address, and service enquiry notes.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">2. How We Use Your Data</h4>
            <p>
              Your details are used strictly to provide you with key cutting quotes, check key blank availability, answer questions, or arrange collection. We never sell, rent, or trade your personal data with third-party advertisers.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">3. Data Retention & Security</h4>
            <p>
              We retain enquiry submissions only for as long as necessary to complete your customer request. You can request deletion of your information at any time by contacting us.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-200">
              <Shield className="w-5 h-5 text-[#F5B942]" />
              <h3 className="text-xl font-bold">Terms & Conditions</h3>
            </div>
            <p className="font-semibold text-slate-900">
              Last updated: March 2026 · Balham Key Cutting
            </p>
            <h4 className="font-bold text-slate-900 pt-2">1. Key Cutting & Duplication Service</h4>
            <p>
              All key cutting is carried out using calibrated duplication machinery and quality alloy or brass key blanks. Customers are asked to provide an original, functional key where possible.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">2. Fit & Function Guarantee</h4>
            <p>
              In the rare event that a duplicate cut does not turn smoothly in your lock, please bring back the newly cut duplicate along with your original key. We will re-check tolerances and re-cut the key at no additional charge.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">3. Restricted & Registered Profiles</h4>
            <p>
              Certain high-security registered cylinders may require a security card or authorization letter from the registered property holder before a duplicate can be cut.
            </p>
          </div>
        )}

        {type === 'cookies' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-200">
              <Shield className="w-5 h-5 text-[#F5B942]" />
              <h3 className="text-xl font-bold">Cookie Policy</h3>
            </div>
            <p className="font-semibold text-slate-900">
              Last updated: March 2026
            </p>
            <p>
              Balham Key Cutting operates a privacy-first website. We do not use intrusive third-party tracking or advertising cookies.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">Strictly Essential Cookies</h4>
            <p>
              Our website uses strictly essential session tokens for authorized administrative dashboard logins. These ensure secure session handling and protected API interactions.
            </p>
            <p>
              Third-party services such as Google Maps and WhatsApp may set their own functional cookies when you interact with their embedded widgets or external links.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
