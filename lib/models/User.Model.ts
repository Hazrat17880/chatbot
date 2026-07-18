// lib/models/User.Model.ts
import mongoose, { Schema, Document, Model, models } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string | null; // ✅ Changed to allow null for Google users
  username: string;
  phoneNumber?: string;
  country?: string;
  timezone: string;
  emailVerified: boolean;
  isVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  loginAttempts: number;
  lockUntil?: Date;
  
  // ✅ Google OAuth fields
  provider: 'credentials' | 'google';
  googleId?: string;
  avatar?: string;
  
  refreshTokens: {
    token: string;
    expiresAt: Date;
    deviceInfo?: {
      userAgent?: string;
      ip?: string;
      device?: string;
    };
  }[];
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateOTP(): { otp: string; verificationToken: string };
  generateAuthTokens(): { accessToken: string; refreshToken: string };
  generatePasswordResetToken(): string;
  isVerificationTokenValid(token: string): boolean;
  isResetTokenValid(token: string): boolean;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      default: null, // ✅ Changed from required to default:null
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    
    // ✅ Google OAuth fields
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    avatar: {
      type: String,
      default: null,
    },
    
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
        deviceInfo: {
          userAgent: String,
          ip: String,
          device: String,
        },
      },
    ],
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.verificationToken;
        delete ret.verificationTokenExpires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.loginAttempts;
        delete ret.lockUntil;
        return ret;
      },
    },
  }
);

// ✅ Updated Pre-save middleware - handle null password
UserSchema.pre<IUser>('save', async function () {
  // ✅ Skip if password is null (Google user) or not modified
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
});

// ✅ Updated comparePassword - handle null password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // ✅ If no password (Google user), return false
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ Method: Generate OTP
UserSchema.methods.generateOTP = function (): { otp: string; verificationToken: string } {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationToken = otp;
  this.verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
  console.log("✅ Generated OTP:", otp);
  return { otp, verificationToken: otp };
};

// ✅ Method: Generate Auth Tokens
UserSchema.methods.generateAuthTokens = function (): { accessToken: string; refreshToken: string } {
  const accessToken = crypto.randomBytes(64).toString('hex');
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return { accessToken, refreshToken };
};

// ✅ Method: Generate Password Reset Token
UserSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  return token;
};

// ✅ Method: Check if verification token is valid
UserSchema.methods.isVerificationTokenValid = function (token: string): boolean {
  return (
    this.verificationToken === token &&
    this.verificationTokenExpires &&
    this.verificationTokenExpires > new Date()
  );
};

// ✅ Method: Check if reset token is valid
UserSchema.methods.isResetTokenValid = function (token: string): boolean {
  return (
    this.resetPasswordToken === token &&
    this.resetPasswordExpires &&
    this.resetPasswordExpires > new Date()
  );
};

// ✅ Method: Check if account is locked
UserSchema.methods.isLocked = function (): boolean {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
};

// ✅ Method: Increment login attempts
UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 15 * 60 * 1000;

  this.loginAttempts = (this.loginAttempts || 0) + 1;

  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME);
    this.loginAttempts = MAX_LOGIN_ATTEMPTS;
  }

  await this.save();
};

// ✅ Method: Reset login attempts
UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ 'refreshTokens.token': 1 });

// ✅ Export User model
export const User = (models.User as Model<IUser>) || 
  mongoose.model<IUser>('User', UserSchema);