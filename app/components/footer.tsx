import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-950 pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-indigo-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/screen.png"
                alt="Fiate Logo"
                width={60}
                height={60}
                className="h-10 w-auto object-contain brightness-110"
              />
              <span className="text-xl font-black uppercase tracking-tighter">Fiate</span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-500">
              Elevando el estándar de la gestión automotriz personal. Tecnología de precisión para conductores exigentes.
            </p>
          </div>

          {/* Links Columns */}
          {[
            {
              title: "Plataforma",
              links: [
                { name: "Características", href: "#" },
                { name: "Seguridad", href: "#" },
                { name: "Planes", href: "#" },
                { name: "Empresas", href: "#" },
              ],
            },
            {
              title: "Recursos",
              links: [
                { name: "Documentación", href: "/api-documentation" },
                { name: "Soporte", href: "/contact-support" },
                { name: "Blog", href: "#" },
                { name: "Comunidad", href: "#" },
              ],
            },
            {
              title: "Legal",
              links: [
                { name: "Privacidad", href: "/privacy-policy" },
                { name: "Términos", href: "/terms-of-service" },
                { name: "Cookies", href: "#" },
                { name: "Licencia", href: "#" },
              ],
            },
          ].map((column) => (
            <div key={column.title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-zinc-500 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            © {currentYear} Fiate Engineering. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-8">
            {["Twitter", "LinkedIn", "Instagram"].map((social) => (
              <Link 
                key={social} 
                href="#" 
                className="text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-zinc-200"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
