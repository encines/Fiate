"use client";

import { useState, useActionState, useEffect } from "react";
import { addFuelLog } from "../actions/addFuelLog";
import { createPortal } from "react-dom";

interface FuelLog {
  id: string;
  date: Date;
  km: number;
  liters: number;
  totalCost: number;
}

export default function FuelTracker({ fuelLogs, activeCarId }: { fuelLogs: FuelLog[], activeCarId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addFuelLog, undefined);

  useEffect(() => {
    if (state?.success) setIsOpen(false);
  }, [state]);

  // Calcular eficiencia (km/l) entre los dos últimos registros
  const calculateEfficiency = () => {
    if (fuelLogs.length < 2) return null;
    const sorted = [...fuelLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted[0];
    const previous = sorted[1];
    
    const kmDiff = latest.km - previous.km;
    if (kmDiff <= 0) return null;
    
    return (kmDiff / latest.liters).toFixed(2);
  };

  const efficiency = calculateEfficiency();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Bitácora de Combustible</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 transition-all active:scale-95"
        >
          + Registrar Carga
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card Eficiencia */}
        <div className="md:col-span-1 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22L17 22"/><path d="M4 9L11 9"/><path d="M14 22L14 9"/><path d="M13 2H15C16.1046 2 17 2.89543 17 4V9"/><path d="M13 2V9"/><path d="M15 13H18.5C19.8807 13 21 14.1193 21 15.5V17.5C21 18.8807 19.8807 20 18.5 20H17"/></svg>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">Rendimiento Actual</p>
          <h2 className="mt-2 text-5xl font-black text-zinc-900 dark:text-white">
            {efficiency || "--"} <span className="text-lg font-bold text-zinc-500">km/l</span>
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            {efficiency ? "Basado en tus últimos dos registros." : "Registra al menos dos cargas para calcular tu eficiencia real."}
          </p>
        </div>

        {/* Tabla de registros */}
        <div className="md:col-span-2 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Fecha</th>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Kilometraje</th>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Litros</th>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Costo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {fuelLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-zinc-900 dark:text-white font-bold">{log.km.toLocaleString()} km</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{log.liters} L</td>
                    <td className="px-6 py-4 text-zinc-900 dark:text-white font-black text-right">${log.totalCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Nueva Carga de Gasolina</h3>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="userCarId" value={activeCarId} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Fecha</label>
                  <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Kilometraje</label>
                  <input type="number" name="km" required placeholder="Ej: 50200" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Litros</label>
                  <input type="number" step="0.01" name="liters" required placeholder="Ej: 40.5" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Costo Total ($)</label>
                  <input type="number" step="0.01" name="totalCost" required placeholder="Ej: 950.00" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white" />
                </div>
              </div>

              {state?.error && <p className="text-sm text-rose-500 font-medium">{state.error}</p>}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancelar</button>
                <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-400 disabled:opacity-50">
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
