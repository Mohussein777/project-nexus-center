export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          contact: string
          created_at: string
          email: string
          id: number
          location: string
          name: string
          phone: string
          status: string
          type: string
        }
        Insert: {
          contact: string
          created_at?: string
          email: string
          id?: number
          location: string
          name: string
          phone: string
          status: string
          type: string
        }
        Update: {
          contact?: string
          created_at?: string
          email?: string
          id?: number
          location?: string
          name?: string
          phone?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: number
          created_at: string
          end_date: string
          id: number
          renewal_alert: boolean
          start_date: string
          status: string
          title: string
          value: number
        }
        Insert: {
          client_id: number
          created_at?: string
          end_date: string
          id?: number
          renewal_alert?: boolean
          start_date: string
          status: string
          title: string
          value: number
        }
        Update: {
          client_id?: number
          created_at?: string
          end_date?: string
          id?: number
          renewal_alert?: boolean
          start_date?: string
          status?: string
          title?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          client_id: number
          created_at: string
          date: string
          employee: string
          followup_date: string | null
          id: number
          sentiment: string | null
          summary: string
          type: string
        }
        Insert: {
          client_id: number
          created_at?: string
          date?: string
          employee: string
          followup_date?: string | null
          id?: number
          sentiment?: string | null
          summary: string
          type: string
        }
        Update: {
          client_id?: number
          created_at?: string
          date?: string
          employee?: string
          followup_date?: string | null
          id?: number
          sentiment?: string | null
          summary?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: number
          created_at: string
          description: string | null
          end_date: string | null
          id: number
          name: string
          start_date: string
          status: string
        }
        Insert: {
          client_id: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name: string
          start_date: string
          status: string
        }
        Update: {
          client_id?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_metrics: {
        Row: {
          client_id: number
          created_at: string
          date: string
          id: number
          overall_score: number
        }
        Insert: {
          client_id: number
          created_at?: string
          date?: string
          id?: number
          overall_score: number
        }
        Update: {
          client_id?: number
          created_at?: string
          date?: string
          id?: number
          overall_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
