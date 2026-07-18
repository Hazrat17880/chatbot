import { Loader2, Bot } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black">
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Logo with animation */}
          <div className="relative">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl shadow-purple-500/25 animate-bounce">
              <Bot className="w-12 h-12 text-white" />
            </div>
            {/* Ring animation */}
            <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 animate-ping" />
          </div>

          {/* Loading spinner */}
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" />
            <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Loading...
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-progress" />
          </div>

          {/* Tip */}
          <p className="text-sm text-zinc-400 dark:text-zinc-500 animate-pulse">
            Preparing your AI assistant...
          </p>
        </div>
      </div>
    </div>
  );
}