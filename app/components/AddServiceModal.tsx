"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { addCustomService } from "../actions/addCustomService";

interface AddServiceModalProps {
  cars: any[];
  activeCarId: string | null;
  buttonClass?: string;
}

export default function AddServiceModal({ cars, activeCarId, buttonClass }: AddServiceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const DEFAULT_TASKS = [
    "Cambio de Aceite", 
    "Rotación de Llantas", 
    "Cambio de Frenos", 
    "Filtro de Aire", 
    "Revisión de Batería", 
    "Relleno de Fluidos"
  ];

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);

  const activeCar = cars.find((c) => c.id === activeCarId) || cars[0];

  const [state, formAction, isPending] = useActionState(
    addCustomService,
    undefined
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  const toggleTask = (task: string) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter((t) => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const addCustomTask = () => {
    if (customTaskInput.trim() && !DEFAULT_TASKS.includes(customTaskInput.trim()) && !customTasks.includes(customTaskInput.trim())) {
      setCustomTasks([...customTasks, customTaskInput.trim()]);
      setSelectedTasks([...selectedTasks, customTaskInput.trim()]);
      setCustomTaskInput("");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClass || "flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-200 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/70"}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-500 dark:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </div>
        Agregar Servicio
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="relative w-full h-full sm:h-auto max-w-5xl sm:max-h-[90vh] sm:rounded-[32px] border-0 sm:border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col transition-colors">
            {/* Header - Fixed */}
            <div className="p-6 md:p-8 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Nuevo Registro de Servicio</h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Completa los detalles para mantener el historial de tu auto impecable.</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <form id="service-form" action={formAction}>
                <input type="hidden" name="userCarId" value={activeCar?.id || ""} />
                <input type="hidden" name="customName" value={selectedTasks.join(", ")} />

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  {/* Main Column */}
                  <div className="space-y-6">
                    {/* Service Details Card */}
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-6">
                      <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-medium uppercase text-xs tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        Detalles del Servicio
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-white">
                                {activeCar ? `${activeCar.brand} ${activeCar.model}` : "Sin vehículo"}
                              </p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{activeCar?.year} · PLACAS: {activeCar?.licensePlate || "N/A"}</p>
                            </div>
                            </div>
                          </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Fecha</label>
                          <input 
                            type="date" 
                            name="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="appearance-none w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Kilometraje</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              name="kmAtService"
                              required
                              placeholder="Ej: 45,000"
                              className="appearance-none w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all pr-12"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">KM</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo de Servicio</label>
                        <select className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all appearance-none">
                          <option>Mantenimiento General</option>
                          <option>Reparación Correctiva</option>
                          <option>Mejora / Estética</option>
                        </select>
                      </div>
                    </div>

                    {/* Tasks Performed Card */}
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4">
                      <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-medium uppercase text-xs tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        Tareas Realizadas
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {[...DEFAULT_TASKS, ...customTasks].map((task) => (
                          <label key={task} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-all ${selectedTasks.includes(task) ? "border-indigo-500/50 bg-indigo-500/10 text-zinc-900 dark:text-white" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"}`}>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={selectedTasks.includes(task)}
                              onChange={() => toggleTask(task)}
                            />
                            <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${selectedTasks.includes(task) ? "bg-indigo-500 border-indigo-500" : "border-zinc-300 dark:border-zinc-700"}`}>
                              {selectedTasks.includes(task) && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                            </div>
                            <span className="text-xs font-bold">{task}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <input 
                          type="text" 
                          value={customTaskInput}
                          onChange={(e) => setCustomTaskInput(e.target.value)}
                          placeholder="Otra tarea..."
                          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={addCustomTask}
                          className="rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-colors"
                        >
                          AGREGAR
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Column */}
                  <div className="space-y-6">
                    {/* Financial Card */}
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4">
                      <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-medium uppercase text-xs tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        Financiero
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Costo Total</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                          <input 
                            type="number" 
                            name="cost"
                            step="0.01"
                            placeholder="0.00"
                            className="appearance-none w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-8 pr-4 py-3 text-right text-2xl font-bold text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                  {/* Documentation Card */}
                  <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-medium uppercase text-xs tracking-widest">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      Documentación
                    </div>
                    <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-white dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                      <input 
                        type="file" 
                        name="image" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImageName(file.name);
                          }
                        }}
                      />
                      <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {selectedImageName || "SUBIR COMPROBANTE"}
                      </p>
                    </label>
                  </div>

                  {/* Notes Card */}
                  <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-medium uppercase text-xs tracking-widest">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
                      Notas
                    </div>
                    <textarea 
                      name="notes"
                      placeholder="Detalles adicionales..."
                      className="w-full h-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-xs text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  </div>
                </div>

                {state?.error && (
                  <p className="mt-4 text-xs text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">{state.error}</p>
                )}
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 md:p-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="order-2 sm:order-1 rounded-2xl px-8 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="service-form"
                  disabled={isPending}
                  className="order-1 sm:order-2 rounded-2xl bg-indigo-500 px-12 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {isPending ? "Guardando..." : "Guardar Registro"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
