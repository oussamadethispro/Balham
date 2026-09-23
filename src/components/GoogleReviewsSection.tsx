import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleReviewData, TestimonialItem, BusinessSettings } from '../types.js';

interface GoogleReviewsSectionProps {
  googleReviews: GoogleReviewData;
  testimonials: TestimonialItem[];
  business: BusinessSettings;
  onOpenContact: () => void;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({
  googleReviews,
  testimonials,
  business,
}) => {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const googleMapsUrl = googleReviews.placeId
    ? `https://search.google.com/local/reviews?placeid=${googleReviews.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.businessName} ${business.area} London`)}`;

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
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
            Verified Customer Feedback
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-base text-slate-600">
            Real feedback from Balham residents, local homeowners, tenants, and South London businesses.
          </p>
        </motion.div>

        {/* GOOGLE REVIEWS SECTION */}
        {googleReviews.isConnected && googleReviews.reviews && googleReviews.reviews.length > 0 ? (
          /* Live Connected Google Reviews */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">
                      {googleReviews.rating?.toFixed(1) || '5.0'}
                    </span>
                    <div className="flex text-[#F5B942]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Based on {googleReviews.totalReviews} verified Google reviews
                  </p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Read all reviews on Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Google Reviews Grid with Stagger */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {googleReviews.reviews.slice(0, 6).map((rev, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {rev.profile_photo_url ? (
                          <img
                            src={rev.profile_photo_url}
                            alt={rev.author_name}
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold">
                            {rev.author_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {rev.author_name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {rev.relative_time_description}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-[#F5B942]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Google Verified Customer
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Professional Google Places API connection placeholder */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Google Business Profile Reviews
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl mt-1">
                    Live Google star ratings and customer reviews will stream here dynamically once the Google Places API key and Place ID are connected in the Admin Settings.
                  </p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
              >
                <span>Find Us on Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F5B942]" />
              </a>
            </div>
          </motion.div>
        )}

        {/* VERIFIED LOCAL CUSTOMER TESTIMONIALS */}
        {testimonials && testimonials.length > 0 && (
          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Local Customer Testimonials
                </h3>
                <p className="text-xs text-slate-500">
                  Direct feedback from visits to our Balham shop counter
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  aria-label="Previous review"
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  aria-label="Next review"
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </motion.div>

            {/* Testimonials Carousel / Grid with Stagger */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-400 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-[#F5B942]">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {test.date}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed italic mb-4">
                      "{test.reviewText}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{test.authorName}</p>
                      <p className="text-[11px] text-slate-500">{test.location}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {test.serviceUsed}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
