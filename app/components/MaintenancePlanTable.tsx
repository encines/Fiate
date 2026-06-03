"use client";

import { useState, useTransition } from "react";
import { markServiceDone } from "../actions/markServiceDone";
import { discoverMaintenancePlan } from "../actions/discoverMaintenancePlan";
import { updateTaskFrequency } from "../actions/updateTaskFrequency";
import { addTask } from "../actions/addTask";
import { deleteTask } from "../actions/deleteTask";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";

interface Task {
  id: string;
  name: string;
  frequencyKm: number | null;
}

interface History {
  id: string;
  taskId: string | null;
  kmAtService?: number;
  kmMilestone?: number;
}

interface MaintenancePlanTableProps {
  tasks: Task[];
  history: History[];
  currentKm: number;
  userCarId: string;
  userPlan: string;
}

export default function MaintenancePlanTable({
  tasks,
  history,
  currentKm,
  userCarId,
  userPlan,
}: MaintenancePlanTableProps) {
  const isPro = userPlan === "PRO";
  const [isPending, startTransition] = useTransition();
  const [editingTask, setEditingTask] = useState<{
    id: string;
    name: string;
    frequency: number;
  } | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const canAddTask = isPro || tasks.length < 6;

  // Columnas: 10,000 a 100,000 en incrementos de 10,000 (O dinámico según máximo de tareas)
  // Para ser prácticos como el manual, mostraremos de 10k a 120k
  const columns = Array.from({ length: 12 }, (_, i) => (i + 1) * 10000);

  const handleCellClick = (taskId: string, kmMilestone: number) => {
    startTransition(async () => {
      await markServiceDone(userCarId, taskId, kmMilestone);
    });
  };

  const handleAIDiscovery = () => {
    setConfirmOpen({
      title: "Autodescubrir Plan",
      message:
        "¿Quieres que la IA busque y genere el plan de mantenimiento oficial para este vehículo?",
      onConfirm: () => {
        startTransition(async () => {
          const res = await discoverMaintenancePlan(userCarId);
          if (res.error) toast.error(res.error);
          if (res.success) toast.success(res.message);
        });
      },
    });
  };

  const handleUpdateFrequency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    startTransition(async () => {
      const res = await updateTaskFrequency(
        editingTask.id,
        editingTask.frequency,
      );
      if (res.success) {
        setEditingTask(null);
        toast.success("Frecuencia actualizada correctamente.");
      } else toast.error(res.error || "Error al actualizar");
    });
  };

  const handleDeleteTask = () => {
    if (!editingTask) return;
    setConfirmOpen({
      title: "Eliminar Tarea",
      message: `¿Estás seguro de que deseas eliminar la tarea "${editingTask.name}"? Esta acción borrará el historial relacionado.`,
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteTask(editingTask.id);
          if (res.success) {
            setEditingTask(null);
            toast.success("Tarea eliminada correctamente.");
          } else toast.error(res.error || "Error al eliminar");
        });
      },
    });
  };

  return (
    <div className="glass-panel mt-6 rounded-[28px] p-6 overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white  uppercase tracking-wider">
            Plan de Mantenimiento Programado
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Basado en el manual. Haz clic para marcar como completado.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={isPending || !canAddTask}
            onClick={() => setIsAddingTask(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${
              canAddTask
                ? "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700"
                : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {canAddTask ? (
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
            {canAddTask ? "Agregar Tarea" : "Límite 6 tareas (PRO)"}
          </button>
          <button
            disabled={isPending || !isPro}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${
              isPro
                ? "bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white group"
                : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 cursor-not-allowed"
            }`}
            onClick={isPro ? handleAIDiscovery : undefined}
          >
            {isPending ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : isPro ? (
              <svg
                className="w-4 h-4 group-hover:animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
            {isPending
              ? "Analizando..."
              : isPro
                ? "Autodescubrir Plan"
                : "Autodescubrir PRO"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 dark:text-zinc-500 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
            <p className="mb-4">
              No hay tareas de mantenimiento registradas para este modelo.
            </p>
            <p className="text-xs">
              Usa el botón de arriba para descubrir el plan oficial con IA.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold shadow-[4px_0_12px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_12px_rgba(0,0,0,0.5)] min-w-[150px] max-w-[180px] sm:max-w-none whitespace-normal sm:whitespace-nowrap transition-colors">
                  Miles de kilómetros
                </th>
                {columns.map((km) => (
                  <th
                    key={km}
                    className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-center text-zinc-700 dark:text-zinc-300 font-bold min-w-[60px] transition-colors"
                  >
                    {km / 1000}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter((t) => t.frequencyKm)
                .map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-zinc-200 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="sticky left-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 font-medium text-zinc-800 dark:text-zinc-200 shadow-[4px_0_12px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_12px_rgba(0,0,0,0.5)] group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/90 transition-colors min-w-[150px] max-w-[180px] sm:max-w-none whitespace-normal sm:whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="line-clamp-3 sm:line-clamp-none">
                          {task.name}
                        </span>
                        <button
                          onClick={() =>
                            setEditingTask({
                              id: task.id,
                              name: task.name,
                              frequency: task.frequencyKm || 10000,
                            })
                          }
                          className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex-shrink-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    {columns.map((km) => {
                      const isRequired = km % task.frequencyKm! === 0;
                      const isPastDue = currentKm >= km;
                      const isDone = history.some(
                        (h) =>
                          h.taskId === task.id &&
                          (h.kmMilestone === km || h.kmAtService === km),
                      );

                      if (!isRequired) {
                        return (
                          <td
                            key={km}
                            className="p-3 text-center text-zinc-300 dark:text-zinc-800 border-l border-zinc-200 dark:border-zinc-800/30 transition-colors"
                          ></td>
                        );
                      }

                      return (
                        <td
                          key={km}
                          className="p-3 text-center border-l border-zinc-200 dark:border-zinc-800/30 transition-all"
                        >
                          <button
                            disabled={isPending}
                            onClick={() => handleCellClick(task.id, km)}
                            className={`
                            flex items-center justify-center w-8 h-8 mx-auto rounded-md transition-all
                            ${
                              isDone
                                ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50"
                                : isPastDue
                                  ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 hover:bg-rose-500/30 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                                  : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }
                            ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                          `}
                            title={
                              isDone
                                ? "Completado"
                                : isPastDue
                                  ? "Recomendado / Vencido"
                                  : "Futuro"
                            }
                          >
                            {isDone ? "✓" : isPastDue ? "!" : "+"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            ✓
          </div>
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/50 text-rose-500 dark:text-rose-400 flex items-center justify-center">
            !
          </div>
          <span>Recomendado / Pasado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded text-zinc-400 dark:text-zinc-500 flex items-center justify-center">
            +
          </div>
          <span>Futuro</span>
        </div>
      </div>

      {/* Modal para editar frecuencia */}
      {editingTask && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar tarea"
        >
          <div className="w-full max-w-sm rounded-[24px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Editar Tarea
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Ajusta cada cuánto se debe realizar:{" "}
              <span className="text-zinc-900 dark:text-white font-medium">
                {editingTask.name}
              </span>
            </p>

            <form onSubmit={handleUpdateFrequency} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Kilómetros entre servicios
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="5000"
                    min="5000"
                    value={editingTask.frequency}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        frequency: parseInt(e.target.value),
                      })
                    }
                    className="appearance-none w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">
                    KM
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-400 transition-all disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 py-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleDeleteTask}
                    className="flex-1 rounded-xl bg-rose-500/10 border border-rose-500/20 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar nueva tarea */}
      {isAddingTask && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Nueva tarea manual"
        >
          <div className="w-full max-w-sm rounded-[24px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Nueva Tarea Manual
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Agrega un recordatorio de mantenimiento recurrente al plan.
            </p>

            <form
              action={async (formData) => {
                formData.append("userCarId", userCarId);
                startTransition(async () => {
                  const res = await addTask(null, formData);
                  if (res.success) {
                    setIsAddingTask(false);
                    toast.success("Tarea agregada correctamente.");
                  } else toast.error(res.error || "Error al agregar");
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Nombre de la Tarea
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Ej: Cambio de Anticongelante"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Frecuencia (Kilómetros)
                </label>
                <div className="relative">
                  <input
                    name="frequencyKm"
                    type="number"
                    step="1000"
                    min="1000"
                    required
                    defaultValue="10000"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-orange-500 focus:outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">
                    KM
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 py-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-400 transition-all disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
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
    </div>
  );
}
