import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If visiting the root '/', redirect to '/cracksarkar'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/cracksarkar', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
