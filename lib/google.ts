import { NextResponse } from "next/server";
import { User } from "./models/User.Model";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "./jwt";

export async function handleGoogleLogin(userId: string) {
  try {
    // ✅ Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // ✅ Generate JWT Tokens
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      provider: user.provider,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // ✅ Save Refresh Token
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    if (user.refreshTokens.length >= 5) {
      user.refreshTokens = user.refreshTokens.slice(-4);
    }

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
      deviceInfo: {
        userAgent: "Google OAuth",
        ip: "Google",
        device: "Google OAuth",
      },
    });

    user.lastLogin = new Date();

    await user.save();

    // ✅ Response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          provider: user.provider,
          emailVerified: user.emailVerified,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
        },
        accessToken,
        refreshToken,
      },
    });

    // ✅ HttpOnly Cookies
    setAuthCookies(response, accessToken, refreshToken);

    // ✅ Client Cookie
    response.cookies.set(
      "user",
      JSON.stringify({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        provider: user.provider,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      }
    );

    return response;
  } catch (error: any) {
    console.error("Google login error:", error);

    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to login with Google",
      },
      {
        status: 500,
      }
    );
  }
}