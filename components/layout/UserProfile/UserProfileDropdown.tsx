"use client";

import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { useEffect, useRef } from "react";

interface UserProfileDropdownProps {
  onClose: () => void;
}

export function UserProfileDropdown({ onClose }: UserProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 animate-fade-in"
    >
      <Link
        href="/profile"
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <User className="w-4 h-4" />
        Profile Settings
      </Link>
      <Link
        href="/settings"
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Account Settings
      </Link>
      <button
        onClick={() => {
          console.log("Logout");
          onClose();
        }}
        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-zinc-200 dark:border-zinc-800 mt-1 pt-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}