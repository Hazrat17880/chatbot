import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | ChatAI",
  description: "Sign up or log in to ChatAI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black">
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-500/5 dark:bg-pink-500/5 rounded-full blur-3xl" />
        </div>

        {children}
      </div>
    </div>
  );
}