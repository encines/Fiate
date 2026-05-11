import Image from "next/image";
import { createClient } from "../../lib/supabase/server";
import { logout } from "../actions/logout";

export default async function HeaderIn() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || "Invitado";

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-950/90 px-4 py-4 text-zinc-900 dark:text-white backdrop-blur sm:px-6">
      <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-col">
            <h2 className="text-sm text-zinc-500 dark:text-zinc-300">
              Bienvenido de vuelta
            </h2>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">FIATE Dashboard</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400">
            + Agregar servicio
          </button>
          
          <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-700 pl-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">{email}</span>
              <form action={logout}>
                <button type="submit" className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-400">
                  Cerrar Sesión
                </button>
              </form>
            </div>
            <Image
              src="/logo.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-zinc-200 dark:ring-zinc-600 bg-zinc-100 dark:bg-zinc-900"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
