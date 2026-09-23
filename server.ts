import express from 'express';
import path from 'path';
import fs from 'fs';
import { apiRouter, generateSitemap, generateRobots } from './src/server/api.js';
import { db } from './src/server/db.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Basic security and parsing middlewares
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Basic CORS & Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(generateRobots(baseUrl));
});

// Dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('application/xml');
  res.send(generateSitemap(baseUrl));
});

// Mount API router
app.use('/api', apiRouter);

// Frontend static serving or Vite middleware
async function startServer() {
  if (!isProduction) {
    // In development: use Vite in middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve dist directory
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production dist/ folder not found. Please run npm run build.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Balham Key Cutting server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
