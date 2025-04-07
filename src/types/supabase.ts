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

// Add custom Database type to extend Supabase's Database type
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Omit<Profile, 'updated_at'> & { updated_at?: string };
          Update: Partial<Profile>;
        };
        notifications: {
          Row: Notification;
          Insert: Omit<Notification, 'created_at'> & { created_at?: string };
          Update: Partial<Notification>;
        };
        // Keep other tables as defined in the original Database type
      }
    }
  }
}
