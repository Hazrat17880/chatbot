// app/api/resend-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../lib/models/User.Model';
import { sendOTP } from '../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: true, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: true, message: 'Email already verified' },
        { status: 400 }
      );
    }

    // ✅ Generate new OTP
    const { otp } = user.generateOTP();
    await user.save();

    // Send OTP email
    await sendOTP(user.email, user.firstName, otp);

    console.log(`📧 New OTP sent to ${user.email}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'New verification code sent to your email',
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to resend OTP' },
      { status: 500 }
    );
  }
}