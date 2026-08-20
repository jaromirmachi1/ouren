import type { IncomingMessage } from 'node:http';
import type { ClientRequest } from 'node:http';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ADMIN_ORIGIN = 'http://127.0.0.1:3000';
const PUBLIC_ORIGIN = 'http://localhost:5173';
/** Unified deploy: marketing site is built into dashboard/public/site */
const unifiedDeploy = process.env.OUREN_UNIFIED_DEPLOY === '1';

// Vite's proxy typings omit http-proxy event methods used in dev only.
type DevProxy = {
  on(event: 'proxyReq', listener: (proxyReq: ClientRequest, req: IncomingMessage) => void): void;
  on(event: 'proxyRes', listener: (proxyRes: IncomingMessage) => void): void;
};

function rewriteRedirectLocation(location: string) {
  let next = location
    .replaceAll(ADMIN_ORIGIN, PUBLIC_ORIGIN)
    .replaceAll('http://localhost:3000', PUBLIC_ORIGIN)
    .replaceAll('http://127.0.0.1:3000', PUBLIC_ORIGIN);

  const originPrefix = `${PUBLIC_ORIGIN}`;
  const path = next.startsWith(originPrefix) ? next.slice(originPrefix.length) : next;

  if (path === '/login' || path.startsWith('/login/')) {
    next = `${originPrefix}/admin${path}`;
  } else if (path.startsWith('/api/auth')) {
    next = `${originPrefix}/admin${path}`;
  }

  return next;
}

export default defineConfig({
  base: unifiedDeploy ? '/site/' : '/',
  plugins: [react()],
  build: {
    outDir: unifiedDeploy ? 'dashboard/public/site' : 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/admin': {
        target: ADMIN_ORIGIN,
        changeOrigin: true,
        ws: true,
        configure(proxy) {
          const devProxy = proxy as unknown as DevProxy;

          devProxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('x-forwarded-host', req.headers.host ?? 'localhost:5173');
            proxyReq.setHeader('x-forwarded-proto', 'http');
            proxyReq.setHeader('x-forwarded-port', '5173');
          });

          devProxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers.location;
            if (typeof location === 'string') {
              proxyRes.headers.location = rewriteRedirectLocation(location);
            }
          });
        },
      },
    },
  },
});
