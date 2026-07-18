import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "../../../lib/db"
import { User } from "../../../lib/models/User.Model"
import { sendPasswordReset } from "../../../lib/email"

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

    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { 
          error: true, 
          message: 'No account found with this email address. Please check your email or sign up.' 
        },
        { status: 404 }
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

    // ✅ Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    await sendPasswordReset(user.email, user.firstName, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent to your email.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to send reset instructions' },
      { status: 500 }
    );
  }
}