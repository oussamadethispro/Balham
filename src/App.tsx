import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { ServicesSection } from './components/ServicesSection.js';
import { WhyChooseUs } from './components/WhyChooseUs.js';
import { HowItWorks } from './components/HowItWorks.js';
import { AboutSection } from './components/AboutSection.js';
import { GoogleReviewsSection } from './components/GoogleReviewsSection.js';
import { GoogleMapSection } from './components/GoogleMapSection.js';
import { OpeningHoursSection } from './components/OpeningHoursSection.js';
import { FAQSection } from './components/FAQSection.js';
import { ContactSection } from './components/ContactSection.js';
import { FinalCTA } from './components/FinalCTA.js';
import { Footer } from './components/Footer.js';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.js';
import { MobileStickyBar } from './components/MobileStickyBar.js';
import { QuickEnquiryModal } from './components/QuickEnquiryModal.js';
import { LegalModal } from './components/LegalModal.js';
import { PublicDataResponse } from './types.js';
import { fallbackData } from './defaultData.js';
import { getStoredSiteData } from './admin/adminStorage.js';

// Code splitting: Lazy load the heavy admin dashboard (~100KB) only when requested
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.js'));

export default function App() {
  const [data, setData] = useState<PublicDataResponse>(() => getStoredSiteData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals & Admin
  const [showAdmin, setShowAdmin] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const fetchPublicData = async () => {
    // Always refresh from stored site data first
    setData(getStoredSiteData());

    // Skip backend API call if hosted on static platforms like GitHub Pages
    if (typeof window !== 'undefined' && (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:')) {
      return;
    }
    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await res.json();
          setData(json);
        }
      }
    } catch (err: any) {
      console.warn('Could not refresh public data in background, using loaded state:', err);
    }
  };

  useEffect(() => {
    fetchPublicData();

    // Listen for hash change for #admin shortcut
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setShowAdmin(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenContact = (service?: string) => {
    if (service) {
      setSelectedService(service);
      setQuickEnquiryOpen(true);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const { business, services, openingHours, testimonials, googleReviews } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col selection:bg-[#F5B942] selection:text-[#111827] pb-16 md:pb-0">
      
      {/* 1. STICKY HEADER */}
      <Header
        business={business}
        openingHours={openingHours.schedule}
        onOpenContact={handleOpenContact}
      />

      {/* 2. HERO SECTION */}
      <Hero
        business={business}
        googleReviews={googleReviews}
        onOpenContact={() => handleOpenContact()}
      />

      {/* 3. KEY CUTTING SERVICES SECTION */}
      <ServicesSection
        services={services.filter((s) => s.active)}
        onSelectService={(svcName) => {
          setSelectedService(svcName);
          setQuickEnquiryOpen(true);
        }}
      />

      {/* 4. WHY CHOOSE BALHAM KEY CUTTING */}
      <WhyChooseUs />

      {/* 6. HOW IT WORKS (3-STEP PROCESS) */}
      <HowItWorks business={business} />

      {/* 7. ABOUT BALHAM KEY CUTTING */}
      <AboutSection
        business={business}
        onOpenContact={() => handleOpenContact()}
      />

      {/* 8. GOOGLE REVIEWS & LOCAL TESTIMONIALS */}
      <GoogleReviewsSection
        googleReviews={googleReviews}
        testimonials={testimonials.filter((t) => t.active)}
        business={business}
        onOpenContact={() => handleOpenContact()}
      />

      {/* 9. FIND BALHAM KEY CUTTING (GOOGLE MAP & SHOP DETAILS) */}
      <GoogleMapSection
        business={business}
        openingHours={openingHours.schedule}
      />

      {/* 10. OPENING HOURS (WITH UK TIMEZONE LIVE OPEN/CLOSED BADGE) */}
      <OpeningHoursSection
        openingHoursData={openingHours}
      />

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <FAQSection
        business={business}
      />

      {/* 12. CONTACT / ENQUIRY SECTION */}
      <ContactSection
        business={business}
        services={services.filter((s) => s.active)}
        selectedServicePreset={selectedService}
      />

      {/* 13. FINAL HIGH CONVERTING CTA */}
      <FinalCTA business={business} />

      {/* 14. FOOTER */}
      <Footer
        business={business}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp business={business} />

      {/* MOBILE STICKY ACTION BAR */}
      <MobileStickyBar business={business} />

      {/* QUICK ENQUIRY MODAL */}
      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
        presetService={selectedService}
        services={services.filter((s) => s.active)}
      />

      {/* LEGAL POLICIES MODAL */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* SECURE ADMIN DASHBOARD OVERLAY */}
      {showAdmin && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 border-3 border-[#F5B942] border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <h3 className="text-white font-bold text-base">Loading Admin Portal</h3>
                  <p className="text-slate-400 text-xs mt-1">Initializing secure workshop management...</p>
                </div>
              </div>
            </div>
          }
        >
          <AdminDashboard
            onClose={() => {
              setShowAdmin(false);
              if (window.location.hash === '#admin') {
                history.pushState(null, '', window.location.pathname);
              }
            }}
            onDataRefresh={fetchPublicData}
          />
        </Suspense>
      )}

    </div>
  );
}
