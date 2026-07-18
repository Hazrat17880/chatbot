"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import {
  Bot,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Mail,
  Clock,
  Shield,
  Loader2,
} from "lucide-react";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        if (digits.length === 6) {
          handleSubmit(newOtp.join(""));
        }
      });
    }
  };

  const handleSubmit = async (otpValue?: string) => {
    const finalOtp = otpValue || otp.join("");
    
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      toast.error("Please enter all 6 digits");
      return;
    }

    if (!email) {
      setError("Email is missing. Please go back and try again.");
      toast.error("Email is missing. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Show loading toast
    const loadingToast = toast.loading('Verifying your email...');

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          email: email, 
          otp: finalOtp 
        }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        setError(data.message || "Invalid verification code. Please try again.");
        toast.error(data.message || "Invalid verification code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      // Success
      setSuccess(true);
      toast.success('🎉 Email verified successfully!', {
        duration: 4000,
        icon: '✅',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Verification error:", error);
      setError(error.message || "Failed to verify email. Please try again.");
      toast.error(error.message || "Failed to verify email. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isLoading) return;

    if (!email) {
      toast.error("Email is missing. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    const loadingToast = toast.loading('Sending new verification code...');

    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.message || "Failed to resend code. Please try again.");
        return;
      }

      // Success
      toast.success('📧 New verification code sent to your email!', {
        duration: 4000,
      });

      setTimeLeft(60);
      setCanResend(false);
      setError("");
      // Reset OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Resend error:", error);
      toast.error(error.message || "Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Email Verified! 🎉
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Your email has been successfully verified. Redirecting to login...
            </p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Verify Your Email
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-zinc-900 dark:text-white mt-1">
            {email || "your email address"}
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold bg-zinc-50 dark:bg-zinc-800 border-2 ${
                  error
                    ? "border-red-500 dark:border-red-500"
                    : digit
                    ? "border-purple-500 dark:border-purple-500"
                    : "border-zinc-200 dark:border-zinc-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-zinc-900 dark:text-white`}
                disabled={isLoading}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Resend Timer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Clock className="w-4 h-4" />
              {canResend ? (
                <span>Code expired</span>
              ) : (
                <span>Resend in {timeLeft}s</span>
              )}
            </div>
            <button
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`text-sm font-medium transition-colors ${
                canResend && !isLoading
                  ? "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 cursor-pointer"
                  : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Sending..." : "Resend Code"}
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || otp.some((digit) => digit === "")}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Email
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
        </div>

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Shield className="w-3 h-3 text-green-500" />
            <span>Your information is protected by SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}