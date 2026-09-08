import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('iso_admin_auth');

    if (!authCookie || authCookie.value !== 'authenticated') {
      // Allow /admin/login page itself
      if (pathname === '/admin/login') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Allow /admin/login if already authenticated (redirect to /admin)
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
