import type { NextAuthConfig } from 'next-auth'
import { DEFAULT_PORTAL_ROLE, type PortalRole } from './roles'

export const authConfig = {
  // Next.js already mounts the app at /admin — Auth.js path is relative to that
  basePath: '/api/auth',
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [],
  callbacks: {
    // Route protection is handled in middleware.ts so redirects keep /admin basePath
    authorized() {
      return true
    },
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = (token.name as string) || session.user.email
        session.user.role = (token.role as PortalRole) || DEFAULT_PORTAL_ROLE
      }
      return session
    },
  },
} satisfies NextAuthConfig
