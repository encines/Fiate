"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled ? "py-4" : "py-6"
    }`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className={`relative flex items-center justify-between rounded-[24px] border border-white/5 bg-zinc-900/40 px-6 py-3 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
          scrolled ? "shadow-black/40" : "bg-transparent border-transparent backdrop-blur-none shadow-none"
        }`}>
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/screen.png"
              alt="Fiate Logo"
              width={80}
              height={80}
              className="h-10 w-auto object-contain brightness-110"
            />
            <span className="hidden text-xl font-black uppercase tracking-tighter sm:block">Fiate</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {["Inicio", "Servicios", "Flota", "Contacto"].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
              >
                {item}
              </Link>
            ))}
            <div className="h-4 w-[1px] bg-white/10" />
            <Link
              href="/login"
              className="rounded-xl bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95"
            >
              Sign In
            </Link>
          </nav>

          <button 
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 lg:hidden" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative h-4 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-white transition-all ${isOpen ? "top-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 h-0.5 w-full bg-white transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-full bg-white transition-all ${isOpen ? "top-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <nav
        className={`absolute left-0 right-0 top-[calc(100%+1rem)] mx-6 rounded-[32px] border border-white/10 bg-zinc-950/90 p-8 shadow-2xl backdrop-blur-3xl transition-all duration-500 lg:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 text-center">
          {["Inicio", "Servicios", "Flota", "Contacto"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-4 rounded-2xl bg-indigo-600 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}
