import { prisma } from "../../lib/prisma";
import AddReminderModal from "./AddReminderModal";
import { deleteReminder } from "../actions/deleteReminder";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(date);

interface RemindersProps {
  activeCar?: any;
}

export default async function Reminders({ activeCar }: RemindersProps) {
  if (!activeCar) {
    return (
      <div className="glass-panel p-12 text-center text-zinc-400">
        Por favor selecciona un vehículo para ver sus recordatorios.
      </div>
    );
  }

  const reminders = await prisma.reminder.findMany({
    where: { userCarId: activeCar.id },
    orderBy: { date: "asc" },
  });

  return (
    <div className="view-shell text-zinc-100 space-y-6">
      <section className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Recordatorios</h1>
          <p className="mt-2 text-zinc-400">
            Mantén al día trámites, pagos y tareas importantes de tu auto.
          </p>
        </div>
        <AddReminderModal userCarId={activeCar.id} />
      </section>

      {reminders.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-zinc-400 italic">No tienes recordatorios activos.</p>
          <p className="text-sm text-zinc-500 mt-2">Crea uno nuevo para no olvidar trámites importantes.</p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reminders.map((item) => {
            const isNear = new Date(item.date).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 7; // Menos de 7 días
            
            return (
              <article
                key={item.id}
                className="glass-panel rounded-3xl p-5 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">{item.title}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isNear ? "bg-rose-500/15 text-rose-300" : "bg-indigo-500/15 text-indigo-300"
                  }`}>
                    {isNear ? "Urgente" : "Pendiente"}
                  </span>
                </div>
                <p className="mt-4 text-sm text-zinc-300 flex items-center gap-2">
                  <span className="text-zinc-500">Vence:</span> {formatDate(item.date)}
                </p>
                {item.detail && (
                  <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
                )}
                
                <form 
                  action={async () => {
                    "use server";
                    await deleteReminder(item.id);
                  }}
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button 
                    type="submit"
                    className="p-2 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Eliminar recordatorio"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

