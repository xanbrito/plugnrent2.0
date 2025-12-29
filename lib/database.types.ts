// Tipos gerados do Supabase
// Este arquivo deve ser atualizado quando o schema do banco mudar
// Use: npx supabase gen types typescript --project-id fdlglyqbfonmintvzhvm > lib/database.types.ts

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
      user_profiles: {
        Row: {
          user_id: string
          full_name: string
          cpf: string | null
          cnpj: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          full_name: string
          cpf?: string | null
          cnpj?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          full_name?: string
          cpf?: string | null
          cnpj?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          host_name: string
          host_full_name: string
          host_cpf: string | null
          host_cnpj: string | null
          host_email: string
          host_phone: string | null
          host_is_company: boolean
          space_name: string
          address: string
          how_to_enter: string | null
          google_maps_link: string | null
          waze_link: string | null
          type: 'quarto' | 'espaco-inteiro'
          description: string
          rules: Json
          pricing_monday: number | null
          pricing_tuesday: number | null
          pricing_wednesday: number | null
          pricing_thursday: number | null
          pricing_friday: number | null
          pricing_saturday: number | null
          pricing_sunday: number | null
          airbnb_link: string | null
          budget_via_site: boolean
          pet_friendly_allowed: boolean
          pet_friendly_size: 'pequeno' | 'grande' | 'ambos' | null
          pet_friendly_start_date: string | null
          pet_friendly_end_date: string | null
          pet_friendly_rules: string | null
          pet_friendly_cost_type: 'fixed' | 'percentage' | null
          pet_friendly_cost_value: number | null
          whats_included_not_included: string[] | null
          whats_included_kitchen_materials: string[] | null
          whats_included_cleaning_materials: string[] | null
          whats_included_bed_linen: boolean
          whats_included_amenities: string[] | null
          property_items: Json
          local_tips: Json
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          host_name: string
          host_full_name: string
          host_cpf?: string | null
          host_cnpj?: string | null
          host_email: string
          host_phone?: string | null
          host_is_company?: boolean
          space_name: string
          address: string
          how_to_enter?: string | null
          google_maps_link?: string | null
          waze_link?: string | null
          type: 'quarto' | 'espaco-inteiro'
          description: string
          rules?: Json
          pricing_monday?: number | null
          pricing_tuesday?: number | null
          pricing_wednesday?: number | null
          pricing_thursday?: number | null
          pricing_friday?: number | null
          pricing_saturday?: number | null
          pricing_sunday?: number | null
          airbnb_link?: string | null
          budget_via_site?: boolean
          pet_friendly_allowed?: boolean
          pet_friendly_size?: 'pequeno' | 'grande' | 'ambos' | null
          pet_friendly_start_date?: string | null
          pet_friendly_end_date?: string | null
          pet_friendly_rules?: string | null
          pet_friendly_cost_type?: 'fixed' | 'percentage' | null
          pet_friendly_cost_value?: number | null
          whats_included_not_included?: string[] | null
          whats_included_kitchen_materials?: string[] | null
          whats_included_cleaning_materials?: string[] | null
          whats_included_bed_linen?: boolean
          whats_included_amenities?: string[] | null
          property_items?: Json
          local_tips?: Json
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          host_name?: string
          host_full_name?: string
          host_cpf?: string | null
          host_cnpj?: string | null
          host_email?: string
          host_phone?: string | null
          host_is_company?: boolean
          space_name?: string
          address?: string
          how_to_enter?: string | null
          google_maps_link?: string | null
          waze_link?: string | null
          type?: 'quarto' | 'espaco-inteiro'
          description?: string
          rules?: Json
          pricing_monday?: number | null
          pricing_tuesday?: number | null
          pricing_wednesday?: number | null
          pricing_thursday?: number | null
          pricing_friday?: number | null
          pricing_saturday?: number | null
          pricing_sunday?: number | null
          airbnb_link?: string | null
          budget_via_site?: boolean
          pet_friendly_allowed?: boolean
          pet_friendly_size?: 'pequeno' | 'grande' | 'ambos' | null
          pet_friendly_start_date?: string | null
          pet_friendly_end_date?: string | null
          pet_friendly_rules?: string | null
          pet_friendly_cost_type?: 'fixed' | 'percentage' | null
          pet_friendly_cost_value?: number | null
          whats_included_not_included?: string[] | null
          whats_included_kitchen_materials?: string[] | null
          whats_included_cleaning_materials?: string[] | null
          whats_included_bed_linen?: boolean
          whats_included_amenities?: string[] | null
          property_items?: Json
          local_tips?: Json
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          property_id: string
          checkin_link_token: string
          checkin_data: Json
          guests: Json
          channel: string
          status: 'pending' | 'completed' | 'cancelled'
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          checkin_link_token: string
          checkin_data: Json
          guests?: Json
          channel: string
          status?: 'pending' | 'completed' | 'cancelled'
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          checkin_link_token?: string
          checkin_data?: Json
          guests?: Json
          channel?: string
          status?: 'pending' | 'completed' | 'cancelled'
          name?: string | null
          created_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          reservation_id: string | null
          name: string
          cpf: string | null
          birth_date: string | null
          rg: string | null
          email: string
          selfie_document_url: string | null
          document_url: string | null
          status: 'active' | 'inactive'
          is_titular: boolean
          email_verified: boolean
          password_hash: string | null
          oauth_provider: string | null
          oauth_id: string | null
          address: string | null
          address_number: string | null
          address_complement: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          address_proof_url: string | null
          validation_status: 'pending' | 'approved' | 'rejected' | null
          validated_by: string | null
          validated_at: string | null
          validation_notes: string | null
          profile_complete: boolean
          is_temporary: boolean
          created_by_guest_id: string | null
          urgencia: boolean
          created_at: string
        }
        Insert: {
          id?: string
          reservation_id?: string | null
          name: string
          cpf?: string | null
          birth_date?: string | null
          rg?: string | null
          email: string
          selfie_document_url?: string | null
          document_url?: string | null
          status?: 'active' | 'inactive'
          is_titular?: boolean
          email_verified?: boolean
          password_hash?: string | null
          oauth_provider?: string | null
          oauth_id?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          address_proof_url?: string | null
          validation_status?: 'pending' | 'approved' | 'rejected' | null
          validated_by?: string | null
          validated_at?: string | null
          validation_notes?: string | null
          profile_complete?: boolean
          is_temporary?: boolean
          created_by_guest_id?: string | null
          urgencia?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string | null
          name?: string
          cpf?: string | null
          birth_date?: string | null
          rg?: string | null
          email?: string
          selfie_document_url?: string | null
          document_url?: string | null
          status?: 'active' | 'inactive'
          is_titular?: boolean
          email_verified?: boolean
          password_hash?: string | null
          oauth_provider?: string | null
          oauth_id?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          address_proof_url?: string | null
          validation_status?: 'pending' | 'approved' | 'rejected' | null
          validated_by?: string | null
          validated_at?: string | null
          validation_notes?: string | null
          profile_complete?: boolean
          is_temporary?: boolean
          created_by_guest_id?: string | null
          urgencia?: boolean
          created_at?: string
        }
      }
      condominiums: {
        Row: {
          id: string
          name: string
          cnpj: string | null
          cpf: string | null
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          created_at: string
          updated_at: string
          status: 'active' | 'inactive'
        }
        Insert: {
          id: string
          name: string
          cnpj?: string | null
          cpf?: string | null
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string | null
          cpf?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive'
        }
      }
      // Adicionar outras tabelas conforme necessário
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




