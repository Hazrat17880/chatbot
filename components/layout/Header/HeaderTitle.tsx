"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const navigation = [
  { label: "Chat", href: "/chat" },
  { label: "Assistants", href: "/assistants" },
  { label: "Prompts", href: "/prompts" },
  { label: "Analytics", href: "/analytics" },
  { label: "Billing", href: "/billing" },
  { label: "Settings", href: "/settings" },
];

export function HeaderTitle() {
  const pathname = usePathname();
  const currentPage = navigation.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <h1 className="text-sm font-semibold text-zinc-900 dark:text-white">
        {currentPage}
      </h1>
    </div>
  );
}