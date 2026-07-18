// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../lib/models/User.Model';
import { setAuthCookies } from '../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();
    console.log("📧 Email received:", email);
    console.log("🔑 OTP received:", otp);

    if (!email || !otp) {
      return NextResponse.json(
        { error: true, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+verificationToken +verificationTokenExpires +emailVerified');

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log("👤 User found:", {
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
      verificationToken: user.verificationToken,
      verificationTokenExpires: user.verificationTokenExpires,
    });

    if (user.emailVerified) {
      return NextResponse.json(
        { error: true, message: 'Email already verified' },
        { status: 400 }
      );
    }

    if (!user.verificationToken || !user.verificationTokenExpires) {
      return NextResponse.json(
        { error: true, message: 'No verification request found. Please request a new code.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const expires = new Date(user.verificationTokenExpires);
    
    if (expires < now) {
      return NextResponse.json(
        { error: true, message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // ✅ Compare OTP (now both are strings)
    console.log("🔑 Comparing:", {
      stored: user.verificationToken,
      received: otp,
      storedType: typeof user.verificationToken,
      receivedType: typeof otp,
      matches: user.verificationToken === otp
    });

    if (user.verificationToken !== otp) {
      return NextResponse.json(
        { error: true, message: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // ✅ Verify user
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    const { accessToken, refreshToken } = user.generateAuthTokens();

    const deviceInfo = {
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    };

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo,
    });
    await user.save();

    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified,
        },
        accessToken,
        refreshToken,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}