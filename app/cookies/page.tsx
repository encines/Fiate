"use client";

import Header from "../components/header";
import Footer from "../components/footer";

export default function CookiesPolicy() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Header />
      
      <article className="mx-auto max-w-3xl px-6 pt-40 pb-24 lg:pt-48">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Política de <br />
            <span className="text-indigo-500 italic font-black">Cookies.</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Última actualización: Mayo 2026</p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo para ayudar a que Fiate funcione de manera eficiente y proporcione la mejor experiencia posible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">2. Uso de Cookies en Fiate</h2>
            <p>
              Utilizamos cookies esenciales para mantener su sesión activa y recordar sus preferencias de tema (Claro/Oscuro). También utilizamos cookies analíticas anónimas para entender cómo los usuarios interactúan con nuestra plataforma y mejorar nuestras herramientas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">3. Control de Cookies</h2>
            <p>
              Usted puede controlar y/o eliminar las cookies a través de la configuración de su navegador. Sin embargo, tenga en cuenta que desactivar ciertas cookies puede afectar la funcionalidad principal de la aplicación.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  );
}
