"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Users,
  FileText,
  Settings,
  BarChart3,
  CreditCard,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navigation: NavItem[] = [
  { icon: <MessageSquare className="w-5 h-5" />, label: "Chat", href: "/chat" },
  { icon: <Users className="w-5 h-5" />, label: "Assistants", href: "/chat/assistants" },
  { icon: <FileText className="w-5 h-5" />, label: "Prompts", href: "/chat/prompts" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", href: "/chat/analytics" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Billing", href: "/chat/billing" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/chat/settings" },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              isActive
                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <span className={isActive ? "text-purple-600 dark:text-purple-400" : ""}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}