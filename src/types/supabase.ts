
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  phone: string | null;
  job_title: string | null;
  bio: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Re-export the types from our Database definition to avoid circular imports
export type { Database } from '@/integrations/supabase/supabase-types';
