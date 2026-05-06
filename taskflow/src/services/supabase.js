// src/services/supabase.js
// ============================================================
// Cliente Supabase centralizado
// Importar este arquivo em qualquer lugar que precisar do Supabase
// ============================================================
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Variáveis de ambiente do Supabase não encontradas.\n' +
    'Crie um arquivo .env na raiz do projeto com:\n' +
    'VITE_SUPABASE_URL=...\n' +
    'VITE_SUPABASE_ANON_KEY=...'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
