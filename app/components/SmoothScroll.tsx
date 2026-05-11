"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Desactivamos la restauración nativa para evitar que el navegador
    // nos "ancle" al footer al volver atrás.
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

    if (lenis) {
      // Forzamos el scroll al inicio con un pequeño delay para asegurar
      // que el DOM esté listo y Lenis tenga el control total.
      const timer = setTimeout(() => {
        lenis.scrollTo(0, { immediate: true });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname, lenis]);

  return (
    <ReactLenis root options={{ 
      lerp: 0.1, 
      duration: 1.5, 
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      syncTouch: true, // Mejora drástica en móviles
    }}>
      {children}
    </ReactLenis>
  );
}
