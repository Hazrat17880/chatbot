import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User.Model';
import { clearAuthCookies, verifyRefreshToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    // ✅ Try to get token from Authorization header as fallback
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // ✅ Remove refresh token from database
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        // ✅ Remove the specific refresh token
        await User.updateOne(
          { _id: decoded.id },
          { $pull: { refreshTokens: { token: refreshToken } } }
        );
      }
    } 
    // ✅ If no refresh token, try to remove all tokens using access token
    else if (accessToken) {
      // You might want to implement a way to get user from access token
      // or just clear cookies without database cleanup
    }

    // ✅ Clear all cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // ✅ Use your existing clearAuthCookies function
    clearAuthCookies(response);
    
    // ✅ Also delete user cookie
    response.cookies.delete('user');

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Failed to logout' },
      { status: 500 }
    );
  }
}