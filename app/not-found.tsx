import Link from "next/link";
import {
  Bot,
  Home,
  Search,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  Compass,
} from "lucide-react";

export default function NotFound() {
  const suggestions = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Go to Homepage",
      href: "/",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Start a Chat",
      href: "/chat",
    },
    {
      icon: <Compass className="w-4 h-4" />,
      label: "Browse Features",
      href: "/#features",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "View Pricing",
      href: "/#pricing",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black">
      <div className="relative max-w-3xl w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-12">
          <div className="text-center">
            {/* 404 Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  404
                </span>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 animate-float">
                <Bot className="w-8 h-8 text-purple-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-float-delayed">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
              Page Not Found
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2 max-w-md mx-auto">
              Oops! It seems like you've wandered into the unknown.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-8">
              The page you're looking for might have been moved, deleted, or never existed.
            </p>

            {/* Search Box (visual only) */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search for what you're looking for..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  disabled
                />
              </div>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {suggestions.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {item.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
              <Link
                href="/chat"
                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Start Chatting
              </Link>
            </div>

            {/* Features Badge */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  Secure Connection
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Fast Loading
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  AI-Powered
                </span>
                <span>•</span>
                <Link
                  href="/support"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  Need Help?
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Lost? We're here to help you find your way back.
        </p>
      </div>
    </div>
  );
}