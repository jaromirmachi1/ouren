export const PORTAL_ROLES = ['viewer', 're_agent', 'ceo'] as const

export type PortalRole = (typeof PORTAL_ROLES)[number]

export function isPortalRole(value: string): value is PortalRole {
  return (PORTAL_ROLES as readonly string[]).includes(value)
}

export const DEFAULT_PORTAL_ROLE: PortalRole = 're_agent'
