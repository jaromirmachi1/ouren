import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'

export type PortalUser = {
  email: string
  password: string
}

/** AUTH_USERS format: email:password,email:password */
export function parsePortalUsers(raw = process.env.AUTH_USERS ?? ''): PortalUser[] {
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const i = entry.indexOf(':')
      if (i <= 0) return null
      return {
        email: entry.slice(0, i).trim().toLowerCase(),
        password: entry.slice(i + 1),
      }
    })
    .filter((user): user is PortalUser => Boolean(user?.email && user.password))
}

export function listPortalEmails() {
  return parsePortalUsers().map((user) => user.email)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
          .trim()
          .toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        const user = parsePortalUsers().find(
          (entry) => entry.email === email && entry.password === password,
        )
        if (!user) return null

        return {
          id: user.email,
          email: user.email,
          name: user.email.split('@')[0],
        }
      },
    }),
  ],
})
