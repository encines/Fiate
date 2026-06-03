import { createClient } from "../../lib/supabase/server";
import AddReminderModal from "./AddReminderModal";
import { deleteReminder } from "../actions/deleteReminder";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(date);

interface RemindersProps {
  activeCar?: any;
}

export default async function Reminders({ activeCar }: RemindersProps) {
  const supabase = await createClient();
  
  if (!activeCar) {
    return (
      <div className="glass-panel p-12 text-center text-zinc-400">
        Por favor selecciona un vehículo para ver sus recordatorios.
      </div>
    );
  }

  // Consulta directa a Supabase en lugar de Prisma
  const { data: reminders } = await supabase
    .from('Reminder')
    .select('*')
    .eq('userCarId', activeCar.id)
    .order('date', { ascending: true });

  return (
    <div className="view-shell space-y-6">
      <section className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 rounded-[24px]">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Recordatorios</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Mantén al día trámites, pagos y tareas importantes de tu auto.
          </p>
        </div>
        <AddReminderModal userCarId={activeCar.id} />
      </section>

      {(!reminders || reminders.length === 0) ? (
        <div className="glass-panel p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[24px]">
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
                className="glass-panel rounded-[24px] p-6 group relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white truncate">{item.title}</h2>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    isNear 
                      ? "bg-rose-500/10 text-rose-500" 
                      : "bg-orange-500/10 text-orange-500 dark:text-orange-400"
                  }`}>
                    {isNear ? "Urgente" : "Pendiente"}
                  </span>
                </div>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <span className="font-semibold text-zinc-400 uppercase text-[10px] tracking-widest">Vence:</span> {formatDate(new Date(item.date))}
                </p>
                {item.detail && (
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500 italic line-clamp-2">{item.detail}</p>
                )}
                
                <form 
                  action={async () => {
                    "use server";
                    await deleteReminder(item.id);
                  }}
                  className="absolute bottom-4 right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
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
