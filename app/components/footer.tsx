"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-50 dark:bg-zinc-950 pt-32 pb-16 overflow-hidden border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-[90%] bg-orange-500/5 dark:bg-orange-500/[0.03] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/screen.png"
                alt="Fiate Logo"
                width={60}
                height={60}
                className="h-10 w-auto object-contain brightness-110 transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Fiate</span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
              La plataforma de precisión para la gestión automotriz moderna. Elevando el estándar del cuidado vehicular.
            </p>
          </div>

          {/* Links Columns */}
          {[
            {
              title: "Plataforma",
              links: [
                { name: "Funcionalidades", href: "/#features" },
                { name: "Seguridad", href: "/#security" },
                { name: "Planes y Precios", href: "/#elige-tu-plan" },
              ],
            },
            {
              title: "Soporte",
              links: [
                { name: "Centro de Ayuda", href: "mailto:soporte@fiate.com" },
                { name: "Contacto Directo", href: "https://wa.me/526671361586" },
              ],
            },
            {
              title: "Legal",
              links: [
                { name: "Privacidad", href: "/privacy-policy" },
                { name: "Términos", href: "/terms-of-service" },
                { name: "Eliminar cuenta", href: "/delete-account" },
                { name: "Cookies", href: "/cookies" },
              ],
            },
          ].map((column) => (
            <div key={column.title} className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-500">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-zinc-200 dark:border-white/5 pt-12 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
            © {currentYear} FIATE ENGINEERING. PROTOCOLO DE ALTA PRECISIÓN.
          </p>
          <div className="flex items-center gap-4">
            <div className="h-1 w-1 rounded-full bg-teal-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Global Operations</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
