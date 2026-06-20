export type LegalDoc = 'privacy' | 'terms' | 'cookies';

type LegalBlock = { heading?: string; body: string };

export type LegalPageContent = {
  titleLine1: string;
  titleAccent: string;
  updated: string;
  blocks: LegalBlock[];
};

/** Contenido legal alineado con fiate-app (src/i18n/locales/es.ts → legal.*) */
export const legalContent: Record<LegalDoc, LegalPageContent> = {
  privacy: {
    titleLine1: 'Política de',
    titleAccent: 'Privacidad.',
    updated: 'Última actualización: Junio 2026',
    blocks: [
      {
        body: 'En Fiate nos tomamos muy en serio tu privacidad. Esta política describe qué datos recopilamos, cómo los usamos y con quién los compartimos cuando utilizas nuestra aplicación móvil y servicios relacionados.',
      },
      {
        heading: '1. Información que recopilamos',
        body: 'Recopilamos la información que nos proporcionas al registrarte o usar la app: nombre, correo electrónico, foto de perfil (plan PRO), datos de tus vehículos (marca, modelo, año, kilometraje, placas, color), registros de mantenimiento, combustible, documentos, recordatorios y preferencias de la app (idioma, unidades, tema).',
      },
      {
        heading: '2. Ubicación',
        body: 'Si activas el permiso de ubicación, usamos tu posición aproximada únicamente para mostrarte gasolineras cercanas en el mapa. No rastreamos tu ubicación en segundo plano ni la usamos con fines publicitarios.',
      },
      {
        heading: '3. Fotos y archivos',
        body: 'Si subes fotos de vehículos, servicios, documentos o avatar, estos archivos se almacenan de forma segura en nuestros servidores (Supabase Storage) asociados a tu cuenta. Solo tú puedes acceder a ellos mediante tu sesión autenticada.',
      },
      {
        heading: '4. Uso de la información',
        body: 'Usamos tus datos para operar Fiate: gestionar tu cuenta, sincronizar información entre dispositivos, mostrar recordatorios, aplicar límites de plan, procesar suscripciones PRO y mejorar la estabilidad del servicio. Podemos enviarte avisos locales de recordatorios configurados por ti en la app.',
      },
      {
        heading: '5. Asistente con inteligencia artificial',
        body: 'El Asistente Fiate (plan PRO) envía a Google Gemini un contexto con datos de tu vehículo (marca, modelo, kilometraje, tareas, servicios recientes, etc.) para generar respuestas. No vendemos estos datos. Las respuestas son orientativas y no constituyen diagnóstico mecánico profesional. Consulta la política de privacidad de Google: policies.google.com/privacy.',
      },
      {
        heading: '6. Pagos y suscripciones',
        body: 'Si contratas Fiate PRO desde la app en Android, el pago lo procesa Google Play. No almacenamos números de tarjeta. Recibimos de Google/RevenueCat confirmación de suscripción activa para habilitar funciones PRO. Si pagas en fiate.xyz (web), Stripe procesa el pago según su propia política de privacidad.',
      },
      {
        heading: '7. Compartición con terceros',
        body: 'No vendemos tu información personal. Compartimos datos solo con proveedores necesarios para operar el servicio: Supabase (base de datos y autenticación), Google (inicio de sesión, mapas, Gemini), RevenueCat (gestión de suscripciones in-app), Sentry (reportes de errores anónimos, si está activo) y Stripe (pagos web, si aplica). Solo compartimos lo estrictamente necesario.',
      },
      {
        heading: '8. Seguridad',
        body: 'Implementamos medidas técnicas y organizativas para proteger tus datos: cifrado en tránsito (HTTPS), control de acceso por usuario (RLS en base de datos) y almacenamiento seguro de archivos. Ningún sistema es 100 % infalible; te recomendamos usar una contraseña robusta.',
      },
      {
        heading: '9. Tus derechos y eliminación de cuenta',
        body: 'Puedes acceder, corregir o eliminar tus datos. Para eliminar tu cuenta y datos asociados, ve a Configuración → Eliminar cuenta dentro de la app. Si tienes PRO activo, cancela primero tu suscripción en Google Play. También puedes escribirnos a soporte@fiate.xyz para solicitudes de acceso o eliminación.',
      },
      {
        heading: '10. Menores de edad',
        body: 'Fiate no está dirigida a menores de 13 años. No recopilamos deliberadamente datos de menores. Si detectamos una cuenta de un menor sin consentimiento parental, la eliminaremos.',
      },
      {
        heading: '11. Cambios a esta política',
        body: 'Podemos actualizar esta política para reflejar cambios en la app o requisitos legales. Publicaremos la versión actualizada en la app con la fecha de revisión. El uso continuado tras los cambios implica aceptación.',
      },
      {
        heading: '12. Contacto',
        body: 'Responsable del tratamiento: Fiate (México). Para dudas sobre privacidad: soporte@fiate.xyz. Sitio web: fiate.xyz.',
      },
    ],
  },
  cookies: {
    titleLine1: 'Política de',
    titleAccent: 'Cookies.',
    updated: 'Última actualización: Junio 2026',
    blocks: [
      {
        body: 'Fiate utiliza almacenamiento local y tecnologías similares en la app y la web para mantener tu sesión y preferencias.',
      },
      {
        heading: '¿Qué son las cookies y el almacenamiento local?',
        body: 'Son pequeños datos guardados en tu dispositivo (SecureStore, caché local, preferencias) que permiten recordar tu sesión, idioma, tema y datos en modo offline.',
      },
      {
        heading: 'Cómo los usamos',
        body: 'Los usamos para mantener tu sesión iniciada, recordar configuración, cachear datos del vehículo para uso sin conexión y analizar errores técnicos (Sentry, si está activo).',
      },
      {
        heading: 'Control',
        body: 'Puedes cerrar sesión o desinstalar la app para eliminar datos locales. Algunas funciones (recordatorios, sincronización) requieren estos datos para operar.',
      },
      {
        heading: 'Terceros',
        body: 'No usamos cookies de rastreo publicitario. Los proveedores de autenticación (Google) y analítica de errores pueden usar identificadores propios según sus políticas.',
      },
    ],
  },
  terms: {
    titleLine1: 'Términos de',
    titleAccent: 'Servicio.',
    updated: 'Última actualización: Junio 2026',
    blocks: [
      {
        body: 'Estos Términos regulan el uso de la aplicación Fiate. Al crear una cuenta o usar la app, aceptas estos Términos y nuestra Política de Privacidad. Si no estás de acuerdo, no uses el servicio.',
      },
      {
        heading: '1. Aceptación',
        body: 'Al registrarte, iniciar sesión o usar Fiate, confirmas que has leído y aceptas estos Términos de Servicio y la Política de Privacidad.',
      },
      {
        heading: '2. Descripción del servicio',
        body: 'Fiate es una aplicación de gestión vehicular que te permite registrar mantenimiento, combustible, documentos, recordatorios, plan de tareas y (en plan PRO) fotos, avatar y asistente con IA. La app es una herramienta de organización personal; no sustituye revisiones en taller ni diagnósticos profesionales.',
      },
      {
        heading: '3. Edad mínima',
        body: 'Debes tener al menos 13 años para usar Fiate. Si eres menor de edad según la legislación de tu país, necesitas consentimiento de tu padre, madre o tutor legal.',
      },
      {
        heading: '4. Cuentas de usuario',
        body: 'Eres responsable de la confidencialidad de tu cuenta y contraseña, y de toda actividad bajo tu usuario. Debes proporcionar información veraz y mantenerla actualizada. Notifícanos de inmediato cualquier uso no autorizado en soporte@fiate.xyz.',
      },
      {
        heading: '5. Uso aceptable',
        body: 'Te comprometes a usar Fiate de forma lícita. Queda prohibido: intentar acceder a cuentas ajenas, interferir con el servicio, subir contenido ilegal o malicioso, hacer ingeniería inversa del software o usar la app para fines fraudulentos.',
      },
      {
        heading: '6. Planes y suscripción PRO',
        body: 'Fiate ofrece un plan gratuito (Estándar) y un plan de pago (PRO). PRO incluye funciones adicionales descritas en la app. En Android, la suscripción PRO anual se contrata y renueva a través de Google Play Billing. El precio vigente se muestra en la pantalla de planes antes de confirmar la compra. La suscripción se renueva automáticamente al final de cada periodo salvo que la canceles al menos 24 horas antes del siguiente cobro.',
      },
      {
        heading: '7. Cancelación y reembolsos',
        body: 'Puedes cancelar PRO en cualquier momento desde Google Play: Ajustes → Pagos y suscripciones → Suscripciones → Fiate. Tras cancelar, conservas PRO hasta el fin del periodo pagado y luego vuelves a Estándar. Los reembolsos se rigen por la política de Google Play; Fiate no procesa reembolsos directamente de compras in-app. Si pagaste en fiate.xyz, aplican las condiciones de Stripe y la web.',
      },
      {
        heading: '8. Asistente con inteligencia artificial',
        body: 'El Asistente Fiate (PRO) usa inteligencia artificial (Google Gemini) para responder preguntas sobre tu vehículo. Las respuestas son orientativas, pueden contener errores y no constituyen asesoría mecánica, legal ni de seguridad vial. Ante dudas técnicas o fallas del vehículo, consulta a un profesional certificado. Usas el asistente bajo tu propio criterio y riesgo.',
      },
      {
        heading: '9. Contenido del usuario',
        body: 'Conservas la propiedad de los datos y fotos que subes. Nos otorgas una licencia limitada para almacenarlos, procesarlos y mostrártelos dentro del servicio. Eres responsable del contenido que cargas y de contar con derechos sobre él.',
      },
      {
        heading: '10. Servicios de terceros',
        body: 'Fiate integra servicios de terceros (Google Sign-In, Google Maps, Supabase, RevenueCat, Gemini, Stripe en web). Su uso puede estar sujeto a términos y políticas propias de esos proveedores. No somos responsables de interrupciones o cambios en servicios externos.',
      },
      {
        heading: '11. Eliminación de cuenta',
        body: 'Puedes eliminar tu cuenta en Configuración → Eliminar cuenta. Se borrarán tus datos de la app y archivos asociados, salvo retención exigida por ley. Si tienes PRO activo, cancela la suscripción en Google Play antes de eliminar la cuenta para evitar cobros futuros.',
      },
      {
        heading: '12. Limitación de responsabilidad',
        body: 'Fiate se ofrece "tal cual". No garantizamos que la app esté libre de errores ni que los recordatorios o datos del mapa de gasolineras sean exactos. No somos responsables por daños directos o indirectos derivados del uso de la app, omisiones de mantenimiento, decisiones basadas en el asistente IA o pérdida de datos por causas fuera de nuestro control razonable.',
      },
      {
        heading: '13. Modificaciones y terminación',
        body: 'Podemos modificar estos Términos, funciones o precios con aviso en la app. Podemos suspender o cerrar cuentas que violen estos Términos. El uso continuado tras cambios implica aceptación de los Términos actualizados.',
      },
      {
        heading: '14. Ley aplicable y contacto',
        body: 'Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para consultas: soporte@fiate.xyz · fiate.xyz. Titular del servicio: Fiate (México).',
      },
    ],
  },
};
