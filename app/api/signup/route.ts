// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../lib/models/User.Model';
import { sendOTP } from '../../../lib/email';
import { setAuthCookies } from '../../../lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  referralCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the Terms & Conditions'),
  privacyPolicyAccepted: z.boolean().refine(val => val === true, 'You must accept the Privacy Policy'),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: true, 
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      password,
      username,
      phoneNumber,
      country,
      timezone,
      referralCode,
      termsAccepted,
      privacyPolicyAccepted,
    } = validationResult.data;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username: username || undefined }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: true, message: 'User already exists with this email' },
          { status: 400 }
        );
      }
      if (username && existingUser.username === username) {
        return NextResponse.json(
          { error: true, message: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      username: username || `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
      phoneNumber,
      country,
      timezone: timezone || 'UTC',
      referralCode,
      termsAccepted,
      privacyPolicyAccepted,
      emailVerified: false,
    });

    // ✅ Generate OTP - This will now store the OTP directly
    const { otp, verificationToken } = user.generateOTP();
    
    console.log("📧 OTP Generation Summary:", {
      email: user.email,
      otp: otp,
      verificationToken: verificationToken,
      storedInDB: user.verificationToken,
      expiresAt: user.verificationTokenExpires
    });

    await user.save();

    // Send OTP email
    sendOTP(user.email, user.firstName, otp).catch(err => {
      console.error('Failed to send OTP email:', err);
    });

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
      message: 'Account created successfully! Please check your email for verification.',
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
        requiresVerification: true,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}