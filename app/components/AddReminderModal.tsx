"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { addReminder } from "../actions/addReminder";

interface AddReminderModalProps {
  userCarId: string;
}

export default function AddReminderModal({ userCarId }: AddReminderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    addReminder,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 transition-all"
      >
        + Nuevo Recordatorio
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-8 transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Nuevo Recordatorio</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                ✕
              </button>
            </div>
 
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="userCarId" value={userCarId} />
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Título / Trámite</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder="Ej: Verificación vehicular, Pago de tenencia..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-400"
                />
              </div>
 
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Fecha de vencimiento</label>
                <input 
                  type="date" 
                  name="date" 
                  required
                  className="appearance-none w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
 
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Notas / Detalles</label>
                <textarea 
                  name="detail" 
                  rows={3}
                  placeholder="Ej: Agenda cita con anticipación..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition-all placeholder:text-zinc-400"
                ></textarea>
              </div>
 
              {state?.error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-xs font-medium text-red-500">{state.error}</p>
                </div>
              )}
 
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-indigo-500 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {isPending ? "Creando..." : "Crear Recordatorio"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
