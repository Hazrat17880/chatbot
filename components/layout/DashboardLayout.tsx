"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./Header/header";
import { useAppSelector } from "../../hooks/customHooks"
import { selectUser, selectIsAuthenticated, selectUserLoading } from "../../redux/scliece/authSclice"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // ✅ Get Redux data
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectUserLoading);

  // ✅ Log Redux data to console
  useEffect(() => {
    console.log("📊 Redux State in DashboardLayout:");
    console.log("User Data:", user);
    console.log("Is Authenticated:", isAuthenticated);
    console.log("Loading:", loading);
    
    if (user) {
      console.log("👤 User Details:");
      console.log("  - ID:", user.id);
      console.log("  - Name:", user.firstName, user.lastName);
      console.log("  - Email:", user.email);
      console.log("  - Username:", user.username);
      console.log("  - Email Verified:", user.emailVerified);
      console.log("  - Role:", user.role || 'User');
    }
  }, [user, isAuthenticated, loading]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      {/* ✅ Pass user data to Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        user={user}                    // Pass user data
        isAuthenticated={isAuthenticated} // Pass auth status
        loading={loading}              // Pass loading state
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}