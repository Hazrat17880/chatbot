import { Search } from "lucide-react";

export function HeaderSearch() {
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 w-40"
      />
      <kbd className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
        ⌘K
      </kbd>
    </div>
  );
}