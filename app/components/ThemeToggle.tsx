"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-[120px] rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
  }

  return (
    <div className="flex bg-zinc-200 dark:bg-zinc-900 rounded-xl p-1 gap-1">
      <button
        onClick={() => setTheme("light")}
        className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${
          theme === "light" 
            ? "bg-white text-orange-500 shadow-sm" 
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        }`}
        title="Modo Claro"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${
          theme === "dark" 
            ? "bg-zinc-800 text-orange-400 shadow-sm" 
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        }`}
        title="Modo Oscuro"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${
          theme === "system" 
            ? "bg-white dark:bg-zinc-800 text-orange-500 dark:text-orange-400 shadow-sm" 
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        }`}
        title="Sistema"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
      </button>
    </div>
  );
}
