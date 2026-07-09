import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes
  if (path.startsWith('/admin')) {
    const tokenCookie = request.cookies.get('sb-auth-token');

    let isAuthenticated = false;
    if (tokenCookie?.value) {
      try {
        // Supabase session JSON is uri encoded when stored in cookies
        const session = JSON.parse(decodeURIComponent(tokenCookie.value));
        if (session && session.access_token) {
          isAuthenticated = true;
        }
      } catch (e) {
        // Silent catch for malformed session JSON
      }
    }

    if (!isAuthenticated) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
