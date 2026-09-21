import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Redirect-only guard (UX). Real authorization is enforced by the backend on every API call.

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];
const HOME_BY_ROLE: Record<string, string> = {
  admin: '/admin',
  influencer: '/influencer',
  freelancer: '/freelancer',
};

// A token that has expired counts as "not logged in" (no unverified trust beyond exp).
function tokenIsLive(token?: string): boolean {
  if (!token) return false;
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp !== 'number' || json.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const redirect = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const token =
    request.cookies.get('Access_Token')?.value ?? request.cookies.get('tt_token')?.value;
  const loggedIn = tokenIsLive(token);
  const role = request.cookies.get('tt_role')?.value?.toLowerCase();
  const home = role ? HOME_BY_ROLE[role] : undefined;

  if (pathname === '/') {
    return redirect(loggedIn && home ? home : '/login');
  }

  // Already signed in -> never show login / signup / reset pages again.
  if (AUTH_PAGES.includes(pathname.toLowerCase())) {
    return loggedIn && home ? redirect(home) : NextResponse.next();
  }

  // Everything else that reaches here is a dashboard area.
  if (!loggedIn) {
    const res = redirect('/login');
    if (token) {
      // expired token: drop the stale cookies
      ['Access_Token', 'tt_token', 'tt_role'].forEach((c) => res.cookies.delete(c));
    }
    return res;
  }

  if (home) {
    const inOwnArea = pathname === home || pathname.startsWith(`${home}/`);
    const adminMaySeeSuperadmin = role === 'admin' && pathname.startsWith('/superadmin');
    if (!inOwnArea && !adminMaySeeSuperadmin) return redirect(home);
  }

  // Dashboards must not be served from the browser's back/forward cache after logout.
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/Register',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/admin/:path*',
    '/influencer/:path*',
    '/freelancer/:path*',
    '/superadmin/:path*',
  ],
};