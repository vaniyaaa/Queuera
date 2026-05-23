import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/compose', '/scheduled', '/accounts'];
const AUTH_PATHS = ['/login', '/register'];
const FRONTEND_SESSION_COOKIE = 'queuera_frontend_session';
const BACKEND_SESSION_COOKIE = 'queuera_token';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const frontendToken = request.cookies.get(FRONTEND_SESSION_COOKIE);
  const backendToken = request.cookies.get(BACKEND_SESSION_COOKIE);
  const token = frontendToken ?? backendToken;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    console.warn(`[middleware:auth] redirect login path=${pathname} frontendCookie=${Boolean(frontendToken)} backendCookie=${Boolean(backendToken)}`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPath && token) {
    console.info(`[middleware:auth] redirect dashboard path=${pathname} frontendCookie=${Boolean(frontendToken)} backendCookie=${Boolean(backendToken)}`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtected || isAuthPath) {
    console.info(`[middleware:auth] allow path=${pathname} frontendCookie=${Boolean(frontendToken)} backendCookie=${Boolean(backendToken)}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|legal).*)'],
};
