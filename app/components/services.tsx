"use client";

import { useState, useTransition, useMemo } from "react";
import { createPortal } from "react-dom";
import { deleteService } from "../actions/deleteService";
import { editService } from "../actions/editService";
import { useEffect } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const AddServiceModal = dynamic(() => import("./AddServiceModal"), {
  ssr: false,
});
const ConfirmModal = dynamic(() => import("./ConfirmModal"), { ssr: false });

const CATEGORIES = [
  {
    name: "Motor",
    keywords: ["aceite", "filtro", "bujía", "bujia", "anticongelante", "motor"],
    color: "bg-indigo-500",
  },
  {
    name: "Frenos",
    keywords: ["freno", "balata", "disco", "liquido de frenos"],
    color: "bg-rose-500",
  },
  {
    name: "Llantas",
    keywords: ["llanta", "neumatico", "rotacion", "alineacion", "balanceo"],
    color: "bg-emerald-500",
  },
  { name: "Otros", keywords: [], color: "bg-zinc-500" },
];

interface Service {
  id: string;
  date: string | Date;
  cost: number | null;
  kmAtService: number;
  customName: string | null;
  notes: string | null;
  imageUrl: string | null;
}

const getImageUrl = (path: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services/${path}`;
};

export default function Services({
  car,
  cars = [],
  activeCarId = null,
  userPlan,
  initialFilter = "Todos",
  initialPage = 1,
}: {
  car: any;
  cars?: any[];
  activeCarId?: string | null;
  userPlan: string;
  initialFilter?: string;
  initialPage?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPro = userPlan === "PRO";
  const history: Service[] = (car?.history || []).filter(
    (s: any) => s.customName,
  );

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showLightbox, setShowLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const activeFilter = searchParams.get("filter") || initialFilter;
  const currentPage = Number(searchParams.get("page")) || initialPage;

  const updateUrl = (params: { page?: number; filter?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (params.page !== undefined)
      newParams.set("page", params.page.toString());
    if (params.filter !== undefined) newParams.set("filter", params.filter);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // SCROLL LOCK: Bloquear scroll del fondo cuando el modal de detalles está abierto
  useEffect(() => {
    if (selectedService) {
      document.body.classList.add("lock-scroll");
      document.documentElement.classList.add("lock-scroll");
    } else {
      document.body.classList.remove("lock-scroll");
      document.documentElement.classList.remove("lock-scroll");
    }
    return () => {
      document.body.classList.remove("lock-scroll");
      document.documentElement.classList.remove("lock-scroll");
    };
  }, [selectedService]);

  const itemsPerPage = 5;

  // Calcular métricas
  const currentYear = new Date().getFullYear();

  const thisYearServices = useMemo(
    () =>
      history.filter((item: Service) => {
        const d = new Date(item.date);
        return d.getFullYear() === currentYear;
      }),
    [history, currentYear],
  );

  const totalSpendThisYear = thisYearServices.reduce(
    (sum: number, item: Service) => sum + (item.cost || 0),
    0,
  );

  const filteredHistory = history.filter((item: Service) => {
    if (activeFilter === "Todos") return true;
    const name = (item.customName || "").toLowerCase();
    if (activeFilter === "Otros") {
      return !CATEGORIES.slice(0, 3).some((c) =>
        c.keywords.some((k) => name.includes(k)),
      );
    }
    const cat = CATEGORIES.find((c) => c.name === activeFilter);
    if (!cat) return true;
    return cat.keywords.some((k) => name.includes(k));
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // Obtener items de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const expenseBreakdown = useMemo(
    () =>
      CATEGORIES.map((cat) => {
        const total = history
          .filter((item: Service) => {
            const name = (item.customName || "").toLowerCase();
            return (
              cat.keywords.some((k) => name.includes(k)) ||
              (cat.name === "Otros" &&
                !CATEGORIES.slice(0, 3).some((c) =>
                  c.keywords.some((k) => name.includes(k)),
                ))
            );
          })
          .reduce((sum, item) => sum + (item.cost || 0), 0);
        return { ...cat, total };
      }).filter((c) => c.total > 0),
    [history],
  );

  const maxExpense = Math.max(...expenseBreakdown.map((c) => c.total), 1);

  const handlePrintReport = () => {
    document.body.classList.add("printing-report");
    window.print();
    // Un pequeño delay para asegurar que el diálogo de impresión capturó el estado
    setTimeout(() => {
      document.body.classList.remove("printing-report");
    }, 500);
  };

  return (
    <div className="view-shell text-zinc-900 dark:text-zinc-100 space-y-8 p-8 transition-colors">
      <div className="no-print space-y-8">
        {/* Header with Title and Global Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Historial de Servicios
            </h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              Revisa mantenimientos pasados y reparaciones de tu auto.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {activeFilter === "Todos" ? "Filtrar" : activeFilter}
              </button>
              {showFilterMenu && (
                <div className="absolute left-0 sm:right-0 top-full mt-2 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl z-50">
                  {["Todos", ...CATEGORIES.map((c) => c.name)].map(
                    (filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => {
                          updateUrl({ filter: filterOption, page: 1 });
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeFilter === filterOption ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
                      >
                        {filterOption}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 sm:flex-initial">
              <AddServiceModal
                cars={cars}
                activeCarId={activeCarId}
                buttonClass="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              />
            </div>

            <button
              onClick={() => {
                if (!isPro) {
                  toast.info(
                    "La generación de reportes PDF certificados es una función exclusiva de Fiate PRO. ¡Mejora tu plan para exportar tu historial!",
                  );
                  return;
                }
                handlePrintReport();
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isPro
                  ? "border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {isPro ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              <span className="whitespace-nowrap">
                {isPro ? "Reporte" : "Reporte PRO"}
              </span>
            </button>
          </div>
        </div>

        {/* Analytics & Metrics Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Metric Cards Column */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-5 sm:p-6 flex flex-col justify-between min-h-[110px] sm:h-32 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Servicios Totales
                </span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                {history.length}
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-5 sm:p-6 flex flex-col justify-between min-h-[110px] sm:h-32 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Inversión {currentYear}
                </span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                ${mounted ? totalSpendThisYear.toLocaleString() : "0"}
              </p>
            </div>
          </div>

          {/* Category Breakdown Card */}
          <div className="lg:col-span-2 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-md transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Análisis por Categoría
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Distribución de gastos
              </span>
            </div>
            <div className="space-y-4">
              {expenseBreakdown.length > 0 ? (
                expenseBreakdown.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                        {cat.name}
                      </span>
                      <span className="text-zinc-900 dark:text-white font-bold">
                        ${mounted ? cat.total.toLocaleString() : "0"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
                      <div
                        className={`h-full ${cat.color} transition-all duration-1000`}
                        style={{ width: `${(cat.total / maxExpense) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
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
              <div
                key={item.id}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-6 hover:bg-white/80 dark:hover:bg-zinc-900/50 transition-all group"
              >
                <div className="grid gap-6 md:grid-cols-5 items-center">
                  {/* Date & Vehicle */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                      FECHA
                    </p>
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {new Date(item.date).toLocaleDateString("es-MX", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-1 md:col-span-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                      TIPO DE SERVICIO
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                        {item.customName || "Mantenimiento General"}
                      </p>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                      KILOMETRAJE
                    </p>
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {mounted
                        ? item.kmAtService.toLocaleString()
                        : item.kmAtService}{" "}
                      km
                    </p>
                  </div>

                  {/* Cost & Status */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                      COSTO / ESTADO
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        ${mounted ? item.cost?.toLocaleString() : "0"}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-400">
                        Completado
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center gap-4">
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
              <p className="text-zinc-500">
                No hay servicios registrados en el historial.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => updateUrl({ page: Math.max(currentPage - 1, 1) })}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              currentPage === 1
                ? "text-zinc-700 cursor-not-allowed"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
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
                    onClick={() => updateUrl({ page })}
                    className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-indigo-500 text-white"
                        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="text-zinc-700">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() =>
              updateUrl({ page: Math.min(currentPage + 1, totalPages) })
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "text-zinc-700 cursor-not-allowed"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Siguiente
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6 6-6" />
            </svg>
          </button>
        </div>

        {mounted &&
          selectedService &&
          createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Detalles del servicio"
            >
              <div
                data-lenis-prevent
                className="relative w-full max-w-2xl rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
              >
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setIsEditing(false);
                  }}
                  aria-label="Cerrar"
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>

                <div className="space-y-8">
                  {!isEditing ? (
                    <>
                      <div>
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                          Detalles del Servicio
                        </h2>
                        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                          {selectedService.customName ||
                            "Mantenimiento General"}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            FECHA
                          </p>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {new Date(selectedService.date).toLocaleDateString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            KILOMETRAJE
                          </p>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedService.kmAtService.toLocaleString()} km
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            INVERSIÓN
                          </p>
                          <p className="text-sm font-bold text-indigo-400">
                            ${selectedService.cost?.toLocaleString() || "0.00"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          NOTAS ADICIONALES
                        </p>
                        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4">
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
                            {selectedService.notes ||
                              "No se agregaron notas para este servicio."}
                          </p>
                        </div>
                      </div>

                      {selectedService.imageUrl && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            DOCUMENTACIÓN VISUAL
                          </p>
                          <div className="relative aspect-video w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden group">
                            <img
                              src={getImageUrl(selectedService.imageUrl)}
                              alt="Comprobante de servicio"
                              onClick={() =>
                                setShowLightbox(
                                  getImageUrl(selectedService.imageUrl),
                                )
                              }
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                                Evidencia Adjunta
                              </p>
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
                            setConfirmOpen({
                              title: "Eliminar Servicio",
                              message:
                                "¿Seguro que deseas eliminar este servicio? Esto recalculará tus gastos totales.",
                              onConfirm: () => {
                                startTransition(async () => {
                                  const res = await deleteService(
                                    selectedService.id,
                                  );
                                  if (res.success) {
                                    setSelectedService(null);
                                    toast.success(
                                      "Servicio eliminado correctamente.",
                                    );
                                  } else {
                                    toast.error(
                                      res.error || "Error al eliminar",
                                    );
                                  }
                                });
                              },
                            });
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
                            toast.success(
                              "Servicio actualizado correctamente.",
                            );
                          } else {
                            toast.error(res.error || "Error al actualizar");
                          }
                        });
                      }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                          Editar Servicio
                        </h2>
                        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                          Modifica los detalles del registro
                        </p>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Nombre del Servicio
                          </label>
                          <input
                            name="customName"
                            defaultValue={selectedService.customName ?? ""}
                            required
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Kilometraje
                          </label>
                          <input
                            name="kmAtService"
                            type="number"
                            defaultValue={selectedService.kmAtService}
                            required
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Costo Total ($)
                          </label>
                          <input
                            name="cost"
                            type="number"
                            step="0.01"
                            defaultValue={selectedService.cost ?? ""}
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Fecha
                          </label>
                          <input
                            name="date"
                            type="date"
                            defaultValue={
                              new Date(selectedService.date)
                                .toISOString()
                                .split("T")[0]
                            }
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Notas (Opcional)
                        </label>
                        <textarea
                          name="notes"
                          maxLength={500}
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
            document.body,
          )}
        {/* Lightbox Modal */}
        {mounted &&
          showLightbox &&
          createPortal(
            <div
              className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-12 animate-in fade-in duration-300"
              onClick={() => setShowLightbox(null)}
            >
              <button
                className="absolute right-8 top-8 text-white/50 hover:text-white transition-colors p-2"
                onClick={() => setShowLightbox(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
              <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                <img
                  src={showLightbox}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>,
            document.body,
          )}
      </div>

      {/* Reporte de Impresión (Solo visible al imprimir el reporte pro) */}
      <div className="hidden printable-area">
        <div className="flex items-center justify-between border-b-4 border-indigo-500 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/screen.png"
                alt="Fiate"
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-4xl font-black tracking-tighter text-indigo-600">
                FIATE
              </h1>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Reporte de Mantenimiento Certificado
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black uppercase">
              {car?.catalogCar?.model?.brand?.name}{" "}
              {car?.catalogCar?.model?.name}
            </p>
            <p className="text-zinc-500 font-bold tracking-widest">
              {car?.catalogCar?.year} · {car?.licensePlate} ·{" "}
              {car?.currentKm.toLocaleString()} KM
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Servicios Totales
            </p>
            <p className="text-2xl font-black text-zinc-900">
              {history.length}
            </p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Inversión Estimada
            </p>
            <p className="text-2xl font-black text-indigo-600">
              $
              {mounted
                ? history
                    .reduce(
                      (acc: number, curr: Service) => acc + (curr.cost || 0),
                      0,
                    )
                    .toLocaleString()
                : "0"}
            </p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Fecha de Emisión
            </p>
            <p className="text-2xl font-black text-zinc-900">
              {new Date().toLocaleDateString("es-MX")}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-l-4 border-indigo-500 pl-4">
          Historial Detallado
        </h3>
        <table className="w-full text-left text-sm mb-12">
          <thead>
            <tr className="border-b-2 border-zinc-900 bg-zinc-50">
              <th className="py-4 px-4 font-black uppercase tracking-widest text-[10px]">
                Fecha
              </th>
              <th className="py-4 px-4 font-black uppercase tracking-widest text-[10px]">
                Descripción del Servicio
              </th>
              <th className="py-4 px-4 font-black uppercase tracking-widest text-[10px] text-right">
                Kilometraje
              </th>
              <th className="py-4 px-4 font-black uppercase tracking-widest text-[10px] text-right">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {history.map((item: Service) => (
              <tr key={item.id} className="break-inside-avoid">
                <td className="py-4 px-4 font-medium text-zinc-600">
                  {new Date(item.date).toLocaleDateString("es-MX")}
                </td>
                <td className="py-4 px-4 font-bold text-zinc-900">
                  {item.customName || "Mantenimiento General"}
                </td>
                <td className="py-4 px-4 text-right font-black text-zinc-900">
                  {mounted
                    ? item.kmAtService.toLocaleString()
                    : item.kmAtService}{" "}
                  KM
                </td>
                <td className="py-4 px-4 text-right text-zinc-500 italic max-w-xs leading-relaxed">
                  {item.notes || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-auto pt-12 border-t border-zinc-200 text-center">
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-[0.4em] mb-2">
            Este documento es una copia fiel de los registros digitales en Fiate
          </p>
          <div className="flex justify-center gap-8 text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
            <span>Seguridad</span>
            <span>·</span>
            <span>Transparencia</span>
            <span>·</span>
            <span>Confianza</span>
          </div>
        </div>
      </div>
      <ServicesConfirmWrapper
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
      />
    </div>
  );
}

// Separate component for the confirm modal to avoid nesting issues with createPortal
function ServicesConfirmWrapper({ confirmOpen, setConfirmOpen }: any) {
  if (!confirmOpen) return null;
  return (
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
  );
}
