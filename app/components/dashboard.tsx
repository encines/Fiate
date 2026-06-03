"use client";

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import AddVehicleModal from "./AddVehicleModal";

export default function Dashboard({
  activeCar,
}: {
  activeCar?: Record<string, any> | null;
}) {
  const serviceHistory = (activeCar?.history || [])
    .filter((s: any) => s.customName)
    .slice(0, 5);

  const calculateHealth = () => {
    if (!activeCar || !activeCar.tasks || activeCar.tasks.length === 0)
      return 100;
    const tasks = activeCar.tasks;
    const checks = activeCar.maintenanceChecks || [];
    const currentKm = activeCar.currentKm || 0;
    let totalExpectedChecks = 0;
    tasks.forEach((t: any) => {
      if (t.frequencyKm && t.frequencyKm > 0) {
        totalExpectedChecks += Math.floor(currentKm / t.frequencyKm);
      }
    });
    if (totalExpectedChecks === 0) return 100;
    return Math.max(
      0,
      Math.min(100, Math.round((checks.length / totalExpectedChecks) * 100)),
    );
  };

  const healthScore = useMemo(() => calculateHealth(), [activeCar]);
  const totalSpent = useMemo(
    () =>
      (activeCar?.history || [])
        .filter((s: any) => s.customName)
        .reduce((acc: number, curr: any) => acc + (curr.cost || 0), 0) || 0,
    [activeCar?.history],
  );

  const carName = activeCar?.brand
    ? `${activeCar.brand} ${activeCar.model}`
    : activeCar?.catalogCar?.model
      ? `${activeCar.catalogCar.model.brand.name} ${activeCar.catalogCar.model.name}`
      : "Selecciona un vehículo";

  const carYear = activeCar?.year || activeCar?.catalogCar?.year;

  const stats = [
    {
      label: "Salud del Auto",
      value: `${healthScore}%`,
      meta:
        healthScore > 90
          ? "Excelente"
          : healthScore > 70
            ? "Regular"
            : "Crítico",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
      color:
        healthScore > 90
          ? "text-emerald-500"
          : healthScore > 70
            ? "text-amber-500"
            : "text-rose-500",
      bg:
        healthScore > 90
          ? "bg-emerald-500/10"
          : healthScore > 70
            ? "bg-amber-500/10"
            : "bg-rose-500/10",
    },
    {
      label: "Inversión Total",
      value: `$${totalSpent.toLocaleString()}`,
      meta: "en mantenimientos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20" />
          <path d="m17 5-5-3-5 3" />
          <path d="m17 19-5 3-5-3" />
          <path d="M2 7h5c2.2 0 4 1.8 4 4s-1.8 4-4 4H2" />
          <path d="M22 17h-5c-2.2 0-4-1.8-4-4s1.8-4 4-4h5" />
        </svg>
      ),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Kilometraje",
      value: activeCar
        ? `${(activeCar.currentKm || 0).toLocaleString()} km`
        : "0 km",
      meta: "recorridos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      ),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Próximo Servicio",
      value: activeCar?.tasks?.[0]
        ? `${activeCar.tasks[0].frequencyKm?.toLocaleString()} km`
        : "N/A",
      meta: "estimado",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="text-zinc-900 dark:text-zinc-100 p-6 sm:p-8 transition-colors">
      <section className="space-y-8 max-w-7xl mx-auto">
        {/* Main Hero Card */}
        <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-6 sm:p-8 overflow-hidden relative group transition-colors">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-zinc-500/5 blur-[100px] group-hover:bg-zinc-500/10 transition-colors duration-700"></div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div className="max-w-2xl space-y-6 w-full">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  Vehículo activo
                </p>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight sm:text-4xl lg:text-5xl">
                  {carName}
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
                  {carYear ? `${carYear} · ` : ""}{" "}
                  {activeCar?.catalogCar?.trim || ""}{" "}
                  {activeCar?.licensePlate
                    ? ` · ${activeCar.licensePlate}`
                    : "Sin placas"}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <AddVehicleModal catalogCars={[]} />
                <Link
                  href="/services"
                  className="rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 font-bold text-sm hover:scale-105 transition-transform"
                >
                  Ver Historial
                </Link>
              </div>
            </div>

            <div className="relative aspect-video w-full lg:max-w-md">
              <div className="absolute inset-0 bg-zinc-500/5 rounded-[40px] blur-2xl"></div>
              <div className="relative h-full w-full rounded-[32px] bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex items-center justify-center">
                <Image
                  src={activeCar?.imageUrl || "/march.png"}
                  alt="Vehículo"
                  width={400}
                  height={250}
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-48 sm:max-h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/20 p-6 hover:bg-white/80 dark:hover:bg-zinc-900/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {stat.meta}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Premium Analytics Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Health Gauge Card */}
          <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-8 flex items-center gap-8 group">
            <div className="relative h-32 w-32 flex-shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${healthScore > 90 ? "stroke-emerald-500" : healthScore > 70 ? "stroke-amber-500" : "stroke-rose-500"} transition-all duration-1000 ease-out`}
                  strokeWidth="3"
                  strokeDasharray={`${healthScore}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">
                  {healthScore}%
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  Salud
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Estado Mecánico
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {healthScore > 90
                  ? "Tu vehículo está en condiciones óptimas. Sigue así para mantener su valor."
                  : healthScore > 70
                    ? "Tienes algunos servicios pendientes. Programarlos pronto evitará averías costosas."
                    : "¡Atención! Tu vehículo requiere mantenimiento urgente para garantizar su seguridad."}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-8 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20" />
                <path d="m17 5-5-3-5 3" />
                <path d="m17 19-5 3-5-3" />
                <path d="M2 7h5c2.2 0 4 1.8 4 4s-1.8 4-4 4H2" />
                <path d="M22 17h-5c-2.2 0-4-1.8-4-4s1.8-4 4-4h5" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Confianza de Mercado
              </p>
              <h3 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                Valor de Reventa
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">
                  +{healthScore > 80 ? "15" : healthScore > 50 ? "8" : "3"}%
                </span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  sobre el valor base
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Basado en tu historial y mantenimientos registrados en Fiate.
              </p>
            </div>
          </div>
        </div>

        {/* Recent History Grid */}
        <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-6 sm:p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Servicios Recientes
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Últimos mantenimientos registrados.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-orange-500 hover:text-orange-600"
            >
              Ver todos
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Servicio
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">
                    Costo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {serviceHistory.length > 0 ? (
                  serviceHistory.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                    >
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        {new Date(item.date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200">
                        {item.customName || "Mantenimiento"}
                      </td>
                      <td className="px-6 py-4 text-zinc-900 dark:text-white text-right font-bold">
                        ${item.cost?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-zinc-500"
                    >
                      No hay servicios recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
