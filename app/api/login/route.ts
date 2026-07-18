import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "../../../lib/db";
import { User } from '../../../lib/models/User.Model';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/jwt'; // ✅ Updated import
import { handleGoogleLogin } from '@/lib/google'; // ✅ Import Google handler

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, rememberMe, googleToken } = await req.json();

    // ✅ Google Login Flow
    if (googleToken) {
      // Google token is the userId from Auth.js callback
      return handleGoogleLogin(googleToken);
    }

    // ✅ Credentials Login Flow
    if (!email || !password) {
      return NextResponse.json(
        { error: true, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user with password and login fields
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select(
      '+password +loginAttempts +lockUntil +verificationToken +verificationTokenExpires'
    );

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ✅ Check if user is a Google user
    if (user.provider === 'google') {
      return NextResponse.json(
        { 
          error: true, 
          message: 'This account uses Google Sign-In. Please continue with Google.',
          provider: 'google'
        },
        { status: 400 }
      );
    }

    // Check if account is locked
    if (user.isLocked()) {
      const minutesLeft = Math.ceil((user.lockUntil!.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        {
          error: true,
          message: `Account is locked. Try again after ${minutesLeft} minutes`,
        },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isVerified && !user.emailVerified) {
      return NextResponse.json(
        {
          error: true,
          message: 'Please verify your email before logging in',
          requiresVerification: true,
          email: user.email,
        },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: true, message: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      return NextResponse.json(
        { error: true, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // ✅ Generate tokens using your JWT utilities
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      provider: user.provider,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // ✅ Save refresh token
    const deviceInfo = {
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    };

    // ✅ Limit refresh tokens to prevent unlimited growth
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens = user.refreshTokens.slice(-4);
    }

    const expiresInDays = rememberMe ? 30 : 7;
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
      deviceInfo,
    });
    await user.save();

    // Prepare user data for response (excluding sensitive fields)
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      isVerified: user.isVerified,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      provider: user.provider,
      avatar: user.avatar,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });

    // ✅ Use your updated setAuthCookies
    setAuthCookies(response, accessToken, refreshToken);

    // ✅ Also set user cookie for client-side use
    response.cookies.set('user', JSON.stringify({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      provider: user.provider,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}