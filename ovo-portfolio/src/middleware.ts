import NextAuth from 'next-auth';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';
import { routing } from './i18n/routing';

const { auth } = NextAuth(authConfig);
const intl = createIntlMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isLoggedIn = Boolean(req.auth);
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
      if (isLoggedIn) return NextResponse.redirect(new URL('/admin', req.url));
      return;
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return;
  }

  return intl(req);
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
