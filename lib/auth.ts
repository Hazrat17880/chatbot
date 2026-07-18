import NextAuth, { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from "../lib/db";
import { User } from "../lib/models/User.Model";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
   async signIn({ user, account }) {
  try {
    await connectDB();

    let existingUser = await User.findOne({
      email: user.email,
    });

    if (!existingUser) {
      const names = (user.name || "").trim().split(" ");

      const firstName = names[0] || "Google";

      const lastName =
        names.length > 1 ? names.slice(1).join(" ") : "User";

      let username = user.email!
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "");

      const baseUsername = username;

      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter++}`;
      }

      existingUser = await User.create({
        firstName,
        lastName,

        email: user.email,

        username,

        password: null,

        provider: "google",

        googleId: account?.providerAccountId,

        avatar: user.image,

        emailVerified: true,

        isVerified: true,

        isActive: true,

        lastLogin: new Date(),
      });

      console.log("✅ New Google user created.");
    } else {
      existingUser.lastLogin = new Date();

      existingUser.googleId =
        existingUser.googleId || account?.providerAccountId;

      existingUser.avatar =
        user.image || existingUser.avatar;

      existingUser.provider = "google";

      existingUser.emailVerified = true;

      existingUser.isVerified = true;

      await existingUser.save();

      console.log("✅ Existing Google user logged in.");
    }

    return true;
  } catch (error) {
    console.error("Google Login Error:", error);
    return false;
  }
},
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.provider = 'google';
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);