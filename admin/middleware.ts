import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If visiting the root '/', redirect to '/cracksarkar-cms'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/cracksarkar-cms', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
