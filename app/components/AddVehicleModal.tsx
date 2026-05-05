"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { addVehicle } from "../actions/addVehicle";

interface AddVehicleModalProps {
  catalogCars: {
    id: string;
    year: number;
    model: {
      name: string;
      brand: { name: string };
    };
  }[];
}

export default function AddVehicleModal({ catalogCars }: AddVehicleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    addVehicle,
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
        className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400"
      >
        + Agregar Vehículo
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Agregar Nuevo Vehículo</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Marca</label>
                  <input 
                    type="text" 
                    name="brand" 
                    required
                    placeholder="Ej: Nissan"
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Modelo</label>
                  <input 
                    type="text" 
                    name="model" 
                    required
                    placeholder="Ej: Versa"
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Año</label>
                <input 
                  type="number" 
                  name="year" 
                  required
                  placeholder="Ej: 2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kilometraje Actual (km)</label>
                <input 
                  type="number" 
                  name="currentKm" 
                  required
                  placeholder="Ej: 50000"
                  min="0"
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Último Servicio Realizado (Kilometraje)</label>
                <input 
                  type="number" 
                  name="lastServiceKm" 
                  placeholder="Ej: 40000 (Opcional)"
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="mt-1 text-xs text-zinc-500">Usaremos esto para marcar qué tareas del manual ya deberías tener listas.</p>
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
                  {isPending ? "Agregando..." : "Agregar Vehículo"}
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
