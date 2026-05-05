"use client";

import { useState, useTransition, useEffect } from "react";
import { deleteVehicle } from "../actions/deleteVehicle";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

const preferences = [
  { label: "Notificaciones por correo", value: "Activadas" },
  { label: "Unidad de distancia", value: "Kilómetros (km)" },
  { label: "Moneda", value: "MXN" },
  { label: "Tema", value: "Oscuro" },
];

interface SettingsProps {
  cars?: any[];
  car?: any;
}

export default function Settings({ cars = [], car }: SettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<{ id: string, name: string } | null>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [userPrefs, setUserPrefs] = useState({
    notifications: "Activadas",
    unit: "Kilómetros (km)",
    currency: "MXN",
    theme: theme === "system" ? "Sistema" : theme === "dark" ? "Oscuro" : "Claro"
  });

  useEffect(() => {
    setMounted(true);
    const savedNotifications = localStorage.getItem("fiate_notifications");
    const savedUnit = localStorage.getItem("fiate_unit");
    const savedCurrency = localStorage.getItem("fiate_currency");
    
    setUserPrefs(prev => ({
      ...prev,
      notifications: savedNotifications || prev.notifications,
      unit: savedUnit || prev.unit,
      currency: savedCurrency || prev.currency,
      theme: theme === "system" ? "Sistema" : theme === "dark" ? "Oscuro" : "Claro"
    }));
  }, [theme]);

  const openDeleteModal = (id: string, name: string) => {
    setCarToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!carToDelete) return;
    
    startTransition(async () => {
      const result = await deleteVehicle(carToDelete.id);
      if (result.error) {
        alert(result.error);
      }
      setShowDeleteModal(false);
      setCarToDelete(null);
    });
  };

  const updatePref = (key: string, value: string) => {
    setUserPrefs(prev => ({ ...prev, [key]: value }));
    if (key === "theme") {
      setTheme(value === "Sistema" ? "system" : value === "Oscuro" ? "dark" : "light");
    } else {
      localStorage.setItem(`fiate_${key}`, value);
    }
  };

  if (!mounted) return null;

  return (
    <div className="view-shell text-zinc-900 dark:text-zinc-100 space-y-8 p-8 transition-colors">
      <section className="glass-panel p-8 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 rounded-[32px] backdrop-blur-md">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Configuración</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-lg">
          Administra tu garaje y las preferencias de tu cuenta profesional.
        </p>
      </section>

      {/* Gestión de Vehículos */}
      <section className="glass-panel p-8 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 rounded-[32px] backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Mis Vehículos</h2>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-1">Gestiona los autos registrados en tu flota.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 8-2 2-5-5 2-2"/><path d="M11 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M7 15h0"/><path d="M12 15h0"/><path d="M17 15h0"/></svg>
          </div>
        </div>

        <div className="grid gap-4">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div 
                key={car.id} 
                className="group flex items-center justify-between p-6 rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {car.imageUrl ? (
                      <img src={car.imageUrl} alt={car.model} className="h-full w-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-zinc-900 dark:text-white">{car.brand} {car.model}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                      <span>{car.year}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                      <span>{car.licensePlate || "Sin placas asignadas"}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => openDeleteModal(car.id, `${car.brand} ${car.model}`)}
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-50 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 rounded-[24px] border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/10">
              <p className="text-zinc-500 dark:text-zinc-500 font-medium">No tienes vehículos registrados en tu garaje.</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="glass-panel p-8 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 rounded-[32px] backdrop-blur-md">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Preferencias
          </h2>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-[24px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-colors">
            {/* Notificaciones */}
            <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Notificaciones por correo</span>
              <select 
                value={userPrefs.notifications}
                onChange={(e) => updatePref("notifications", e.target.value)}
                className="bg-transparent text-zinc-900 dark:text-white text-sm font-bold focus:outline-none cursor-pointer text-right"
              >
                <option className="bg-white dark:bg-zinc-900" value="Activadas">Activadas</option>
                <option className="bg-white dark:bg-zinc-900" value="Desactivadas">Desactivadas</option>
              </select>
            </div>
            {/* Unidad */}
            <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Unidad de distancia</span>
              <select 
                value={userPrefs.unit}
                onChange={(e) => updatePref("unit", e.target.value)}
                className="bg-transparent text-zinc-900 dark:text-white text-sm font-bold focus:outline-none cursor-pointer text-right"
              >
                <option className="bg-white dark:bg-zinc-900" value="Kilómetros (km)">Kilómetros (km)</option>
                <option className="bg-white dark:bg-zinc-900" value="Millas (mi)">Millas (mi)</option>
              </select>
            </div>
            {/* Moneda */}
            <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Moneda</span>
              <select 
                value={userPrefs.currency}
                onChange={(e) => updatePref("currency", e.target.value)}
                className="bg-transparent text-zinc-900 dark:text-white text-sm font-bold focus:outline-none cursor-pointer text-right"
              >
                <option className="bg-white dark:bg-zinc-900" value="MXN">MXN</option>
                <option className="bg-white dark:bg-zinc-900" value="USD">USD</option>
                <option className="bg-white dark:bg-zinc-900" value="EUR">EUR</option>
              </select>
            </div>
            {/* Tema */}
            <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Tema</span>
              <select 
                value={userPrefs.theme}
                onChange={(e) => updatePref("theme", e.target.value)}
                className="bg-transparent text-zinc-900 dark:text-white text-sm font-bold focus:outline-none cursor-pointer text-right"
              >
                <option className="bg-white dark:bg-zinc-900" value="Oscuro">Oscuro</option>
                <option className="bg-white dark:bg-zinc-900" value="Claro">Claro</option>
                <option className="bg-white dark:bg-zinc-900" value="Sistema">Sistema</option>
              </select>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 rounded-[32px] backdrop-blur-md">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Seguridad
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Mantén tu cuenta protegida cambiando tu contraseña periódicamente y cerrando sesiones activas en otros dispositivos.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => alert("Para cambiar tu contraseña, cierra sesión e ingresa mediante el flujo de recuperación o gestiona tu acceso desde tu proveedor de correo si usas Google/GitHub.")}
              className="w-full rounded-[18px] bg-indigo-500 px-6 py-4 text-sm font-bold text-white hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Cambiar contraseña
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full rounded-[18px] border border-zinc-200 dark:border-zinc-800 px-6 py-4 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-[0.98]"
            >
              Cerrar todas las sesiones
            </button>
          </div>
        </section>
      </div>

      {/* Premium Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all">
          <div className="relative w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">¿Eliminar vehículo?</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Estás a punto de eliminar el <span className="text-zinc-900 dark:text-white font-bold">{carToDelete?.name}</span> de tu garaje. 
              Esta acción es permanente y se borrará todo su historial de servicios.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                disabled={isPending}
                className="w-full rounded-[18px] bg-rose-500 py-4 text-sm font-bold text-white hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                  </span>
                ) : "Sí, eliminar definitivamente"}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isPending}
                className="w-full rounded-[18px] border border-zinc-200 dark:border-zinc-700 py-4 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
