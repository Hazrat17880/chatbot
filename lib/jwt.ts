// lib/jwt.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
  provider?: 'credentials' | 'google'; // ✅ Add provider field
}

// ✅ Updated to include provider
export function verifyAccessToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): { id: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Check cookies
  const token = request.cookies.get('accessToken')?.value;
  if (token) {
    return token;
  }

  return null;
}

export function getRefreshToken(request: NextRequest): string | null {
  const token = request.cookies.get('refreshToken')?.value;
  if (token) {
    return token;
  }
  return null;
}

// ✅ Updated to handle NextResponse
export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}

// ✅ Updated to handle NextResponse
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}

// ✅ NEW: Generate access token
export function generateAccessToken(payload: { userId: string; email: string; provider?: string }) {
  return jwt.sign(
    { 
      id: payload.userId, 
      email: payload.email, 
      provider: payload.provider || 'credentials',
      role: 'user' 
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
}

// ✅ NEW: Generate refresh token
export function generateRefreshToken(payload: { userId: string; email: string; provider?: string }) {
  return jwt.sign(
    { id: payload.userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
}

// ✅ NEW: Get user from token
export function getUserFromToken(token: string): AuthPayload | null {
  return verifyAccessToken(token);
}

// ✅ NEW: Check if token is about to expire (within 5 minutes)
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded?.exp) return true;
    const expiryTime = decoded.exp * 1000;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return (expiryTime - now) < fiveMinutes;
  } catch {
    return true;
  }
}