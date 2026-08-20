import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ADMIN_ORIGIN = 'http://127.0.0.1:3000';
const PUBLIC_ORIGIN = 'http://localhost:5173';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/admin': {
        target: ADMIN_ORIGIN,
        changeOrigin: true,
        ws: true,
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('x-forwarded-host', req.headers.host ?? 'localhost:5173');
            proxyReq.setHeader('x-forwarded-proto', 'http');
            proxyReq.setHeader('x-forwarded-port', '5173');
          });
          proxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers.location;
            if (typeof location === 'string') {
              let next = location
                .replaceAll(ADMIN_ORIGIN, PUBLIC_ORIGIN)
                .replaceAll('http://localhost:3000', PUBLIC_ORIGIN)
                .replaceAll('http://127.0.0.1:3000', PUBLIC_ORIGIN);

              // Auth redirects sometimes omit Next basePath (/admin)
              try {
                const url = new URL(next, PUBLIC_ORIGIN);
                if (url.pathname === '/login' || url.pathname.startsWith('/login/')) {
                  url.pathname = `/admin${url.pathname}`;
                  next = url.toString();
                } else if (url.pathname.startsWith('/api/auth')) {
                  url.pathname = `/admin${url.pathname}`;
                  next = url.toString();
                }
              } catch {
                // keep rewritten location
              }

              proxyRes.headers.location = next;
            }
          });
        },
      },
    },
  },
});
