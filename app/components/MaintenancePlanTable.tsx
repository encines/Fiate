"use client";

import { useState, useTransition } from "react";
import { markServiceDone } from "../actions/markServiceDone";
import { discoverMaintenancePlan } from "../actions/discoverMaintenancePlan";

interface Task {
  id: string;
  name: string;
  frequencyKm: number | null;
}

interface History {
  id: string;
  taskId: string | null;
  kmAtService: number;
}

interface MaintenancePlanTableProps {
  tasks: Task[];
  history: History[];
  currentKm: number;
  userCarId: string;
}

export default function MaintenancePlanTable({ tasks, history, currentKm, userCarId }: MaintenancePlanTableProps) {
  const [isPending, startTransition] = useTransition();

  // Columnas: 10,000 a 100,000 en incrementos de 10,000 (O dinámico según máximo de tareas)
  // Para ser prácticos como el manual, mostraremos de 10k a 120k
  const columns = Array.from({ length: 12 }, (_, i) => (i + 1) * 10000);

  const handleCellClick = (taskId: string, kmMilestone: number) => {
    startTransition(async () => {
      await markServiceDone(userCarId, taskId, kmMilestone);
    });
  };

  const handleAIDiscovery = () => {
    if (confirm(`¿Quieres que la IA busque y genere el plan de mantenimiento oficial para este vehículo?`)) {
      startTransition(async () => {
        const res = await discoverMaintenancePlan(userCarId);
        if (res.error) alert(res.error);
        if (res.success) alert(res.message);
      });
    }
  };

  return (
    <div className="glass-panel mt-6 rounded-[28px] p-6 overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Plan de Mantenimiento Programado</h2>
          <p className="text-sm text-zinc-400 mt-1">Basado en el manual. Haz clic para marcar como completado.</p>
        </div>
        <button 
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all group active:scale-95 disabled:opacity-50"
          onClick={handleAIDiscovery}
        >
          {isPending ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg className="w-4 h-4 group-hover:animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          )}
          {isPending ? "Analizando manuales..." : "Autodescubrir Plan con IA"}
        </button>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="mb-4">No hay tareas de mantenimiento registradas para este modelo.</p>
            <p className="text-xs">Usa el botón de arriba para descubrir el plan oficial con IA.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-zinc-900/90 backdrop-blur-md p-3 border-b border-zinc-700 text-zinc-400 font-semibold shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                  Miles de kilómetros
                </th>
                {columns.map(km => (
                  <th key={km} className="p-3 border-b border-zinc-700 text-center text-zinc-300 font-semibold min-w-[60px]">
                    {km / 1000}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.filter(t => t.frequencyKm).map(task => (
                <tr key={task.id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors group">
                  <td className="sticky left-0 z-10 bg-zinc-900/90 backdrop-blur-md p-3 font-medium text-zinc-200 shadow-[4px_0_12px_rgba(0,0,0,0.5)] group-hover:bg-zinc-800/90 transition-colors">
                    {task.name}
                  </td>
                  
                  {columns.map(km => {
                    const isRequired = km % task.frequencyKm! === 0;
                    const isPastDue = currentKm >= km;
                    const isDone = history.some(h => h.taskId === task.id && (h.kmMilestone === km || h.kmAtService === km));

                    if (!isRequired) {
                      return <td key={km} className="p-3 text-center text-zinc-700 border-l border-zinc-800/30"></td>;
                    }

                    return (
                      <td 
                        key={km} 
                        className="p-3 text-center border-l border-zinc-800/30 transition-all"
                      >
                        <button
                          disabled={isPending}
                          onClick={() => handleCellClick(task.id, km)}
                          className={`
                            flex items-center justify-center w-8 h-8 mx-auto rounded-md transition-all
                            ${isDone 
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50' 
                              : isPastDue 
                                ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                            }
                            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                          `}
                          title={isDone ? 'Completado' : isPastDue ? 'Recomendado / Vencido' : 'Futuro'}
                        >
                          {isDone ? '✓' : isPastDue ? '!' : '+'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center">✓</div>
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center">!</div>
          <span>Recomendado / Pasado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded text-zinc-500 flex items-center justify-center">+</div>
          <span>Futuro</span>
        </div>
      </div>
    </div>
  );
}
