import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User.model';
import { verifyRefreshToken, setAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: true, message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: true, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { error: true, message: 'User not found' },
        { status: 401 }
      );
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(
      (t: any) => t.token === refreshToken && t.expiresAt > Date.now()
    );

    if (!tokenExists) {
      return NextResponse.json(
        { error: true, message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Remove the used refresh token
    user.refreshTokens = user.refreshTokens.filter(
      (t: any) => t.token !== refreshToken
    );

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = user.generateAuthTokens();

    // Save new refresh token
    const deviceInfo = {
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    };

    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo,
    });
    await user.save();

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });

    setAuthCookies(response, accessToken, newRefreshToken);

    return response;
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Invalid refresh token' },
      { status: 401 }
    );
  }
}