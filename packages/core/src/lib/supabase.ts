import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL)
  ? import.meta.env.VITE_SUPABASE_URL as string
  : (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : undefined) as string | undefined

const supabaseKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY)
  ? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
  : (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_PUBLISHABLE_KEY : undefined) as string | undefined

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase env vars missing — running in test/offline mode')
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder'
)