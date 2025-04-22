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
      pickups: {
        Row: {
          id: string
          user_id: string
          return_id: string
          pickup_date: string
          time_slot: 'morning' | 'afternoon' | 'evening'
          address: string
          city: string
          postal_code: string
          package_size: 'small' | 'medium' | 'large'
          courier_tracking_number: string | null
          notes: string | null
          status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          return_id: string
          pickup_date: string
          time_slot: 'morning' | 'afternoon' | 'evening'
          address: string
          city: string
          postal_code: string
          package_size: 'small' | 'medium' | 'large'
          courier_tracking_number?: string | null
          notes?: string | null
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          return_id?: string
          pickup_date?: string
          time_slot?: 'morning' | 'afternoon' | 'evening'
          address?: string
          city?: string
          postal_code?: string
          package_size?: 'small' | 'medium' | 'large'
          courier_tracking_number?: string | null
          notes?: string | null
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      },
      refund_policies: {
        Row: {
          description: any
          item_condition: string
          id: string
          merchant_id: string
          condition_description: string
          refund_percentage: number
          processing_time_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          condition_description: string
          refund_percentage: number
          processing_time_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          condition_description?: string
          refund_percentage?: number
          processing_time_days?: number
          created_at?: string
          updated_at?: string
        }
      },
      profiles: {
        Row: {
          postal_code: string
          city: string
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