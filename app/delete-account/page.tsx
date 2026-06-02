"use client";

import Header from "../components/header";
import Footer from "../components/footer";

export default function DeleteAccount() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Header />

      <article className="mx-auto max-w-3xl px-6 pt-40 pb-24 lg:pt-48">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Eliminación de <br />
            <span className="text-indigo-500 italic font-black">Cuenta.</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
            Fiate
          </p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">
              Cómo eliminar tu cuenta
            </h2>
            <p>
              Para eliminar tu cuenta de Fiate y los datos asociados, puedes
              hacerlo directamente desde la app móvil siguiendo estos pasos:
            </p>
            <ol className="list-decimal space-y-3 pl-5">
              <li>Inicia sesión en Fiate.</li>
              <li>Ve a Configuración.</li>
              <li>Selecciona Cuenta.</li>
              <li>Toca Eliminar cuenta.</li>
              <li>Confirma la eliminación.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">
              Datos que se eliminan
            </h2>
            <p>
              Al eliminar tu cuenta, se borran tus datos de perfil, vehículos,
              servicios, recordatorios, registros de combustible y documentos
              asociados a tu cuenta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">
              Conservación temporal
            </h2>
            <p>
              Algunos datos pueden conservarse temporalmente si son necesarios
              para seguridad, prevención de fraude, cumplimiento legal o
              resolución de incidencias. Cuando ya no sean necesarios, serán
              eliminados de acuerdo con nuestras políticas internas.
            </p>
          </section>

          <div className="rounded-3xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 p-8 mt-16">
            <p className="text-sm">
              Si no puedes acceder a tu cuenta, escríbenos a{" "}
              <a
                href="mailto:soporte@fiate.com"
                className="font-bold text-indigo-600 dark:text-indigo-400"
              >
                soporte@fiate.com
              </a>
              .
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
