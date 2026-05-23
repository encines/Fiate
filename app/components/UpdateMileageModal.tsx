"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateMileage } from "../actions/updateMileage";

interface UpdateMileageModalProps {
  userCarId: string;
  currentKm: number;
}

export default function UpdateMileageModal({
  userCarId,
  currentKm,
}: UpdateMileageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateMileage,
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
        className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline decoration-indigo-400/30 underline-offset-4 transition-colors"
      >
        Actualizar
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Actualizar kilometraje"
          >
            <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-2xl p-6 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Actualizar Kilometraje
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="userCarId" value={userCarId} />

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Nuevo Kilometraje (km)
                  </label>
                  <input
                    type="number"
                    name="newKm"
                    defaultValue={currentKm}
                    min={0}
                    required
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {state?.error && (
                  <p className="text-sm text-red-500">{state.error}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
                  >
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
