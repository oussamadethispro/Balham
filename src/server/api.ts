import { Router, Request, Response, NextFunction } from 'express';
import { db, hashPassword, verifyPassword, AdminUser } from './db.js';
import crypto from 'crypto';

export const apiRouter = Router();

// Middleware: Require Admin Authentication
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing admin authentication token' });
    return;
  }

  const user = db.validateSession(token);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
    return;
  }

  (req as any).user = user;
  next();
}

// ----------------------------------------------------
// PUBLIC ENDPOINTS
// ----------------------------------------------------

// 1. Single consolidated endpoint for frontend bootstrap
apiRouter.get('/public-data', (req: Request, res: Response) => {
  const data = db.get();
  
  // Exclude private credentials like Google API keys or admin user data
  res.json({
    business: data.business,
    services: data.services.filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder),
    openingHours: data.openingHours,
    testimonials: data.testimonials.filter((t) => t.active),
    googleReviews: {
      isConnected: Boolean(data.googleSettings.apiKey && data.googleSettings.placeId),
      rating: data.googleSettings.cachedRating || null,
      totalReviews: data.googleSettings.cachedTotalReviews || null,
      reviews: data.googleSettings.cachedReviews || [],
      placeId: data.googleSettings.placeId || '',
    },
    seo: data.seoSettings,
  });
});

// 2. Submit new customer enquiry
apiRouter.post('/enquiries', (req: Request, res: Response) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || (!phone && !email) || !message) {
    res.status(400).json({ error: 'Please provide your name, message, and either a phone number or email.' });
    return;
  }

  // Basic sanitization
  const cleanName = String(name).trim().slice(0, 100);
  const cleanPhone = String(phone || '').trim().slice(0, 30);
  const cleanEmail = String(email || '').trim().slice(0, 100);
  const cleanService = String(service || 'General Key Cutting').trim().slice(0, 80);
  const cleanMessage = String(message).trim().slice(0, 2000);

  const newEnquiry = {
    id: `enq-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    service: cleanService,
    message: cleanMessage,
    status: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  const data = db.get();
  data.enquiries.unshift(newEnquiry);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Thank you. Your enquiry has been received. Our Balham team will be in touch promptly.',
    enquiryId: newEnquiry.id,
  });
});

// ----------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const data = db.get();
  const user = data.adminUsers.find((u) => u.username.toLowerCase() === String(username).toLowerCase().trim());

  if (!user) {
    res.status(401).json({ error: 'Invalid username or password.' });
    return;
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid username or password.' });
    return;
  }

  const token = db.createSession(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
  if (token) {
    db.destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as AdminUser;
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

apiRouter.post('/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const currentUser = (req as any).user as AdminUser;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  const isValid = verifyPassword(currentPassword, currentUser.passwordHash, currentUser.salt);
  if (!isValid) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  currentUser.passwordHash = hash;
  currentUser.salt = salt;
  db.save();

  res.json({ success: true, message: 'Password updated successfully.' });
});

// ----------------------------------------------------
// ADMIN DASHBOARD & OVERVIEW STATS
// ----------------------------------------------------

apiRouter.get('/admin/overview', requireAuth, (req: Request, res: Response) => {
  const data = db.get();
  const totalEnquiries = data.enquiries.length;
  const newEnquiries = data.enquiries.filter((e) => e.status === 'new').length;
  const contactedEnquiries = data.enquiries.filter((e) => e.status === 'contacted').length;
  const totalServices = data.services.length;
  const activeServices = data.services.filter((s) => s.active).length;
  const totalTestimonials = data.testimonials.length;

  const isGoogleConnected = Boolean(data.googleSettings.apiKey && data.googleSettings.placeId);
  const googleRating = data.googleSettings.cachedRating ?? 'Not Connected';
  const googleReviewsCount = data.googleSettings.cachedTotalReviews ?? 0;

  res.json({
    totalEnquiries,
    newEnquiries,
    contactedEnquiries,
    totalServices,
    activeServices,
    totalTestimonials,
    isGoogleConnected,
    googleRating,
    googleReviewsCount,
    businessName: data.business.businessName,
    lastSyncedAt: data.googleSettings.lastSyncedAt || null,
    recentEnquiries: data.enquiries.slice(0, 5),
  });
});

// ----------------------------------------------------
// ADMIN: BUSINESS INFO
// ----------------------------------------------------

apiRouter.get('/admin/business', requireAuth, (req: Request, res: Response) => {
  res.json(db.get().business);
});

apiRouter.put('/admin/business', requireAuth, (req: Request, res: Response) => {
  const data = db.get();
  data.business = {
    ...data.business,
    ...req.body,
    latitude: Number(req.body.latitude || data.business.latitude),
    longitude: Number(req.body.longitude || data.business.longitude),
  };
  db.save();
  res.json({ success: true, business: data.business });
});

// ----------------------------------------------------
// ADMIN: SERVICES CRUD & REORDER
// ----------------------------------------------------

apiRouter.get('/admin/services', requireAuth, (req: Request, res: Response) => {
  const services = [...db.get().services].sort((a, b) => a.sortOrder - b.sortOrder);
  res.json(services);
});

apiRouter.post('/admin/services', requireAuth, (req: Request, res: Response) => {
  const { name, shortDescription, fullDescription, icon, turnaround, features, active } = req.body;
  if (!name || !shortDescription) {
    res.status(400).json({ error: 'Service name and short description are required.' });
    return;
  }

  const data = db.get();
  const id = 'svc-' + Date.now();
  const maxOrder = data.services.reduce((max, s) => Math.max(max, s.sortOrder), 0);

  const newService = {
    id,
    name: String(name).trim(),
    shortDescription: String(shortDescription).trim(),
    fullDescription: String(fullDescription || shortDescription).trim(),
    icon: String(icon || 'KeyRound').trim(),
    turnaround: String(turnaround || '2 - 3 minutes').trim(),
    active: active !== undefined ? Boolean(active) : true,
    sortOrder: maxOrder + 1,
    features: Array.isArray(features) ? features : [],
  };

  data.services.push(newService);
  db.save();
  res.status(201).json({ success: true, service: newService });
});

apiRouter.put('/admin/services/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.services.findIndex((s) => s.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  data.services[index] = {
    ...data.services[index],
    ...req.body,
    id, // protect id
  };
  db.save();
  res.json({ success: true, service: data.services[index] });
});

apiRouter.delete('/admin/services/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.services.findIndex((s) => s.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  data.services.splice(index, 1);
  db.save();
  res.json({ success: true, message: 'Service deleted.' });
});

apiRouter.post('/admin/services/reorder', requireAuth, (req: Request, res: Response) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ error: 'orderedIds array required' });
    return;
  }

  const data = db.get();
  orderedIds.forEach((id, idx) => {
    const s = data.services.find((svc) => svc.id === id);
    if (s) {
      s.sortOrder = idx + 1;
    }
  });

  db.save();
  res.json({ success: true, message: 'Services reordered.' });
});

// ----------------------------------------------------
// ADMIN: ENQUIRIES MANAGEMENT
// ----------------------------------------------------

apiRouter.get('/admin/enquiries', requireAuth, (req: Request, res: Response) => {
  const { status, search } = req.query;
  let enquiries = [...db.get().enquiries];

  if (status && status !== 'all') {
    enquiries = enquiries.filter((e) => e.status === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    enquiries = enquiries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q)
    );
  }

  res.json(enquiries);
});

apiRouter.patch('/admin/enquiries/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const data = db.get();
  const enquiry = data.enquiries.find((e) => e.id === id);

  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  if (status && ['new', 'contacted', 'closed'].includes(status)) {
    enquiry.status = status;
  }
  if (notes !== undefined) {
    enquiry.notes = notes;
  }

  db.save();
  res.json({ success: true, enquiry });
});

apiRouter.delete('/admin/enquiries/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  data.enquiries.splice(index, 1);
  db.save();
  res.json({ success: true, message: 'Enquiry deleted.' });
});

// ----------------------------------------------------
// ADMIN: REVIEWS & TESTIMONIALS (Separated)
// ----------------------------------------------------

apiRouter.get('/admin/testimonials', requireAuth, (req: Request, res: Response) => {
  res.json(db.get().testimonials);
});

apiRouter.post('/admin/testimonials', requireAuth, (req: Request, res: Response) => {
  const { authorName, location, rating, reviewText, serviceUsed, date, active } = req.body;
  if (!authorName || !reviewText) {
    res.status(400).json({ error: 'Author name and review text are required.' });
    return;
  }

  const data = db.get();
  const newTestimonial = {
    id: 'test-' + Date.now(),
    authorName: String(authorName).trim(),
    location: String(location || 'Balham Local').trim(),
    rating: Number(rating) || 5,
    reviewText: String(reviewText).trim(),
    serviceUsed: String(serviceUsed || 'Key Duplication').trim(),
    date: String(date || new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })),
    active: active !== undefined ? Boolean(active) : true,
  };

  data.testimonials.unshift(newTestimonial);
  db.save();
  res.status(201).json({ success: true, testimonial: newTestimonial });
});

apiRouter.put('/admin/testimonials/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.testimonials.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Testimonial not found.' });
    return;
  }

  data.testimonials[index] = {
    ...data.testimonials[index],
    ...req.body,
    id,
  };
  db.save();
  res.json({ success: true, testimonial: data.testimonials[index] });
});

apiRouter.delete('/admin/testimonials/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.get();
  const index = data.testimonials.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Testimonial not found.' });
    return;
  }

  data.testimonials.splice(index, 1);
  db.save();
  res.json({ success: true, message: 'Testimonial removed.' });
});

// ----------------------------------------------------
// ADMIN: GOOGLE INTEGRATION SETTINGS & LIVE SYNC
// ----------------------------------------------------

apiRouter.get('/admin/google-settings', requireAuth, (req: Request, res: Response) => {
  const { apiKey, placeId, syncEnabled, minRating, lastSyncedAt, cachedRating, cachedTotalReviews, cachedReviews } = db.get().googleSettings;
  // Mask API key for secure display
  const maskedKey = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : '';
  res.json({
    hasApiKey: Boolean(apiKey),
    maskedApiKey: maskedKey,
    placeId,
    syncEnabled,
    minRating,
    lastSyncedAt,
    cachedRating,
    cachedTotalReviews,
    reviewsCount: cachedReviews?.length || 0,
  });
});

apiRouter.put('/admin/google-settings', requireAuth, (req: Request, res: Response) => {
  const { apiKey, placeId, syncEnabled, minRating } = req.body;
  const data = db.get();

  if (apiKey !== undefined && apiKey !== '') {
    data.googleSettings.apiKey = String(apiKey).trim();
  }
  if (placeId !== undefined) {
    data.googleSettings.placeId = String(placeId).trim();
  }
  if (syncEnabled !== undefined) {
    data.googleSettings.syncEnabled = Boolean(syncEnabled);
  }
  if (minRating !== undefined) {
    data.googleSettings.minRating = Number(minRating);
  }

  db.save();
  res.json({ success: true, message: 'Google settings updated.' });
});

// Test and sync Google Places API details (secure server-side fetch)
apiRouter.post('/admin/google-settings/sync', requireAuth, async (req: Request, res: Response) => {
  const data = db.get();
  const apiKey = req.body.apiKey || data.googleSettings.apiKey;
  const placeId = req.body.placeId || data.googleSettings.placeId;

  if (!apiKey || !placeId) {
    res.status(400).json({ error: 'Google API Key and Place ID are required to sync.' });
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,user_ratings_total,reviews&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.status !== 'OK') {
      res.status(400).json({
        error: `Google API Error: ${result.status} ${result.error_message || ''}`,
      });
      return;
    }

    const details = result.result;
    data.googleSettings.cachedRating = details.rating || 5.0;
    data.googleSettings.cachedTotalReviews = details.user_ratings_total || 0;
    data.googleSettings.cachedReviews = details.reviews || [];
    data.googleSettings.lastSyncedAt = new Date().toISOString();
    if (req.body.apiKey) data.googleSettings.apiKey = req.body.apiKey;
    if (req.body.placeId) data.googleSettings.placeId = req.body.placeId;
    db.save();

    res.json({
      success: true,
      message: `Successfully connected to Google Business profile: "${details.name}". Synced ${details.user_ratings_total} reviews with a rating of ${details.rating}★.`,
      rating: details.rating,
      totalReviews: details.user_ratings_total,
    });
  } catch (err: any) {
    res.status(500).json({ error: `Failed to fetch from Google Places API: ${err.message}` });
  }
});

// ----------------------------------------------------
// ADMIN: OPENING HOURS
// ----------------------------------------------------

apiRouter.get('/admin/opening-hours', requireAuth, (req: Request, res: Response) => {
  res.json(db.get().openingHours);
});

apiRouter.put('/admin/opening-hours', requireAuth, (req: Request, res: Response) => {
  const { schedule, holidayNotice } = req.body;
  const data = db.get();

  if (Array.isArray(schedule)) {
    data.openingHours.schedule = schedule;
  }
  if (holidayNotice !== undefined) {
    data.openingHours.holidayNotice = String(holidayNotice);
  }

  db.save();
  res.json({ success: true, openingHours: data.openingHours });
});

// ----------------------------------------------------
// ADMIN: SEO SETTINGS
// ----------------------------------------------------

apiRouter.get('/admin/seo-settings', requireAuth, (req: Request, res: Response) => {
  res.json(db.get().seoSettings);
});

apiRouter.put('/admin/seo-settings', requireAuth, (req: Request, res: Response) => {
  const data = db.get();
  data.seoSettings = {
    ...data.seoSettings,
    ...req.body,
  };
  db.save();
  res.json({ success: true, seoSettings: data.seoSettings });
});

// ----------------------------------------------------
// SITEMAP & ROBOTS.TXT
// ----------------------------------------------------

export function generateSitemap(baseUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#location</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms-and-conditions</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/cookie-policy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
}

export function generateRobots(baseUrl: string) {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
}
