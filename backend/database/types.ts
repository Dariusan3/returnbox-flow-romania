export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'merchant'
          created_at: string
          updated_at: string
          first_name?: string
          last_name?: string
          phone?: string
          store_name?: string
          store_logo?: string
          address?: string
          city?: string
          country?: string
          postal_code?: string
        }
        Insert: {
          id: string
          email: string
          role: 'customer' | 'merchant'
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          phone?: string
          store_name?: string
          store_logo?: string
          address?: string
          city?: string
          country?: string
          postal_code?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'merchant'
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          phone?: string
          store_name?: string
          store_logo?: string
          address?: string
          city?: string
          country?: string
          postal_code?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}