export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  area: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  websiteUrl: string;
  businessDescription: string;
  directionsHelp: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    googleBusiness?: string;
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  turnaround: string;
  active: boolean;
  sortOrder: number;
  features: string[];
}

export interface OpeningHourDay {
  day: string;
  dayIndex: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface OpeningHoursData {
  schedule: OpeningHourDay[];
  holidayNotice: string;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  reviewText: string;
  serviceUsed: string;
  date: string;
  active: boolean;
}

export interface GoogleReviewItem {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
}

export interface GoogleReviewData {
  isConnected: boolean;
  rating: number | null;
  totalReviews: number | null;
  reviews: GoogleReviewItem[];
  placeId: string;
}

export interface SeoSettings {
  homepageTitle: string;
  metaDescription: string;
  aboutTitle: string;
  servicesTitle: string;
  contactTitle: string;
  defaultOgImage: string;
  googleAnalyticsId: string;
  googleSearchConsoleCode: string;
  canonicalBase: string;
}

export interface PublicDataResponse {
  business: BusinessSettings;
  services: ServiceItem[];
  openingHours: OpeningHoursData;
  testimonials: TestimonialItem[];
  googleReviews: GoogleReviewData;
  seo: SeoSettings;
}

export interface EnquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  notes?: string;
}
