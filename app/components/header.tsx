"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/screen.png"
              alt="Fiate Logo"
              width={60}
              height={60}
              className="h-9 w-auto object-contain brightness-110"
            />
            <span className={`text-xl font-black uppercase tracking-tighter sm:block transition-colors duration-300 ${
              scrolled 
                ? "text-zinc-900 dark:text-white" 
                : "text-zinc-900 dark:text-white"
            }`}>
              Fiate
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 transition-all hover:scale-110 active:scale-95"
            >
              {!mounted ? (
                <div className="h-[18px] w-[18px]" />
              ) : theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
            
            <Link
              href="/login"
              className={`rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95 ${
                scrolled 
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                  : "bg-white text-black hover:bg-zinc-100"
              }`}
            >
              Acceso
            </Link>
          </div>

          <button 
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-white/5 transition-all lg:hidden ${
              scrolled ? "text-zinc-900 dark:text-white" : "text-white"
            }`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative h-4 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-all ${isOpen ? "top-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 h-0.5 w-full bg-current transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-full bg-current transition-all ${isOpen ? "top-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <nav
        className={`absolute left-0 right-0 top-[calc(100%+1rem)] mx-6 rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-950/90 p-8 shadow-2xl backdrop-blur-3xl transition-all duration-500 lg:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setIsOpen(false); }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-white/10 py-4 text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
          >
            Cambiar Tema
          </button>
          <Link
            href="/login"
            className="rounded-2xl bg-indigo-600 py-4 text-center text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 active:scale-95"
            onClick={() => setIsOpen(false)}
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>
    </header>
  );
}
