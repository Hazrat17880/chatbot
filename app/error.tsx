"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  RefreshCw,
  Home,
  Bot,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black">
      <div className="relative max-w-2xl w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl" />
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-12">
          <div className="text-center">
            {/* Error Icon */}
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
              Oops! Something Went Wrong
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              {error.message || "An unexpected error occurred. Our team has been notified."}
            </p>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {error.stack || error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-red-400 dark:text-red-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={reset}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>

            {/* Support Note */}
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  Error logged
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Try refreshing
                </span>
                <span>•</span>
                <Link
                  href="/support"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  Contact Support
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Error Reference: {error.digest || "Unknown"}
        </p>
      </div>
    </div>
  );
}