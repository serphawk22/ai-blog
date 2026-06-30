import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/admin';
  const isDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard');

  // If already authenticated and trying to visit login page, redirect to dashboard
  if (isAuthPage && token === 'authenticated') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If trying to access dashboard without auth, redirect to login page
  if (isDashboard && token !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
}
