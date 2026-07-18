import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "../../../lib/db";
import { User } from "../../../lib/models/User.Model";
import { handleGoogleLogin } from "@/lib/google";

export async function GET() {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return handleGoogleLogin(user._id.toString());

  } catch (error: any) {
  console.error(error);

  return NextResponse.json(
    {
      error: true,
      message: "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}
}