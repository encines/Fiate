"use client";

import Header from "../components/header";
import Footer from "../components/footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Header />
      
      <article className="mx-auto max-w-3xl px-6 pt-40 pb-24 lg:pt-48">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Términos de <br />
            <span className="text-orange-500 italic font-black">Servicio.</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Última actualización: Mayo 2026</p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">1. Aceptación del Protocolo</h2>
            <p>
              Al utilizar Fiate, usted acepta adherirse a estos términos. Fiate es una herramienta de asistencia y gestión; la responsabilidad final del estado mecánico y legal de su vehículo recae siempre en el propietario.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">2. Uso de la Plataforma</h2>
            <p>
              El usuario se compromete a proporcionar información veraz sobre su vehículo. El uso indebido de la plataforma, como el intento de ingeniería inversa o el acceso no autorizado a datos ajenos, resultará en la terminación inmediata de la cuenta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">3. Suscripciones y Pagos</h2>
            <p>
              Los servicios Premium de Fiate se rigen por las tarifas vigentes en la sección de Precios. Las cancelaciones pueden realizarse en cualquier momento, manteniendo el acceso hasta el final del ciclo de facturación actual.
            </p>
          </section>

          <div className="rounded-3xl border-2 border-orange-500/20 bg-orange-500/[0.02] p-8 mt-16">
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Importante: Fiate no sustituye las revisiones técnicas oficiales obligatorias por ley en su jurisdicción.
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
