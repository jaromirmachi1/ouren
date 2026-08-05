import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  // Next.js basePath is /admin — Auth routes live under /admin/api/auth
  basePath: '/admin/api/auth',
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname
      const isLogin = path === '/login' || path.startsWith('/login/')
      if (isLogin) return true
      return !!auth?.user
    },
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = (token.name as string) || session.user.email
      }
      return session
    },
  },
} satisfies NextAuthConfig
