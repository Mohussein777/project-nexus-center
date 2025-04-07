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
      account_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
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
      employee_skills: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          skill: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          skill: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_skills_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          department: string
          email: string
          employee_id: string | null
          id: string
          join_date: string
          manager: string | null
          name: string
          phone: string | null
          position: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          employee_id?: string | null
          id?: string
          join_date?: string
          manager?: string | null
          name: string
          phone?: string | null
          position: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          employee_id?: string | null
          id?: string
          join_date?: string
          manager?: string | null
          name?: string
          phone?: string | null
          position?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_type: string
          client: string | null
          created_at: string
          credit: number | null
          date: string
          debit: number | null
          description: string | null
          id: string
          operation_type: string
          project_id: number | null
          project_name: string | null
          project_number: string | null
          recipient: string | null
          safe: string | null
        }
        Insert: {
          account_type: string
          client?: string | null
          created_at?: string
          credit?: number | null
          date: string
          debit?: number | null
          description?: string | null
          id?: string
          operation_type: string
          project_id?: number | null
          project_name?: string | null
          project_number?: string | null
          recipient?: string | null
          safe?: string | null
        }
        Update: {
          account_type?: string
          client?: string | null
          created_at?: string
          credit?: number | null
          date?: string
          debit?: number | null
          description?: string | null
          id?: string
          operation_type?: string
          project_id?: number | null
          project_name?: string | null
          project_number?: string | null
          recipient?: string | null
          safe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      leaves: {
        Row: {
          created_at: string
          employee_id: string | null
          end_date: string
          id: string
          reason: string | null
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      office_settings: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_employees: {
        Row: {
          assigned_at: string
          employee_id: string | null
          id: string
          project_id: number | null
          role: string
        }
        Insert: {
          assigned_at?: string
          employee_id?: string | null
          id?: string
          project_id?: number | null
          role: string
        }
        Update: {
          assigned_at?: string
          employee_id?: string | null
          id?: string
          project_id?: number | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_employees_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_financials: {
        Row: {
          balance_client: number | null
          created_at: string
          deserved_amount: number | null
          id: string
          notes: string | null
          project_id: number | null
          project_progress: number | null
          total_deal: number | null
          total_payment: number | null
          updated_at: string
        }
        Insert: {
          balance_client?: number | null
          created_at?: string
          deserved_amount?: number | null
          id?: string
          notes?: string | null
          project_id?: number | null
          project_progress?: number | null
          total_deal?: number | null
          total_payment?: number | null
          updated_at?: string
        }
        Update: {
          balance_client?: number | null
          created_at?: string
          deserved_amount?: number | null
          id?: string
          notes?: string | null
          project_id?: number | null
          project_progress?: number | null
          total_deal?: number | null
          total_payment?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_financials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
          priority: string | null
          progress: number | null
          project_number: string | null
          start_date: string
          status: string
          tag: string | null
        }
        Insert: {
          client_id: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name: string
          priority?: string | null
          progress?: number | null
          project_number?: string | null
          start_date: string
          status: string
          tag?: string | null
        }
        Update: {
          client_id?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          name?: string
          priority?: string | null
          progress?: number | null
          project_number?: string | null
          start_date?: string
          status?: string
          tag?: string | null
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
      safes: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
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
      task_dependencies: {
        Row: {
          created_at: string
          dependency_id: string | null
          id: string
          task_id: string | null
        }
        Insert: {
          created_at?: string
          dependency_id?: string | null
          id?: string
          task_id?: string | null
        }
        Update: {
          created_at?: string
          dependency_id?: string | null
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_dependency_id_fkey"
            columns: ["dependency_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          priority: string | null
          progress: number | null
          project_id: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          priority?: string | null
          progress?: number | null
          project_id?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          priority?: string | null
          progress?: number | null
          project_id?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string
          date: string
          description: string | null
          duration: number | null
          employee_id: string | null
          end_time: string | null
          id: string
          project_id: number | null
          start_time: string
          status: string
          task_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          duration?: number | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          project_id?: number | null
          start_time: string
          status?: string
          task_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          duration?: number | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          project_id?: number | null
          start_time?: string
          status?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          updated_at: string | null
          phone: string | null
          job_title: string | null
          bio: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          phone?: string | null
          job_title?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          phone?: string | null
          job_title?: string | null
          bio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
        Relationships: []
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
