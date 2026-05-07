"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SiderBar = dynamic(() => import("./sidebar"), { ssr: false });
import HeaderIn from "./headerIn";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  cars: any[];
  activeCarId: string | null | undefined;
  catalogCars: any[];
  userEmail: string;
}

export default function ResponsiveLayout({ 
  children, 
  cars, 
  activeCarId, 
  catalogCars,
  userEmail 
}: ResponsiveLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Overlay para cerrar el menú en móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Oculto en móvil por defecto, visible en LG */}
      <div className={`
        no-print fixed inset-y-0 left-0 z-[100] w-64 h-[100dvh] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SiderBar 
          cars={cars} 
          activeCarId={activeCarId} 
          catalogCars={catalogCars} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="no-print sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-700/80 bg-white/95 dark:bg-zinc-950/95 px-4 py-4 sm:px-6 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Botón Hamburguesa */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white lg:hidden transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
              
              <div className="flex items-center gap-2">
                <img src="/screen.png" alt="Fiate Logo" className="h-7 w-7 object-contain" />
                <div className="flex flex-col">
                  <h1 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] leading-none">Fiate</h1>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">Dashboard</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-zinc-400 sm:block">{userEmail}</span>
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-zinc-200 dark:ring-zinc-800 transition-colors">
                {userEmail[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar [will-change:transform] transform-gpu">
          {children}
        </main>
      </div>
    </div>
  );
}
