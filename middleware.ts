// File: middleware.ts (in the root of your project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
const COOKIE_NAME = 'auth_token';

interface TokenPayload {
  role?: string;
}

export async function middleware(request: NextRequest) {
  // 1. Get the cookie from the incoming request
  const cookie = request.cookies.get(COOKIE_NAME);
  const token = cookie?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/submit-message', '/api/login', '/api/messages'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (/\.(.*)$/.test(pathname) || pathname.startsWith('/_next')) {
      return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token and get its payload
    const { payload } = await jwtVerify(token, secretKey) as { payload: TokenPayload };

    // Define admin-only routes
    const adminRoutes = ['/addReasons', '/api/addReasons'];

    // Check if the user is trying to access an admin route
    const isAccessingAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // If they are accessing an admin route WITHOUT the 'admin' role, deny access
    if (isAccessingAdminRoute && payload.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    // If all checks pass, allow the request to continue
    return NextResponse.next();

  } catch (err) {
    // If token verification fails (e.g., expired, invalid), redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// This specifies which paths the middleware should run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};