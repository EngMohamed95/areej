import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'menu-image-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/list-images' && req.method === 'GET') {
              try {
                const dir = path.resolve(__dirname, 'public', 'uploads', 'products');
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }
                const files = fs.readdirSync(dir);
                const urls = files
                  .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
                  .map(f => `/uploads/products/${f}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, images: urls }));
              } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: String(e) }));
              }
              return;
            }
            if (req.url === '/api/upload-image' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  const { fileName, base64Data } = data;
                  if (!fileName || !base64Data) {
                    throw new Error('Missing fileName or base64Data');
                  }
                  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
                  const dir = path.resolve(__dirname, 'public', 'uploads', 'products');
                  if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                  }
                  const base64Clean = base64Data.split(';base64,').pop();
                  const targetPath = path.join(dir, safeName);
                  fs.writeFileSync(targetPath, base64Clean, { encoding: 'base64' });
                  const url = `/uploads/products/${safeName}`;
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, url }));
                } catch (e) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: String(e) }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
