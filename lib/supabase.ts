import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your .env file.')
}

// Cliente estándar para operaciones desde el cliente (usar con RLS)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Cliente administrativo para operaciones en el servidor (bypass RLS)
// IMPORTANTE: Solo usar en Server Actions o API Routes
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Genera una URL firmada para un archivo privado.
 * Expira por defecto en 1 hora (3600 segundos).
 */
export async function getSignedUrl(path: string, bucket: string = 'documents', expiresIn: number = 3600) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error(`Error generando Signed URL para ${path}:`, error)
    return null
  }

  return data.signedUrl
}
