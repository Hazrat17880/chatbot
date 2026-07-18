// app/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks/customHooks"
import { setUser, clearUser, selectUser } from "../../../redux/scliece/authSclice"
import { signIn, useSession } from "next-auth/react"; // ✅ Import NextAuth
import toast from 'react-hot-toast';
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { data: session, status } = useSession(); // ✅ Get session from NextAuth
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Handle Google session - redirect when authenticated
 

  // If user already logged in, redirect to chat
  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully! Please sign in to continue.");
      toast.success("Account created successfully! Please sign in.");
    }
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully! Please sign in to continue.");
      toast.success("Email verified successfully! Please sign in.");
    }
    if (searchParams.get("error") === "google_auth_failed") {
      toast.error("Google authentication failed. Please try again.");
    }
    if (searchParams.get("error") === "google_callback_failed") {
      toast.error("Failed to complete Google login. Please try again.");
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const loadingToast = toast.loading('Signing in...');
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("your login data are :", data);

      toast.dismiss(loadingToast);

      if (!response.ok) {
        // ✅ Handle Google user error
        if (data.provider === 'google') {
          toast.error('This account uses Google Sign-In. Please click "Continue with Google".');
          setErrors({ password: 'Please use Google Sign-In for this account' });
          return;
        }
        
        if (data.message) {
          toast.error(data.message);
          setErrors({ password: data.message });
        } else {
          toast.error("Invalid email or password. Please try again.");
        }
        return;
      }

      // ✅ STORE USER DATA IN REDUX
      dispatch(setUser({
        id: data.data.user.id,
        firstName: data.data.user.firstName,
        lastName: data.data.user.lastName,
        email: data.data.user.email,
        username: data.data.user.username,
        emailVerified: data.data.user.emailVerified,
        role: data.data.user.role || 'user',
      }));

      // Store tokens in localStorage or cookies
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      toast.success(`Welcome back, ${data.data.user.firstName}! 🎉`, {
        duration: 4000,
      });

      // Redirect to chat
      setTimeout(() => {
        router.push("/chat");
      }, 1000);

    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Updated Google Login Handler
  const handleGoogleLogin = async () => {
  setIsLoading(true);

  try {
    await signIn("google", {
      callbackUrl: "/chat?login=success",
    });
  } catch (error) {
    console.error("Google login error:", error);
    toast.error("Failed to login with Google. Please try again.");
    setIsLoading(false);
  }
};

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              Chat<span className="text-purple-600">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Sign in to continue your conversations
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {successMessage}
            </p>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || status === 'loading'}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  Continue with Google
                </span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
                  errors.email
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-200 dark:border-zinc-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
                  errors.password
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-200 dark:border-zinc-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-purple-600 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded focus:ring-purple-500"
            />
            <label
              htmlFor="remember"
              className="text-sm text-zinc-600 dark:text-zinc-400"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Features Badge */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              AI-Powered
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Free Forever
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-500" />
              Secure
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Protected by industry-standard encryption
      </p>
    </div>
  );
}