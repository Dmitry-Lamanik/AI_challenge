import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL ?? '--not-configured--'
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '--not-configured--'
console.log('url', url)
console.log('anonKey', anonKey)
export const supabase = createClient<Database>(url, anonKey)

export function isSupabaseConfigured(): boolean {
  return url.length > 0 && anonKey.length > 0
}
