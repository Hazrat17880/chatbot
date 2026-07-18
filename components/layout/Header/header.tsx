"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { HeaderTitle } from "./HeaderTitle";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderAction"

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
        <HeaderTitle />
      </div>

      <div className="flex items-center gap-2">
        <HeaderSearch />
        <HeaderActions />
      </div>
    </header>
  );
}