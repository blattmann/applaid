import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase env vars at build time:', {
    url: supabaseUrl ? 'present' : 'MISSING',
    key: supabaseKey ? 'present' : 'MISSING',
  })
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)