import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { isPortalRole, type PortalRole } from './roles'
import { resolveUserRole } from './user-roles'

export type PortalUser = {
  email: string
  password: string
  role?: PortalRole
}

/** AUTH_USERS format: email:password or email:password:role (comma-separated) */
export function parsePortalUsers(raw = process.env.AUTH_USERS ?? ''): PortalUser[] {
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split(':')
      if (parts.length < 2) return null

      const email = parts[0]?.trim().toLowerCase()
      if (!email) return null

      const last = parts[parts.length - 1]?.trim() ?? ''
      if (isPortalRole(last) && parts.length >= 3) {
        return {
          email,
          password: parts.slice(1, -1).join(':'),
          role: last,
        }
      }

      return {
        email,
        password: parts.slice(1).join(':'),
      }
    })
    .filter((user): user is PortalUser => Boolean(user?.email && user.password))
}

export function listPortalEmails() {
  return parsePortalUsers().map((user) => user.email)
}

export async function listPortalUsers() {
  const users = parsePortalUsers()
  return Promise.all(
    users.map(async (user) => ({
      email: user.email,
      role: await resolveUserRole(user.email, user.role),
    })),
  )
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

        const role = await resolveUserRole(user.email, user.role)

        return {
          id: user.email,
          email: user.email,
          name: user.email.split('@')[0],
          role,
        }
      },
    }),
  ],
})
