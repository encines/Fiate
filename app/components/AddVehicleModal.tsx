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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

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

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Foto del Vehículo (Opcional)</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    )}
                  </div>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 dark:file:bg-indigo-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/20"
                  />
                </div>
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
