// components/layout/sidebar/Sidebar.tsx
"use client";

import { SidebarLogo } from "./Sidebarlogo"
import { NewChatButton } from "./NewChatButton"
import { SidebarNavigation } from "./sidebarNavigation"
import { SidebarFooter } from "./SidebarFooter"
import { useAppSelector } from "../../../hooks/customHooks"
import { selectUser, selectIsAuthenticated } from "../../../redux/scliece/authSclice"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // ✅ Get Redux data
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // ✅ Log data to console
  console.log("Sidebar - User Data:", user);
  console.log("Sidebar - Is Authenticated:", isAuthenticated);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 flex flex-col`}
    >
      <SidebarLogo onClose={onClose} />
      <NewChatButton />
      <SidebarNavigation />
      {/* ✅ Pass user data to SidebarFooter */}
      <SidebarFooter user={user} isAuthenticated={isAuthenticated} />
    </aside>
  );
}