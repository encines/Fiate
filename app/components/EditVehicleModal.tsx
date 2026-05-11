"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { editVehicle } from "../actions/editVehicle";
import { deleteVehicle } from "../actions/deleteVehicle";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";

interface EditVehicleModalProps {
  userCar: any;
}

export default function EditVehicleModal({ userCar }: EditVehicleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    editVehicle,
    undefined,
  );
  const [confirmOpen, setConfirmOpen] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);

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

  // Cerrar el modal si la respuesta fue exitosa
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      toast.success("Perfil del vehículo actualizado correctamente.");
    }
    if (state?.error) {
      toast.error(state.error);
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
        Editar perfil del vehículo
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Editar vehículo">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-2xl p-6 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Editar Vehículo</h3>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="userCarId" value={userCar.id} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Marca</label>
                  <input 
                    type="text" 
                    name="brand" 
                    defaultValue={userCar.catalogCar?.model?.brand?.name || userCar.brand || ""}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Modelo</label>
                  <input 
                    type="text" 
                    name="model" 
                    defaultValue={userCar.catalogCar?.model?.name || userCar.model || ""}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Año</label>
                  <input 
                    type="number" 
                    name="year" 
                    defaultValue={userCar.catalogCar?.year || userCar.year || ""}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Color</label>
                  <input 
                    type="text" 
                    name="color" 
                    defaultValue={userCar.color || ""}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Placas</label>
                <input 
                  type="text" 
                  name="licensePlate" 
                  defaultValue={userCar.licensePlate || ""}
                  className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Foto del Vehículo</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : userCar.imageUrl ? (
                      <img src={userCar.imageUrl} alt="Current" className="h-full w-full object-cover" />
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

              <div className="mt-6 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmOpen({
                      title: "Eliminar Vehículo",
                      message: "¿Estás seguro de que deseas eliminar este vehículo y todo su historial? Esta acción no se puede deshacer.",
                      onConfirm: async () => {
                        const res = await deleteVehicle(userCar.id);
                        if (res.success) {
                           setIsOpen(false);
                           toast.success("Vehículo eliminado.");
                        } else {
                           toast.error(res.error || "Error al eliminar");
                        }
                      }
                    });
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10"
                >
                  Eliminar Vehículo
                </button>
                <div className="flex gap-3">
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
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      {confirmOpen && (
        <ConfirmModal 
          isOpen={!!confirmOpen}
          title={confirmOpen.title}
          message={confirmOpen.message}
          onConfirm={() => {
            confirmOpen.onConfirm();
            setConfirmOpen(null);
          }}
          onCancel={() => setConfirmOpen(null)}
        />
      )}
    </>
  );
}
