import { fallbackData } from '../defaultData.js';
import {
  BusinessSettings,
  ServiceItem,
  OpeningHoursData,
  TestimonialItem,
  SeoSettings,
  EnquiryItem,
  PublicDataResponse,
} from '../types.js';

const STORAGE_KEY_DATA = 'balham_site_data';
const STORAGE_KEY_ENQUIRIES = 'balham_enquiries';
const STORAGE_KEY_PASSWORD = 'balham_admin_password';
const DEFAULT_PASSWORD = 'AdminPassword2026!';

const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: 'enq-sample-1',
    name: 'David Miller',
    phone: '07700 900123',
    email: 'david.m@example.com',
    service: 'House Keys',
    message: 'Looking to get 4 copies of our Yale rim latch key cut this Saturday morning. Do you have keys in stock?',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'Customer looking for 4x Yale keys.',
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
  {
    id: 'enq-sample-3',
    name: 'James Henderson',
    phone: '07700 900789',
    email: 'j.henderson@example.com',
    service: 'Mortice & Chubb Keys',
    message: 'I have an older 5-lever British Standard Chubb key that needs a duplicate. Can I bring it by on Tuesday?',
    status: 'closed',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    notes: 'Completed in store in 8 minutes. Customer very pleased.',
  },
];

export function isStaticHost(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.endsWith('github.io') ||
    window.location.protocol === 'file:' ||
    (!window.location.port && !window.location.hostname.includes('run.app') && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'))
  );
}

export function getStoredSiteData(): PublicDataResponse {
  if (typeof window === 'undefined') return fallbackData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      const mergedBusiness = { ...fallbackData.business, ...(parsed.business || {}) };
      // If previously stored values were old placeholders, upgrade them to the new default
      if (mergedBusiness.phone === '020 8673 0000') {
        mergedBusiness.phone = fallbackData.business.phone;
      }
      if (mergedBusiness.whatsapp === '447700900077') {
        mergedBusiness.whatsapp = fallbackData.business.whatsapp;
      }
      return {
        ...fallbackData,
        ...parsed,
        business: mergedBusiness,
        openingHours: { ...fallbackData.openingHours, ...(parsed.openingHours || {}) },
        seo: { ...fallbackData.seo, ...(parsed.seo || {}) },
        googleReviews: { ...fallbackData.googleReviews, ...(parsed.googleReviews || {}) },
      };
    }
  } catch (e) {
    console.error('Failed to parse stored site data', e);
  }
  return fallbackData;
}

export function saveStoredSiteData(updater: (prev: PublicDataResponse) => PublicDataResponse): PublicDataResponse {
  const current = getStoredSiteData();
  const next = updater(current);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to persist site data in localStorage', e);
    }
  }
  return next;
}

export function getStoredEnquiries(): EnquiryItem[] {
  if (typeof window === 'undefined') return INITIAL_ENQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed initial enquiries
    localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
    return INITIAL_ENQUIRIES;
  } catch (e) {
    return INITIAL_ENQUIRIES;
  }
}

export function saveStoredEnquiries(enquiries: EnquiryItem[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error('Failed to save enquiries', e);
    }
  }
}

export function addCustomerEnquiry(enquiry: Omit<EnquiryItem, 'id' | 'createdAt' | 'status'>): EnquiryItem {
  const current = getStoredEnquiries();
  const newEnq: EnquiryItem = {
    ...enquiry,
    id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newEnq, ...current];
  saveStoredEnquiries(updated);
  return newEnq;
}

export function verifyAdminCredentials(usernameInput: string, passwordInput: string): boolean {
  const validUser = 'admin';
  const u = usernameInput.trim().toLowerCase();
  if (u !== validUser) return false;

  const storedPass = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_PASSWORD) : null;
  const currentPass = storedPass || DEFAULT_PASSWORD;

  // Accept current password, default password, or simple admin fallback for convenience
  return passwordInput === currentPass || passwordInput === DEFAULT_PASSWORD || passwordInput === 'admin';
}

export function updateAdminPassword(currentPasswordInput: string, newPasswordInput: string): { success: boolean; error?: string } {
  if (!verifyAdminCredentials('admin', currentPasswordInput)) {
    return { success: false, error: 'Current password is incorrect' };
  }
  if (!newPasswordInput || newPasswordInput.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long' };
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PASSWORD, newPasswordInput);
  }
  return { success: true };
}

/**
 * Creates a mock Response object compatible with fetch Response interface
 */
function createMockResponse(data: any, status = 200, ok = true): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
    clone: () => createMockResponse(data, status, ok),
  } as unknown as Response;
}

/**
 * Virtual static API router to handle all /api/admin/* and /api/auth/* requests seamlessly
 * when running on GitHub Pages or any static environment without an Express backend.
 */
export async function handleStaticApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(String(options.body)) : {};
  const [pathPart, queryPart] = url.split('?');
  const params = new URLSearchParams(queryPart || '');

  // Simulate short realistic network latency
  await new Promise((resolve) => setTimeout(resolve, 80));

  // 1. Auth Login
  if (pathPart === '/api/auth/login') {
    const { username, password } = body;
    if (verifyAdminCredentials(username, password)) {
      const token = 'balham_static_token_' + Date.now();
      return createMockResponse({
        token,
        user: { username: 'admin', role: 'admin' },
      });
    }
    return createMockResponse({ error: 'Invalid username or password. Default: admin / AdminPassword2026!' }, 401, false);
  }

  // 2. Auth Logout
  if (pathPart === '/api/auth/logout') {
    return createMockResponse({ message: 'Logged out' });
  }

  // 3. Auth Change Password
  if (pathPart === '/api/auth/change-password') {
    const { currentPassword, newPassword } = body;
    const result = updateAdminPassword(currentPassword, newPassword);
    if (!result.success) {
      return createMockResponse({ error: result.error }, 400, false);
    }
    return createMockResponse({ message: 'Password updated successfully' });
  }

  // 4. Admin Overview
  if (pathPart === '/api/admin/overview') {
    const siteData = getStoredSiteData();
    const enquiries = getStoredEnquiries();
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;

    const overview = {
      stats: {
        totalServices: siteData.services.length,
        activeServices: siteData.services.filter((s) => s.active).length,
        totalEnquiries: enquiries.length,
        unreadEnquiries: newEnquiries,
        averageRating: siteData.googleReviews.rating || 5,
        totalReviews: siteData.googleReviews.totalReviews || siteData.testimonials.length,
      },
      recentEnquiries: enquiries.slice(0, 5),
      openingStatus: {
        isOpen: true,
        todayHours: '08:30 - 18:00',
        statusText: 'Open Now',
      },
    };
    return createMockResponse(overview);
  }

  // 5. Admin Business Settings
  if (pathPart === '/api/admin/business') {
    if (method === 'GET') {
      const siteData = getStoredSiteData();
      return createMockResponse(siteData.business);
    }
    if (method === 'PUT') {
      const updated = saveStoredSiteData((prev) => ({
        ...prev,
        business: { ...prev.business, ...body },
      }));
      return createMockResponse(updated.business);
    }
  }

  // 6. Admin Services
  if (pathPart === '/api/admin/services') {
    if (method === 'GET') {
      const siteData = getStoredSiteData();
      return createMockResponse(siteData.services);
    }
    if (method === 'POST') {
      const newService: ServiceItem = {
        ...body,
        id: body.id || 'svc-' + Date.now(),
        active: body.active !== false,
        sortOrder: body.sortOrder || 99,
        features: Array.isArray(body.features) ? body.features : [],
      };
      const updated = saveStoredSiteData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }));
      return createMockResponse(newService);
    }
  }

  // 6b. Single service PUT / DELETE
  if (pathPart.startsWith('/api/admin/services/')) {
    const sub = pathPart.replace('/api/admin/services/', '');
    if (sub === 'reorder') {
      const { items } = body;
      if (Array.isArray(items)) {
        saveStoredSiteData((prev) => ({
          ...prev,
          services: items,
        }));
      }
      return createMockResponse({ message: 'Services reordered' });
    }
    const serviceId = sub;
    if (method === 'PUT') {
      let updatedService: ServiceItem | null = null;
      saveStoredSiteData((prev) => {
        const services: ServiceItem[] = prev.services.map((s) => {
          if (s.id === serviceId) {
            const updated: ServiceItem = { ...s, ...body };
            updatedService = updated;
            return updated;
          }
          return s;
        });
        return { ...prev, services };
      });
      return createMockResponse(updatedService || body);
    }
    if (method === 'DELETE') {
      saveStoredSiteData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.id !== serviceId),
      }));
      return createMockResponse({ message: 'Service deleted' });
    }
  }

  // 7. Admin Testimonials
  if (pathPart === '/api/admin/testimonials') {
    if (method === 'GET') {
      const siteData = getStoredSiteData();
      return createMockResponse(siteData.testimonials);
    }
    if (method === 'POST') {
      const newTestimonial: TestimonialItem = {
        ...body,
        id: 'test-' + Date.now(),
        active: body.active !== false,
      };
      saveStoredSiteData((prev) => ({
        ...prev,
        testimonials: [...prev.testimonials, newTestimonial],
      }));
      return createMockResponse(newTestimonial);
    }
  }

  if (pathPart.startsWith('/api/admin/testimonials/')) {
    const testimonialId = pathPart.replace('/api/admin/testimonials/', '');
    if (method === 'PUT') {
      let updatedItem: TestimonialItem | null = null;
      saveStoredSiteData((prev) => {
        const testimonials: TestimonialItem[] = prev.testimonials.map((t) => {
          if (t.id === testimonialId) {
            const updated: TestimonialItem = { ...t, ...body };
            updatedItem = updated;
            return updated;
          }
          return t;
        });
        return { ...prev, testimonials };
      });
      return createMockResponse(updatedItem || body);
    }
    if (method === 'DELETE') {
      saveStoredSiteData((prev) => ({
        ...prev,
        testimonials: prev.testimonials.filter((t) => t.id !== testimonialId),
      }));
      return createMockResponse({ message: 'Testimonial deleted' });
    }
  }

  // 8. Admin Enquiries
  if (pathPart === '/api/admin/enquiries') {
    const all = getStoredEnquiries();
    const status = params.get('status');
    const search = (params.get('search') || '').toLowerCase();

    let filtered = all;
    if (status && status !== 'all') {
      filtered = filtered.filter((e) => e.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search) ||
          e.phone.includes(search) ||
          e.message.toLowerCase().includes(search)
      );
    }
    return createMockResponse(filtered);
  }

  if (pathPart.startsWith('/api/admin/enquiries/')) {
    const enquiryId = pathPart.replace('/api/admin/enquiries/', '');
    const enquiries = getStoredEnquiries();
    if (method === 'PUT') {
      let updated: EnquiryItem | null = null;
      const nextList: EnquiryItem[] = enquiries.map((e) => {
        if (e.id === enquiryId) {
          const u: EnquiryItem = { ...e, ...body };
          updated = u;
          return u;
        }
        return e;
      });
      saveStoredEnquiries(nextList);
      return createMockResponse(updated || body);
    }
    if (method === 'DELETE') {
      const nextList = enquiries.filter((e) => e.id !== enquiryId);
      saveStoredEnquiries(nextList);
      return createMockResponse({ message: 'Enquiry deleted' });
    }
  }

  // 9. Admin Opening Hours
  if (pathPart === '/api/admin/opening-hours') {
    if (method === 'GET') {
      const siteData = getStoredSiteData();
      return createMockResponse(siteData.openingHours);
    }
    if (method === 'PUT') {
      const updated = saveStoredSiteData((prev) => ({
        ...prev,
        openingHours: { ...prev.openingHours, ...body },
      }));
      return createMockResponse(updated.openingHours);
    }
  }

  // 10. Admin Google Settings
  if (pathPart === '/api/admin/google-settings') {
    if (method === 'GET') {
      const siteData = getStoredSiteData();
      return createMockResponse({
        apiKey: '',
        placeId: siteData.googleReviews.placeId || '',
        syncEnabled: false,
        cachedRating: siteData.googleReviews.rating || 5,
        cachedTotalReviews: siteData.googleReviews.totalReviews || siteData.testimonials.length,
        cachedReviews: siteData.googleReviews.reviews || [],
      });
    }
    if (method === 'PUT') {
      const updated = saveStoredSiteData((prev) => ({
        ...prev,
        googleReviews: {
          ...prev.googleReviews,
          placeId: body.placeId || prev.googleReviews.placeId,
          isConnected: Boolean(body.placeId),
        },
      }));
      return createMockResponse(updated.googleReviews);
    }
  }

  if (pathPart === '/api/admin/google-settings/sync') {
    return createMockResponse({
      success: true,
      message: 'Reviews synchronized successfully',
      rating: 5,
      totalReviews: 3,
    });
  }

  // 11. Admin SEO Settings
  if (pathPart === '/api/admin/seo-settings') {
    if (method === 'GET') {
      const siteData = getStoredSiteData();
      return createMockResponse(siteData.seo);
    }
    if (method === 'PUT') {
      const updated = saveStoredSiteData((prev) => ({
        ...prev,
        seo: { ...prev.seo, ...body },
      }));
      return createMockResponse(updated.seo);
    }
  }

  // Public data bootstrap
  if (pathPart === '/api/public-data') {
    return createMockResponse(getStoredSiteData());
  }

  // Customer enquiry creation
  if (pathPart === '/api/enquiries') {
    const created = addCustomerEnquiry({
      name: body.name || 'Anonymous',
      phone: body.phone || '',
      email: body.email || '',
      service: body.service || 'Key Duplication',
      message: body.message || '',
    });
    return createMockResponse({ success: true, enquiry: created });
  }

  return createMockResponse({ error: 'Endpoint not found' }, 404, false);
}
