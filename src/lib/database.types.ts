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
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          address: string | null
          role: 'customer' | 'merchant'
          store_name: string | null
          website: string | null
          business_address: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          address?: string | null
          role: 'customer' | 'merchant'
          store_name?: string | null
          website?: string | null
          business_address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          role?: 'customer' | 'merchant'
          store_name?: string | null
          website?: string | null
          business_address?: string | null
        }
      }
      returns: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          merchant_id: string
          status: 'pending' | 'approved' | 'completed' | 'rejected'
          product_name: string
          reason: string
          description: string | null
          tracking_number: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          merchant_id: string
          status?: 'pending' | 'approved' | 'completed' | 'rejected'
          product_name: string
          reason: string
          description?: string | null
          tracking_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          merchant_id?: string
          status?: 'pending' | 'approved' | 'completed' | 'rejected'
          product_name?: string
          reason?: string
          description?: string | null
          tracking_number?: string | null
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