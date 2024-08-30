import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const user = req.cookies.get('user');

  if (!user && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  if (user) {
    const { rol } = JSON.parse(user.value);

    if (pathname.startsWith('/admin') && rol !== 'Admin') {
      return NextResponse.redirect(new URL('/home', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', 
    '/home', 
    '/profile', 
    '/admin/:path*', 
    '/login'
  ],
};