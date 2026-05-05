"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { deleteService } from "../actions/deleteService";
import { editService } from "../actions/editService";

export default function Services({ history = [] }: { history?: any[] }) {
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(history.length / itemsPerPage);
  
  // Calcular métricas
  const currentYear = new Date().getFullYear();
  
  const thisYearServices = history.filter(item => {
    const d = new Date(item.date);
    return d.getFullYear() === currentYear;
  });

  const totalSpendThisYear = thisYearServices.reduce((sum, item) => sum + (item.cost || 0), 0);

  // Obtener items de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  // Análisis de Gastos por Categoría
  const categories = [
    { name: "Motor", keywords: ["aceite", "filtro", "bujía", "bujia", "anticongelante", "motor"], color: "bg-indigo-500" },
    { name: "Frenos", keywords: ["freno", "balata", "disco", "liquido de frenos"], color: "bg-rose-500" },
    { name: "Llantas", keywords: ["llanta", "neumatico", "rotacion", "alineacion", "balanceo"], color: "bg-emerald-500" },
    { name: "Otros", keywords: [], color: "bg-zinc-500" },
  ];

  const expenseBreakdown = categories.map(cat => {
    const total = history
      .filter(item => {
        const name = (item.customName || "").toLowerCase();
        return cat.keywords.some(k => name.includes(k)) || (cat.name === "Otros" && !categories.slice(0, 3).some(c => c.keywords.some(k => name.includes(k))));
      })
      .reduce((sum, item) => sum + (item.cost || 0), 0);
    return { ...cat, total };
  }).filter(c => c.total > 0);

  const maxExpense = Math.max(...expenseBreakdown.map(c => c.total), 1);

  return (
    <div className="view-shell text-zinc-900 dark:text-zinc-100 space-y-8 p-8 transition-colors">
      {/* Header with Title and Global Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Servicios</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Revisa mantenimientos pasados y reparaciones de tu flota.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filtrar
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Analytics & Metrics Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Metric Cards Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-6 flex flex-col justify-between h-32 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Servicios Totales</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{history.length}</p>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-6 flex flex-col justify-between h-32 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Inversión {currentYear}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">${totalSpendThisYear.toLocaleString()}</p>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="lg:col-span-2 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-8 backdrop-blur-md transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Análisis por Categoría</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Distribución de gastos</span>
          </div>
          <div className="space-y-4">
            {expenseBreakdown.length > 0 ? expenseBreakdown.map(cat => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{cat.name}</span>
                  <span className="text-zinc-900 dark:text-white font-bold">${cat.total.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} transition-all duration-1000`} 
                    style={{ width: `${(cat.total / maxExpense) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="flex h-24 items-center justify-center text-zinc-400 dark:text-zinc-600 italic text-sm">
                Agrega servicios con costos para ver el análisis.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service List */}
      <div className="space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.id} className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-6 hover:bg-white/80 dark:hover:bg-zinc-900/50 transition-all group">
              <div className="grid gap-6 md:grid-cols-5 items-center">
                {/* Date & Vehicle */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">FECHA</p>
                  <p className="font-bold text-zinc-900 dark:text-white">
                    {new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-zinc-500">Auto #{item.userCarId.slice(-4)}</p>
                </div>

                {/* Service Type */}
                <div className="space-y-1 md:col-span-1">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">TIPO DE SERVICIO</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">{item.customName || "Mantenimiento General"}</p>
                  </div>
                </div>

                {/* Mileage */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">KILOMETRAJE</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{item.kmAtService.toLocaleString()} km</p>
                </div>

                {/* Cost & Status */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">COSTO / ESTADO</p>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-zinc-900 dark:text-white">${item.cost?.toLocaleString() || "0.00"}</p>
                    <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-400">
                      Completado
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                  </div>
                  <button 
                    onClick={() => setSelectedService(item)}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-6 py-2 text-sm font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-12 text-center">
            <p className="text-zinc-500">No hay servicios registrados en el historial.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            currentPage === 1 ? "text-zinc-700 cursor-not-allowed" : "text-zinc-500 hover:text-white"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Anterior
        </button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === page
                      ? "bg-indigo-500 text-white"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 2 || 
              page === currentPage + 2
            ) {
              return <span key={page} className="text-zinc-700">...</span>;
            }
            return null;
          })}
        </div>

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            currentPage === totalPages || totalPages === 0 ? "text-zinc-700 cursor-not-allowed" : "text-zinc-500 hover:text-white"
          }`}
        >
          Siguiente
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6-6"/></svg>
        </button>
      </div>

      {/* Detail Modal */}
      {selectedService && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                setSelectedService(null);
                setIsEditing(false);
              }}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="space-y-8">
              {!isEditing ? (
                <>
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Detalles del Servicio</h2>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">{selectedService.customName || "Mantenimiento General"}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">FECHA</p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {new Date(selectedService.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">KILOMETRAJE</p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{selectedService.kmAtService.toLocaleString()} km</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">INVERSIÓN</p>
                      <p className="text-sm font-bold text-indigo-400">${selectedService.cost?.toLocaleString() || "0.00"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">NOTAS ADICIONALES</p>
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
                        {selectedService.notes || "No se agregaron notas para este servicio."}
                      </p>
                    </div>
                  </div>

                  {selectedService.imageUrl && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DOCUMENTACIÓN VISUAL</p>
                      <div className="relative aspect-video w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden group">
                        <img 
                          src={selectedService.imageUrl} 
                          alt="Comprobante de servicio" 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Evidencia Adjunta</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 py-3 text-sm font-bold text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700"
                    >
                      Editar
                    </button>
                    <button 
                      disabled={isPending}
                      onClick={() => {
                        if (confirm("¿Seguro que deseas eliminar este servicio? Esto recalculará tus gastos totales.")) {
                          startTransition(async () => {
                            const res = await deleteService(selectedService.id);
                            if (res.success) {
                              setSelectedService(null);
                            } else {
                              alert(res.error);
                            }
                          });
                        }
                      }}
                      className="flex-1 rounded-2xl bg-rose-500/10 border border-rose-500/20 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isPending ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </>
              ) : (
                <form 
                  action={(formData) => {
                    formData.append("serviceId", selectedService.id);
                    startTransition(async () => {
                      const res = await editService(null, formData);
                      if (res.success) {
                        setIsEditing(false);
                        setSelectedService(null);
                      } else {
                        alert(res.error);
                      }
                    });
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Editar Servicio</h2>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">Modifica los detalles del registro</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nombre del Servicio</label>
                      <input 
                        name="customName" 
                        defaultValue={selectedService.customName}
                        required 
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kilometraje</label>
                      <input 
                        name="kmAtService" 
                        type="number" 
                        defaultValue={selectedService.kmAtService}
                        required 
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Costo Total ($)</label>
                      <input 
                        name="cost" 
                        type="number" 
                        step="0.01"
                        defaultValue={selectedService.cost}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Fecha</label>
                      <input 
                        name="date" 
                        type="date" 
                        defaultValue={new Date(selectedService.date).toISOString().split('T')[0]}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Notas (Opcional)</label>
                    <textarea 
                      name="notes" 
                      defaultValue={selectedService.notes || ""}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all min-h-[100px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 py-3 text-sm font-bold text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={isPending}
                      className="flex-1 rounded-2xl bg-indigo-500 py-3 text-sm font-bold text-white hover:bg-indigo-400 transition-all disabled:opacity-50"
                    >
                      {isPending ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
