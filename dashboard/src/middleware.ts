import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { adminPath, ADMIN_BASE } from '@/lib/admin-path'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

function stripAdminPath(pathname: string) {
  if (pathname === ADMIN_BASE || pathname.startsWith(`${ADMIN_BASE}/`)) {
    return pathname.slice(ADMIN_BASE.length) || '/'
  }
  return pathname
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith(adminPath('/api/auth'))) {
    return NextResponse.next()
  }

  const isAdmin = pathname === ADMIN_BASE || pathname.startsWith(`${ADMIN_BASE}/`)
  if (!isAdmin) {
    if (
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname === '/og-image.jpg'
    ) {
      return NextResponse.rewrite(new URL(`/site${pathname}`, req.url))
    }

    // Marketing SPA (built into public/site)
    if (pathname === '/' || !pathname.startsWith('/site/')) {
      return NextResponse.rewrite(new URL('/site/index.html', req.url))
    }

    return NextResponse.next()
  }

  const path = stripAdminPath(pathname)
  const isLogin = path === '/login' || path.startsWith('/login/')
  const isAuthed = Boolean(req.auth?.user)

  if (isAuthed && isLogin) {
    return NextResponse.redirect(new URL(ADMIN_BASE, req.nextUrl.origin))
  }

  if (!isAuthed && !isLogin) {
    const login = new URL(adminPath('/login'), req.nextUrl.origin)
    login.searchParams.set('callbackUrl', path === '/' ? ADMIN_BASE : adminPath(path))
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico|site/).*)'],
}
