/** Rutas legales canónicas (web). La app redirige /privacy-policy y /terms-of-service aquí. */
export const LEGAL_ROUTES = {
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  deleteAccount: '/delete-account',
} as const;

export const SUPPORT_EMAIL = 'soporte@fiate.xyz';
export const SITE_URL = 'https://fiate.xyz';
