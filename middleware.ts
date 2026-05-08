import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/mycar')
  
  if (isOnDashboard) {
    if (isLoggedIn) return; // Permitir el paso
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  } else if (isLoggedIn && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
  return;
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
