import Link from "next/link";
import { Bot, X } from "lucide-react";

interface SidebarLogoProps {
  onClose: () => void;
}

export function SidebarLogo({ onClose }: SidebarLogoProps) {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
      <Link href="/" className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-zinc-900 dark:text-white">
          Chat<span className="text-purple-600">AI</span>
        </span>
      </Link>
      <button
        onClick={onClose}
        className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
      </button>
    </div>
  );
}