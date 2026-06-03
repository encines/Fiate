"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? "py-4" : "py-6"
    }`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className={`relative flex items-center justify-between rounded-[32px] border transition-all duration-500 px-6 py-3 backdrop-blur-xl ${
          scrolled 
            ? "bg-white/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-white/10 shadow-2xl dark:shadow-black/40" 
            : "bg-transparent border-transparent"
        }`}>
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0">
            <Image
              src="/app-icon.png"
              alt="Fiate Logo"
              width={50}
              height={50}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-lg font-black uppercase tracking-tighter sm:text-xl text-zinc-900 dark:text-white">
              Fiate
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 transition-all hover:scale-110 active:scale-95"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 sm:w-[18px] sm:h-[18px]"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 sm:w-[18px] sm:h-[18px]"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
            
            <Link
              href="/login"
              className={`rounded-xl sm:rounded-2xl px-4 sm:px-8 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95 ${
                scrolled 
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                  : "bg-white text-black hover:bg-zinc-100 border border-zinc-200 dark:border-transparent"
              }`}
            >
              Acceso
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
