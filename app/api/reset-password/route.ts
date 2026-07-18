// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User.Model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { token, password, confirmPassword } = await req.json();
    console.log("Token:", token);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Validate required fields
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: true, message: 'Token, password, and confirm password are required' },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: true, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error: true,
          message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // ✅ Check if user is a Google user (shouldn't happen, but just in case)
    if (user.provider === 'google') {
      return NextResponse.json(
        { 
          error: true, 
          message: 'Google accounts cannot reset password via email. Please continue with Google.',
          provider: 'google'
        },
        { status: 400 }
      );
    }

    // ✅ Remove manual hashing - let the model's pre-save middleware handle it
    // Just set the plain password, the model will hash it automatically
    user.password = password; // Plain text - will be hashed by pre-save middleware
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}