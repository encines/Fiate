"use client";

import { useState, useActionState, useEffect } from "react";
import { addDocument } from "../actions/addDocument";
import { createPortal } from "react-dom";

interface CarDocument {
  id: string;
  type: string;
  name: string;
  imageUrl?: string | null;
  expiryDate?: Date | null;
}

export default function DocumentManager({ documents, activeCarId }: { documents: CarDocument[], activeCarId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addDocument, undefined);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      setPreview(null);
    }
  }, [state]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getStatus = (expiryDate?: Date | null) => {
    if (!expiryDate) return { label: "Vigente", color: "text-emerald-500 bg-emerald-500/10" };
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { label: "Vencido", color: "text-rose-500 bg-rose-500/10" };
    if (days < 30) return { label: `Vence en ${days}d`, color: "text-amber-500 bg-amber-500/10" };
    return { label: "Vigente", color: "text-emerald-500 bg-emerald-500/10" };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Documentos</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 transition-all active:scale-95"
        >
          + Subir Documento
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents.map((doc) => {
          const status = getStatus(doc.expiryDate);
          return (
            <div key={doc.id} className="group relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 hover:border-indigo-500/50 transition-all overflow-hidden">
              <div className="aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4 overflow-hidden flex items-center justify-center">
                {doc.imageUrl ? (
                  <img src={doc.imageUrl} alt={doc.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{doc.type}</span>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white truncate">{doc.name}</h3>
                {doc.expiryDate && (
                  <p className="text-xs text-zinc-500 font-medium">
                    Expira: {new Date(doc.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Nuevo Documento</h3>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="userCarId" value={activeCarId} />
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Tipo</label>
                <select name="type" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  <option>Seguro</option>
                  <option>Tarjeta de Circulación</option>
                  <option>Verificación</option>
                  <option>Factura</option>
                  <option>Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Nombre Descriptivo</label>
                <input name="name" required placeholder="Ej: Póliza AXA 2024" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Fecha de Vencimiento (Opcional)</label>
                <input type="date" name="expiryDate" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Imagen / Foto</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
                    {preview ? <img src={preview} className="h-full w-full object-cover" /> : <svg className="text-zinc-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
                  </div>
                  <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="text-xs text-zinc-500" />
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
