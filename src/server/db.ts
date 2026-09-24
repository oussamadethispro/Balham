import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  dayIndex: number; // 0=Sunday, 1=Monday...
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface OpeningHoursData {
  schedule: OpeningHourDay[];
  holidayNotice: string;
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

export interface GoogleSettings {
  apiKey: string;
  placeId: string;
  syncEnabled: boolean;
  minRating: number;
  lastSyncedAt?: string;
  cachedRating?: number;
  cachedTotalReviews?: number;
  cachedReviews?: Array<{
    author_name: string;
    profile_photo_url?: string;
    rating: number;
    text: string;
    relative_time_description: string;
    time: number;
  }>;
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

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'admin';
  createdAt: string;
}

export interface DatabaseSchema {
  business: BusinessSettings;
  services: ServiceItem[];
  openingHours: OpeningHoursData;
  enquiries: EnquiryItem[];
  testimonials: TestimonialItem[];
  googleSettings: GoogleSettings;
  seoSettings: SeoSettings;
  adminUsers: AdminUser[];
  sessions: Record<string, { userId: string; expiresAt: number }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Password hashing utility using native Node crypto scrypt
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
}

const defaultAdminPassword = hashPassword('AdminPassword2026!');

const initialData: DatabaseSchema = {
  business: {
    businessName: 'Balham Key Cutting',
    tagline: 'Fast, Reliable Key Duplication & Spare Keys in Balham',
    phone: '+44 7491 275560',
    whatsapp: '447491275560',
    email: 'info@balhamkeycutting.co.uk',
    address: '180 Balham High Road',
    area: 'Balham',
    city: 'London',
    postcode: 'SW12 9BW',
    latitude: 51.4442,
    longitude: -0.1528,
    googlePlaceId: '',
    websiteUrl: 'https://balhamkeycutting.co.uk',
    businessDescription: 'Balham Key Cutting (CoreTech) provides fast, professional, and reliable key duplication in Balham, South London. From cylinder front door keys to mortice locks, commercial blanks, and electronic RFID access fobs, our dedicated workshop guarantees accurate, smooth-fitting duplicates while you wait.',
    directionsHelp: 'Located at 180 Balham High Road (CoreTech, right next to Costa Coffee), just a 2-minute walk from Balham Tube & National Rail Station.',
    socialLinks: {
      facebook: '',
      instagram: '',
      googleBusiness: '',
    },
  },
  services: [
    {
      id: 'key-duplication',
      name: 'Key Duplication',
      shortDescription: 'Fast and accurate duplicate keys for everyday residential and commercial use.',
      fullDescription: 'Our calibrated cutting machinery duplicates standard cylinder and edge-cut keys in minutes. Perfect for having a working twin of your primary keys cut with tight tolerances for smooth turning in the lock.',
      icon: 'KeyRound',
      turnaround: '2 - 3 minutes',
      active: true,
      sortOrder: 1,
      features: ['Precision laser calibrated cuts', 'Deburred and polished edges', 'Smooth cylinder engagement', 'Cut while you wait in-store'],
    },
    {
      id: 'house-keys',
      name: 'House Keys',
      shortDescription: 'Duplicate standard residential keys quickly and accurately for front and back doors.',
      fullDescription: 'Comprehensive range of residential door blanks including Yale, ERA, Union, and universal cylinder keys. Ideal for family members, cleaners, and regular household access.',
      icon: 'Home',
      turnaround: '2 - 4 minutes',
      active: true,
      sortOrder: 2,
      features: ['Yale, ERA & Union blanks', 'Euro profile & rim cylinder', 'Tested against manufacturer spec', 'Bulk discounts for multiple sets'],
    },
    {
      id: 'spare-keys',
      name: 'Spare Keys',
      shortDescription: 'Create reliable spare keys for your home, family, trusted neighbours or tenants.',
      fullDescription: 'Never get locked out in Balham again. Duplicate a trusted spare set for trusted neighbors, emergency key safes, Airbnb hosts, or estate agent handovers.',
      icon: 'CopyCheck',
      turnaround: '3 - 5 minutes',
      active: true,
      sortOrder: 3,
      features: ['Landlord & tenant multi-sets', 'Emergency backup sets', 'Key rings and color tags available', 'Fast counter service'],
    },
    {
      id: 'office-business-keys',
      name: 'Office & Business Keys',
      shortDescription: 'Key duplication for local shops, offices, commercial properties, and desk units.',
      fullDescription: 'Reliable duplication for office doors, shutter padlocks, internal security grilles, desk pedestals, filing cabinets, and staff access keys.',
      icon: 'Building2',
      turnaround: 'Same day / immediate',
      active: true,
      sortOrder: 4,
      features: ['Filing cabinet & locker keys', 'Commercial roller shutter keys', 'Multi-set business orders', 'VAT receipt provided'],
    },
    {
      id: 'replacement-keys',
      name: 'Replacement Keys',
      shortDescription: 'Professional replacement key cutting for suitable key types and worn originals.',
      fullDescription: 'If your existing key is slightly worn or difficult to turn in the barrel, our skilled cutters can decode and cut a fresh, clean duplicate with corrected pin depths.',
      icon: 'Wrench',
      turnaround: '3 - 5 minutes',
      active: true,
      sortOrder: 5,
      features: ['Worn blade profile restoration', 'Careful manual gauge check', 'Brass and steel alloy blanks', 'Expert advice on sticky locks'],
    },
    {
      id: 'mortice-chubb-keys',
      name: 'Mortice & Chubb Keys',
      shortDescription: 'Traditional 5-lever deadlock and mortice keys cut with exacting precision.',
      fullDescription: 'High-security British Standard mortice deadlock keys, 3-lever and 5-lever Chubb style keys cut on specialist heavy-duty bit-cutting machines.',
      icon: 'ShieldCheck',
      turnaround: '5 - 10 minutes',
      active: true,
      sortOrder: 6,
      features: ['5-lever British Standard deadlocks', 'Curtain & Chubb patterns', 'Solid brass and steel bit blanks', 'Finely hand-dressed finishes'],
    },
    {
      id: 'padlock-locker-keys',
      name: 'Padlock & Locker Keys',
      shortDescription: 'Duplicates for gym lockers, bike D-locks, shed padlocks, and storage units.',
      fullDescription: 'Keep your valuables accessible. We stock small brass padlock blanks, post box keys, luggage keys, and heavy security chain keys.',
      icon: 'Lock',
      turnaround: '2 - 3 minutes',
      active: true,
      sortOrder: 7,
      features: ['Post box & communal letterbox keys', 'Shed and gate padlocks', 'Gym & locker blanks', 'Small cabinet keys'],
    },
  ],
  openingHours: {
    schedule: [
      { day: 'Monday', dayIndex: 1, openTime: '08:30', closeTime: '18:00', isClosed: false },
      { day: 'Tuesday', dayIndex: 2, openTime: '08:30', closeTime: '18:00', isClosed: false },
      { day: 'Wednesday', dayIndex: 3, openTime: '08:30', closeTime: '18:00', isClosed: false },
      { day: 'Thursday', dayIndex: 4, openTime: '08:30', closeTime: '18:00', isClosed: false },
      { day: 'Friday', dayIndex: 5, openTime: '08:30', closeTime: '18:00', isClosed: false },
      { day: 'Saturday', dayIndex: 6, openTime: '09:00', closeTime: '17:30', isClosed: false },
      { day: 'Sunday', dayIndex: 0, openTime: '10:30', closeTime: '16:00', isClosed: false },
    ],
    holidayNotice: 'Open as normal during bank holidays unless stated. Walk-ins welcome anytime during trading hours.',
  },
  enquiries: [
    {
      id: 'enq-sample-1',
      name: 'David Miller',
      phone: '07700 900123',
      email: 'david.m@example.co.uk',
      service: 'House Keys',
      message: 'Hi, I need 3 sets of Yale front door keys and 2 Chubb mortice keys cut for our new flat on Bedford Hill. Can I bring them in this afternoon?',
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      notes: 'Customer looking for quick turnaround today.',
    },
    {
      id: 'enq-sample-2',
      name: 'Sarah Jenkins',
      phone: '07700 900456',
      email: 'sarah.j@example.co.uk',
      service: 'Office & Business Keys',
      message: 'Hello, our estate agency in Balham needs 10 sets of communal door keys duplicated. Do you offer an invoice for local businesses?',
      status: 'contacted',
      createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
      notes: 'Confirmed VAT invoice and quick bulk discount.',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      authorName: 'Oliver Thorpe',
      location: 'Balham Resident',
      rating: 5,
      reviewText: 'Popped in on my way back from Balham station with two tricky mortice keys that another high street place cut poorly. Balham Key Cutting did them in under ten minutes and both turned like butter on first try.',
      serviceUsed: 'Mortice & Chubb Keys',
      date: 'March 2026',
      active: true,
    },
    {
      id: 'test-2',
      authorName: 'Claire Beaumont',
      location: 'Tooting Bec / Balham',
      rating: 5,
      reviewText: 'Needed emergency spares for our Airbnb apartment in Balham. Fast, courteous, and very fair local price. Will definitely return whenever we need duplicate keys.',
      serviceUsed: 'Spare Keys',
      date: 'February 2026',
      active: true,
    },
    {
      id: 'test-3',
      authorName: 'Marcus Evans',
      location: 'Balham High Road',
      rating: 5,
      reviewText: 'Proper local shop. Quick counter service, knowledgeable advice on our older patio lock, and took 3 minutes while I waited. Highly recommended.',
      serviceUsed: 'House Keys',
      date: 'January 2026',
      active: true,
    },
  ],
  googleSettings: {
    apiKey: '',
    placeId: '',
    syncEnabled: false,
    minRating: 4,
    lastSyncedAt: undefined,
    cachedRating: undefined,
    cachedTotalReviews: undefined,
    cachedReviews: undefined,
  },
  seoSettings: {
    homepageTitle: 'Balham Key Cutting | Fast & Reliable Key Duplication in Balham, London',
    metaDescription: 'Professional key cutting & key duplication in Balham, London. Fast service for house keys, mortice keys, cylinder keys, office spares, and padlocks. Visit us today.',
    aboutTitle: 'About Balham Key Cutting | Local Key Cutting Specialists',
    servicesTitle: 'Our Key Cutting Services | Balham, London',
    contactTitle: 'Contact & Directions | Balham Key Cutting',
    defaultOgImage: '',
    googleAnalyticsId: '',
    googleSearchConsoleCode: '',
    canonicalBase: 'https://balhamkeycutting.co.uk',
  },
  adminUsers: [
    {
      id: 'admin-default',
      username: 'admin',
      passwordHash: defaultAdminPassword.hash,
      salt: defaultAdminPassword.salt,
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ],
  sessions: {},
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const mergedBusiness = { ...initialData.business, ...(parsed.business || {}) };
        if (mergedBusiness.phone === '020 8673 0000') {
          mergedBusiness.phone = initialData.business.phone;
        }
        if (mergedBusiness.whatsapp === '447700900077') {
          mergedBusiness.whatsapp = initialData.business.whatsapp;
        }
        // Merge with initial data to ensure missing fields exist
        return {
          ...initialData,
          ...parsed,
          business: mergedBusiness,
          googleSettings: { ...initialData.googleSettings, ...(parsed.googleSettings || {}) },
          seoSettings: { ...initialData.seoSettings, ...(parsed.seoSettings || {}) },
          openingHours: parsed.openingHours || initialData.openingHours,
          services: parsed.services || initialData.services,
          testimonials: parsed.testimonials || initialData.testimonials,
          enquiries: parsed.enquiries || initialData.enquiries,
          adminUsers: parsed.adminUsers?.length ? parsed.adminUsers : initialData.adminUsers,
          sessions: parsed.sessions || {},
        };
      }
    } catch (err) {
      console.error('Error loading database, resetting to initialData:', err);
    }
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  public save() {
    this.saveData(this.data);
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  // Session management
  public createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
    this.data.sessions[token] = { userId, expiresAt };
    this.save();
    return token;
  }

  public validateSession(token: string): AdminUser | null {
    if (!token) return null;
    const session = this.data.sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.save();
      return null;
    }
    const user = this.data.adminUsers.find((u) => u.id === session.userId);
    return user || null;
  }

  public destroySession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }
}

export const db = new Database();
