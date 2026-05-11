"use client";

import Header from "../components/header";
import Footer from "../components/footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Header />
      
      <article className="mx-auto max-w-3xl px-6 pt-40 pb-24 lg:pt-48">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Política de <br />
            <span className="text-indigo-500 italic font-black">Privacidad.</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Última actualización: Mayo 2026</p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">1. Transparencia de Datos</h2>
            <p>
              En Fiate, la privacidad de su información automotriz es nuestra prioridad. Recopilamos datos técnicos de su vehículo, como kilometraje y registros de mantenimiento, exclusivamente para proporcionar métricas de precisión y recordatorios preventivos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">2. Seguridad de la Información</h2>
            <p>
              Utilizamos protocolos de cifrado de nivel bancario para asegurar que sus documentos y datos personales permanezcan privados. No compartimos sus datos con terceros sin su consentimiento explícito, excepto cuando sea necesario para la prestación del servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">3. Sus Derechos</h2>
            <p>
              Usted mantiene el control total sobre su información. En cualquier momento, puede acceder, rectificar o solicitar la eliminación definitiva de su cuenta y todos los datos asociados desde el panel de configuración de su perfil.
            </p>
          </section>

          <div className="rounded-3xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 p-8 mt-16">
            <p className="text-sm italic">
              &ldquo;Fiate se compromete a no vender nunca su información personal a anunciantes o corredores de datos.&rdquo;
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
