"use client";

import { useState, useActionState, useEffect } from "react";
import { changePassword } from "../actions/changePassword";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(changePassword, undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (state?.success) {
      toast.success("Contraseña actualizada correctamente.");
      setIsOpen(false);
    }
  }, [state]);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-[18px] bg-indigo-500 px-6 py-4 text-sm font-bold text-white hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
      >
        Cambiar contraseña
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Seguridad</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Actualizar contraseña</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Repite la nueva contraseña"
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-zinc-700"
                />
              </div>

              {state?.error && (
                <div className="text-[11px] text-rose-500 font-bold bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 animate-shake">
                  {state.error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-2xl px-6 py-4 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isPending ? "Procesando..." : "Actualizar"}
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
