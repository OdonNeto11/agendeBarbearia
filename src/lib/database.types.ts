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
      appointments: {
        Row: {
          id: string
          client_id: string | null
          barber_id: string | null
          service_id: string | null
          appointment_date: string
          start_time: string
          end_time: string
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          barber_id?: string | null
          service_id?: string | null
          appointment_date: string
          start_time: string
          end_time: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          barber_id?: string | null
          service_id?: string | null
          appointment_date?: string
          start_time?: string
          end_time?: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      barbers: {
        Row: {
          id: string
          bio: string | null
          years_of_experience: number | null
          specialties: string[] | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          bio?: string | null
          years_of_experience?: number | null
          specialties?: string[] | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          bio?: string | null
          years_of_experience?: number | null
          specialties?: string[] | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          full_name: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          full_name?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          full_name?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      schedules: {
        Row: {
          id: string
          barber_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          barber_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          barber_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          duration: number
          price: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration: number
          price: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          created_at?: string | null
          updated_at?: string | null
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
      user_role: "client" | "barber" | "admin"
    }
  }
}