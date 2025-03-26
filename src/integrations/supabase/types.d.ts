
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
      clients: {
        Row: {
          id: number
          name: string
          contact: string
          email: string
          phone: string
          location: string
          type: 'Corporate' | 'Government' | 'Individual'
          status: 'Active' | 'Inactive'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          contact: string
          email: string
          phone: string
          location: string
          type: 'Corporate' | 'Government' | 'Individual'
          status: 'Active' | 'Inactive'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          contact?: string
          email?: string
          phone?: string
          location?: string
          type?: 'Corporate' | 'Government' | 'Individual'
          status?: 'Active' | 'Inactive'
          created_at?: string
        }
      }
      interactions: {
        Row: {
          id: number
          client_id: number
          type: 'Meeting' | 'Call' | 'Email' | 'Note'
          date: string
          summary: string
          employee: string
          sentiment: 'Positive' | 'Neutral' | 'Negative' | null
          followup_date: string | null
          created_at: string
        }
        Insert: {
          id?: number
          client_id: number
          type: 'Meeting' | 'Call' | 'Email' | 'Note'
          date?: string
          summary: string
          employee: string
          sentiment?: 'Positive' | 'Neutral' | 'Negative' | null
          followup_date?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          client_id?: number
          type?: 'Meeting' | 'Call' | 'Email' | 'Note'
          date?: string
          summary?: string
          employee?: string
          sentiment?: 'Positive' | 'Neutral' | 'Negative' | null
          followup_date?: string | null
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: number
          client_id: number
          title: string
          start_date: string
          end_date: string
          value: number
          status: 'Active' | 'Pending' | 'Expired'
          renewal_alert: boolean
          created_at: string
        }
        Insert: {
          id?: number
          client_id: number
          title: string
          start_date: string
          end_date: string
          value: number
          status: 'Active' | 'Pending' | 'Expired'
          renewal_alert?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          client_id?: number
          title?: string
          start_date?: string
          end_date?: string
          value?: number
          status?: 'Active' | 'Pending' | 'Expired'
          renewal_alert?: boolean
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: number
          client_id: number
          name: string
          description: string | null
          start_date: string
          end_date: string | null
          status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled'
          created_at: string
        }
        Insert: {
          id?: number
          client_id: number
          name: string
          description?: string | null
          start_date: string
          end_date?: string | null
          status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled'
          created_at?: string
        }
        Update: {
          id?: number
          client_id?: number
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled'
          created_at?: string
        }
      }
      satisfaction_metrics: {
        Row: {
          id: number
          client_id: number
          overall_score: number
          date: string
          created_at: string
        }
        Insert: {
          id?: number
          client_id: number
          overall_score: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: number
          client_id?: number
          overall_score?: number
          date?: string
          created_at?: string
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
