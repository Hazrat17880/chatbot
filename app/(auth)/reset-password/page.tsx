"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Shield,
  Sparkles,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setApiError("");
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      // Call the reset password API
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=true");
      }, 2500);
    } catch (error: any) {
      setApiError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  // Success State
  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Password Reset!
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid Token State
  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Request New Link
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main Form
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
            Set New Password
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Create a new strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* API Error */}
          {apiError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {apiError}
              </p>
            </div>
          )}

          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i < passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "bg-zinc-200 dark:bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {strengthLabels[passwordStrength - 1] || "Weak"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formData.password.length}/8+ characters
                  </span>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-200 dark:border-zinc-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-1.5">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password must contain:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "At least 8 characters", check: formData.password.length >= 8 },
                { label: "Uppercase letter", check: /[A-Z]/.test(formData.password) },
                { label: "Lowercase letter", check: /[a-z]/.test(formData.password) },
                { label: "Number", check: /\d/.test(formData.password) },
                { label: "Special character", check: /[@$!%*?&]/.test(formData.password) },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {req.check ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-600" />
                  )}
                  <span className={`text-xs ${
                    req.check
                      ? "text-zinc-600 dark:text-zinc-400"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Resetting Password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-500" />
              Secure Connection
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              End-to-End Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}