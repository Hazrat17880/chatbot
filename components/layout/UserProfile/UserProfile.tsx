// components/layout/UserProfile/UserProfile.tsx
"use client";

import { User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { User as UserType } from "../../../redux/scliece/authSclice";

interface UserProfileProps {
  user?: UserType | null;
  isAuthenticated?: boolean;
}

export function UserProfile({ user, isAuthenticated }: UserProfileProps) {
  // ✅ If not authenticated, show login option
  console.log("your user for authentication:",user);
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Sign In
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Click to login
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    );
  }

  // ✅ Show user profile when authenticated
  return (
    <Link
      href="/chat/profile"
      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
      
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}