import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // Se agregan los providers en auth.ts para no romper Edge Middleware con Node APIs
  ],
} satisfies NextAuthConfig

export default authConfig
