import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

function stripBasePath(pathname: string) {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const stripped = pathname.slice('/admin'.length) || '/'
    return stripped
  }
  return pathname
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/admin/api/auth')) {
    return NextResponse.next()
  }

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  if (!isAdmin) {
    return NextResponse.rewrite(new URL('/site/index.html', req.url))
  }

  const path = stripBasePath(pathname)
  const isLogin = path === '/login' || path.startsWith('/login/')
  const isAuthed = Boolean(req.auth?.user)

  if (isAuthed && isLogin) {
    const home = new URL('/admin', req.nextUrl.origin)
    return NextResponse.redirect(home)
  }

  if (!isAuthed && !isLogin) {
    const login = new URL('/admin/login', req.nextUrl.origin)
    login.searchParams.set('callbackUrl', path === '/' ? '/admin' : `/admin${path}`)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|site/).*)',
  ],
}
