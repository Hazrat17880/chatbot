import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from './lib/jwt';

// ✅ Protected routes
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/api/user'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ✅ Check if route is protected
  const isProtected = protectedRoutes.some(route => path.startsWith(route));
  
  // ✅ Allow auth routes and public routes
  const isAuthRoute = path.startsWith('/api/auth') || 
                      path.startsWith('/login') || 
                      path.startsWith('/register') || 
                      path.startsWith('/forgot-password') ||
                      path.startsWith('/reset-password') ||
                      path === '/';

  // ✅ If not protected or is auth route, allow access
  if (!isProtected || isAuthRoute) {
    return NextResponse.next();
  }

  // ✅ Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // ✅ If no access token, redirect to login
  if (!accessToken) {
    if (path.startsWith('/api')) {
      return NextResponse.json(
        { error: true, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Verify access token
  const decoded = verifyAccessToken(accessToken);
  
  if (!decoded) {
    // ✅ Access token expired, try refresh
    if (!refreshToken) {
      if (path.startsWith('/api')) {
        return NextResponse.json(
          { error: true, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ✅ Verify refresh token
    const refreshDecoded = verifyRefreshToken(refreshToken);
    
    if (!refreshDecoded) {
      if (path.startsWith('/api')) {
        return NextResponse.json(
          { error: true, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ✅ Generate new access token
    const newAccessToken = generateAccessToken({
      userId: refreshDecoded.id,
      email: decoded?.email || '',
      provider: decoded?.provider || 'credentials',
    });

    // ✅ Continue with new token
    const response = NextResponse.next();
    
    // ✅ Set new access token cookie
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    return response;
  }

  // ✅ Valid token, proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/user/:path*',
    '/api/auth/logout',
    '/api/auth/refresh',
  ],
};