"use client";

import { useState, useActionState, useEffect } from "react";
import { addDocument } from "../actions/addDocument";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface CarDocument {
  id: string;
  type: string;
  name: string;
  imageUrl?: string | null;
  displayUrls?: string[]; // URLs firmadas desde el servidor
  expiryDate?: Date | null;
}

export default function DocumentManager({ 
  documents, 
  activeCarId, 
  userPlan 
}: { 
  documents: CarDocument[], 
  activeCarId: string,
  userPlan: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addDocument, undefined);
  const [previews, setPreviews] = useState<string[]>([]);
  const isPro = userPlan === "PRO";
  const [showLightbox, setShowLightbox] = useState<{ images: string[], index: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      setPreviews([]);
    }
  }, [state]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir a JPEG con calidad 0.6 (60%)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (!isPro && files.length > 0) {
      toast.info("El plan Estándar solo permite 1 foto por documento. ¡Pásate a PRO para subir fotos ilimitadas!");
      e.target.value = "";
      return;
    }

    if (files.length > 0) {
      const compressedPreviews: string[] = [];
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { // Ignorar archivos > 10MB antes de comprimir
          toast.error(`El archivo ${file.name} es demasiado grande (>10MB).`);
          continue;
        }
        const compressed = await compressImage(file);
        compressedPreviews.push(compressed);
      }
      setPreviews(prev => [...prev, ...compressedPreviews]);
    }
  };

  const parseImages = (imageUrl?: string | null): string[] => {
    if (!imageUrl) return [];
    if (imageUrl.startsWith('[')) {
      try {
        return JSON.parse(imageUrl);
      } catch (e) {
        return [];
      }
    }
    return [imageUrl]; // Backward compatibility
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
    <div className="space-y-8 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">Documentos</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gestiona papeles, seguros y facturas de tu vehículo.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto rounded-2xl bg-indigo-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo Documento
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents.map((doc) => {
          const status = getStatus(doc.expiryDate);
          const images = doc.displayUrls && doc.displayUrls.length > 0 
            ? doc.displayUrls 
            : parseImages(doc.imageUrl);
          return (
            <div key={doc.id} className="group relative rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-5 hover:border-indigo-500/50 transition-all overflow-hidden backdrop-blur-sm">
              <div 
                onClick={() => images.length > 0 && setShowLightbox({ images, index: 0 })}
                className="aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-4 overflow-hidden flex items-center justify-center relative cursor-pointer group/img"
              >
                {images.length > 0 ? (
                  <>
                    <img src={images[0]} alt={doc.name} className="h-full w-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                    {images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white border border-white/10">
                        +{images.length - 1} FOTOS
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <svg className="text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    </div>
                  </>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{doc.type}</span>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white truncate text-lg tracking-tight">{doc.name}</h3>
                {doc.expiryDate && (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span className="text-xs font-medium">Expira el {new Date(doc.expiryDate).toLocaleDateString('es-MX')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-label="Nuevo documento">
          <div className="w-full max-w-lg rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Nuevo Documento</h3>
                <p className="text-xs text-zinc-500 font-medium">Sube fotos legibles de tus papeles.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="userCarId" value={activeCarId} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tipo</label>
                  <select name="type" className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                    <option>Seguro</option>
                    <option>Tarjeta de Circulación</option>
                    <option>Factura</option>
                    <option>Otros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vencimiento</label>
                  <input type="date" name="expiryDate" className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nombre del Documento</label>
                <input name="name" required placeholder="Ej: Póliza AXA 2024" className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400" />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Imágenes / Fotos</label>
                <div className="flex flex-wrap gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="h-20 w-20 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden relative group">
                      <img src={src} className="h-full w-full object-cover" />
                      <input type="hidden" name="image" value={src} />
                      <button 
                        type="button" 
                        onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-black/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                      >
                        QUITAR
                      </button>
                    </div>
                  ))}
                  {isPro && (
                    <label className="h-20 w-20 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <svg className="text-zinc-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                      <span className="text-[8px] font-black text-zinc-400">SUBIR</span>
                      <input type="file" accept="image/*" multiple={isPro} onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {state?.error && <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{state.error}</p>}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 rounded-2xl px-4 py-3.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">Cancelar</button>
                <button type="submit" disabled={isPending} className="flex-1 rounded-2xl bg-indigo-500 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 active:scale-95 transition-all">
                  {isPending ? "Guardando..." : "Guardar Documento"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox */}
      {mounted && showLightbox && createPortal(
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-12 animate-in fade-in duration-300">
          <button 
            className="absolute right-8 top-8 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-50"
            onClick={() => setShowLightbox(null)}
            aria-label="Cerrar vista previa"
          >
            ✕
          </button>
          
          {showLightbox.images.length > 1 && (
            <>
              <button 
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-14 w-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-14 w-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
              </button>
            </>
          )}

          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
            <img 
              src={showLightbox.images[showLightbox.index]} 
              className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500" 
            />
            {showLightbox.images.length > 1 && (
              <div className="flex gap-2">
                {showLightbox.images.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setShowLightbox(prev => prev ? { ...prev, index: i } : null)}
                    className={`h-2 rounded-full transition-all ${showLightbox.index === i ? "w-8 bg-indigo-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            )}
            <p className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px]">Documento {showLightbox.index + 1} de {showLightbox.images.length}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
