"use client";

import { useState } from "react";
import SiderBar from "./sidebar";
import HeaderIn from "./headerIn";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  cars: any[];
  activeCarId: string | null;
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
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Overlay para cerrar el menú en móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Oculto en móvil por defecto, visible en LG */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
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
        <header className="sticky top-0 z-30 border-b border-zinc-700/80 bg-zinc-950/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Botón Hamburguesa */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
              
              <div className="flex flex-col">
                <h1 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">AutoLedger</h1>
                <span className="text-sm font-semibold text-white">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-zinc-400 sm:block">{userEmail}</span>
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-zinc-800">
                {userEmail[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
