"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import CarSelector from "./CarSelector";
import dynamic from "next/dynamic";
import { ThemeToggle } from "./ThemeToggle";

const AddVehicleModal = dynamic(() => import("./AddVehicleModal"), { ssr: false });

const navItems = [
  { 
    label: "Inicio", 
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
    )
  },
  { 
    label: "Mi auto", 
    href: "/mycar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>
    )
  },
  { 
    label: "Plan de Mantenimiento", 
    href: "/plan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
    )
  },
  { 
    label: "Historial de Servicios", 
    href: "/services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )
  },
  { 
    label: "Recordatorios", 
    href: "/reminders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
    )
  },
  { 
    label: "Documentos", 
    href: "/documents",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
    )
  },
  { 
    label: "Combustible", 
    href: "/fuel",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22L17 22"/><path d="M4 9L11 9"/><path d="M14 22L14 9"/><path d="M13 2H15C16.1046 2 17 2.89543 17 4V9"/><path d="M13 2V9"/><path d="M15 13H18.5C19.8807 13 21 14.1193 21 15.5V17.5C21 18.8807 19.8807 20 18.5 20H17"/></svg>
    )
  },
  { 
    label: "Configuración", 
    href: "/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    )
  },
  { 
    label: "Mejorar Plan", 
    href: "/pricing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    )
  },
];

import { SimplifiedCar, CatalogCar } from "../../lib/types";

interface SidebarProps {
  cars?: SimplifiedCar[];
  activeCarId?: string | null;
  catalogCars?: CatalogCar[];
  onClose?: () => void;
}

export default function SiderBar({ cars = [], activeCarId = null, catalogCars = [], onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[100dvh] border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl text-zinc-900 dark:text-white flex-shrink-0 flex flex-col transition-all overflow-hidden">
      <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 overflow-hidden ring-1 ring-indigo-500/20">
            <img src="/screen.png" alt="Fiate Logo" className="h-7 w-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">Fiate</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Control Total</span>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          <div className="px-1">
            <CarSelector cars={cars} activeCarId={activeCarId} />
          </div>

          <nav>
            <p className="px-4 mb-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Menú Principal</p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all group ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-500/50"
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-white"
                      }`}
                    >
                      <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500"}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}

            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-4 pb-4">
          <div className="px-1">
            <ThemeToggle />
          </div>
          
          <div className="px-1">
            <AddVehicleModal catalogCars={catalogCars} />
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all group"
          >
            <svg className="transition-transform group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
