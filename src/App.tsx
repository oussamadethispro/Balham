import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { ServicesSection } from './components/ServicesSection.js';
import { WhyChooseUs } from './components/WhyChooseUs.js';
import { HowItWorks } from './components/HowItWorks.js';
import { AboutSection } from './components/AboutSection.js';
import { GoogleMapSection } from './components/GoogleMapSection.js';
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
    setData(getStoredSiteData());

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

    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setShowAdmin(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenContact = (serviceName?: string) => {
    setSelectedService(serviceName);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setQuickEnquiryOpen(true);
    }
  };

  const { business, services, openingHours, testimonials, googleReviews } = data;

  if (showAdmin) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
          Loading Admin Control Center...
        </div>
      }>
        <AdminDashboard
          onClose={() => {
            setShowAdmin(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
            fetchPublicData();
          }}
          onDataRefresh={() => fetchPublicData()}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#F5B942]/30 selection:text-slate-900">
      
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
        openingHours={openingHours.schedule}
        onOpenContact={() => handleOpenContact()}
      />

      {/* 3. KEY CUTTING SERVICES SECTION */}
      <ServicesSection
        services={services.filter((s) => s.active)}
        onSelectService={(svcName) => {
          setSelectedService(svcName);
          handleOpenContact(svcName);
        }}
      />

      {/* 4. WHY CHOOSE BALHAM KEY CUTTING */}
      <WhyChooseUs />

      {/* 5. HOW IT WORKS (4-STEP PROCESS) */}
      <HowItWorks business={business} />

      {/* 6. ABOUT BALHAM KEY CUTTING & CUSTOMER REVIEWS */}
      <AboutSection
        business={business}
        googleReviews={googleReviews}
        onOpenContact={() => handleOpenContact()}
      />

      {/* 7. FIND BALHAM KEY CUTTING (GOOGLE MAP & OPENING HOURS) */}
      <GoogleMapSection
        business={business}
        openingHours={openingHours.schedule}
      />

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <FAQSection
        business={business}
      />

      {/* 9. CONTACT / ENQUIRY SECTION */}
      <ContactSection
        business={business}
        services={services.filter((s) => s.active)}
        selectedServicePreset={selectedService}
      />

      {/* 10. FINAL HIGH CONVERTING CTA */}
      <FinalCTA business={business} />

      {/* 11. FOOTER */}
      <Footer
        business={business}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp business={business} />

      {/* MOBILE STICKY ACTION BAR */}
      <MobileStickyBar business={business} />

      {/* MODALS */}
      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
        services={services.filter((s) => s.active)}
        presetService={selectedService}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
