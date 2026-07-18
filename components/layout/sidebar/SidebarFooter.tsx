// components/layout/sidebar/SidebarFooter.tsx
import Link from "next/link";
import { HelpCircle, LogOut } from "lucide-react";
import { UserProfile } from "../UserProfile/UserProfile";
import { useAppSelector } from "../../../hooks/customHooks";
import { selectUser, selectIsAuthenticated } from "../../../redux/scliece/authSclice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/customHooks";
import { clearUser } from "../../../redux/scliece/authSclice";
import { persistor } from "../../../redux/store/store";

export function SidebarFooter() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // ✅ Get Redux data
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // ✅ Handle logout
  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');

    try {
      // Call logout API
      await fetch('/api/logout', { method: 'POST' });
      
      // Clear user from Redux
      dispatch(clearUser());
      
      // Clear persisted data
      await persistor.purge();
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully!');
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
      {/* Help & Support */}
      <Link
        href="/support"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-200"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Help & Support</span>
      </Link>

      {/* ✅ User Profile - Pass user data as props */}
      <UserProfile 
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {/* ✅ Logout Button - Only show when authenticated */}
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      )}
    </div>
  );
}