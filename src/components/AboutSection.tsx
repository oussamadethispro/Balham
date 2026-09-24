import React from 'react';
import { Check, Phone, Navigation, Star } from 'lucide-react';
import { BusinessSettings, GoogleReviewData } from '../types.js';

interface AboutAndReviewsProps {
  business: BusinessSettings;
  googleReviews: GoogleReviewData;
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutAndReviewsProps> = ({ business, googleReviews }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.businessName}, ${business.address}, ${business.area}, ${business.city} ${business.postcode}`
  )}`;

  const reviewsList = [
    {
      name: 'James P.',
      rating: 5,
      text: 'Excellent service! Key was cut in 2 minutes and works perfectly.',
      date: '2 days ago',
    },
    {
      name: 'Sarah T.',
      rating: 5,
      text: 'Very friendly staff and great prices. Highly recommend Balham Key Cutting.',
      date: '1 week ago',
    },
    {
      name: 'Michael R.',
      rating: 5,
      text: 'Lost my only key and they sorted me out quickly. Lifesavers!',
      date: '2 weeks ago',
    },
  ];

  const ratingVal = googleReviews?.rating ? googleReviews.rating.toFixed(1) : '5.0';
  const totalReviewsCount = googleReviews?.totalReviews || 11;

  return (
    <section id="about" className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Local Business Content */}
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              EXPERT KEY CUTTING IN BALHAM
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Accurate Key Cutting & Fob Duplication on Balham High Road
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At Balham Key Cutting, we provide fast, accurate and affordable key cutting services for homes, businesses and vehicles.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our experienced team uses the latest key cutting technology to ensure every key works perfectly. Walk in today – most keys ready in minutes!
            </p>

            {/* 4 Checkmarks in 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Over 10 Years in Balham</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>High Precision Equipment</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Hundreds of Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-[#F5B942] shrink-0" />
                <span>Local Balham Business</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#F5B942] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#e6ab33] transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Call Now: {business.phone}</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-300"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-700" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Right Column: Customer Reviews */}
          <div id="reviews" className="lg:col-span-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              WHAT OUR CUSTOMERS SAY
            </p>

            {/* Overall Rating Header */}
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{ratingVal}</span>
              <div className="flex text-[#F5B942]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Based on <strong>{totalReviewsCount} Google Reviews</strong>
              </span>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reviewsList.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{rev.name}</p>
                        <div className="flex text-[#F5B942]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      "{rev.text}"
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.businessName} ${business.address} ${business.postcode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-900 hover:text-[#c48e22] inline-flex items-center gap-1 transition-colors"
              >
                <span>View all reviews on Google</span>
                <span>→</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
