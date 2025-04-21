
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
          store_slug?: string
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
          store_slug?: string
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
          store_slug?: string
          address?: string
          city?: string
          country?: string
          postal_code?: string
        }
      }
      returns: {
        Row: {
          id: string
          merchant_id: string
          order_id: string
          product_name: string
          reason: string
          customer_email: string
          photo_url?: string
          status: 'pending' | 'approved' | 'rejected'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          order_id: string
          product_name: string
          reason: string
          customer_email: string
          photo_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          order_id?: string
          product_name?: string
          reason?: string
          customer_email?: string
          photo_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string
          created_at?: string
          updated_at?: string
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
