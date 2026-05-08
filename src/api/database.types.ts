/**
 * Database types for Supabase client (public tables from supabase/seed.sql).
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          position: string
        }
        Insert: {
          name: string
          position: string
        }
        Update: {
          id?: number
          name?: string
          position?: string
        }
      }
      activity_categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      activities: {
        Row: {
          id: number
          user_id: number
          category_id: number
          title: string
          date: string
          points: number
        }
        Insert: {
          user_id: number
          category_id: number
          title: string
          date: string
          points: number
        }
        Update: {
          id?: number
          user_id?: number
          category_id?: number
          title?: string
          date?: string
          points?: number
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
