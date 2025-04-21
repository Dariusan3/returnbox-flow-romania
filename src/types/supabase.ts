import { ReactNode } from "react"

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
          website: string
          business_address: string
          name: string
          id: string
          created_at: string
          updated_at: string
          email: string
          role: 'customer' | 'merchant'
          store_name?: string
          store_logo?: string
          first_name?: string
          last_name?: string
          phone?: string
          address?: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          role: 'customer' | 'merchant'
          store_name?: string
          store_logo?: string
          first_name?: string
          last_name?: string
          phone?: string
          address?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          role?: 'customer' | 'merchant'
          store_name?: string
          store_logo?: string
          first_name?: string
          last_name?: string
          phone?: string
          address?: string
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