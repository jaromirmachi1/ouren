import type { PortalRole } from '@/lib/roles'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: PortalRole
  }

  interface Session {
    user: {
      email: string
      name: string
      role: PortalRole
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: PortalRole
  }
}
