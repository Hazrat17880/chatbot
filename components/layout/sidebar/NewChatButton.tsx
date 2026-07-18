import Link from "next/link";
import { Plus } from "lucide-react";

export function NewChatButton() {
  return (
    <div className="p-4">
      <Link
        href="/chat/new"
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        New Chat
      </Link>
    </div>
  );
}