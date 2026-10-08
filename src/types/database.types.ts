export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          organization: string
          published: boolean
          title: string
          updated_at: string
          verified: boolean
          year: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          organization: string
          published?: boolean
          title: string
          updated_at?: string
          verified?: boolean
          year?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          organization?: string
          published?: boolean
          title?: string
          updated_at?: string
          verified?: boolean
          year?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          category: string
          content: string | null
          created_at: string
          date: string | null
          display_order: number
          excerpt: string | null
          id: string
          published_at: string | null
          read_time: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string
          date?: string | null
          display_order?: number
          excerpt?: string | null
          id?: string
          published_at?: string | null
          read_time?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          date?: string | null
          display_order?: number
          excerpt?: string | null
          id?: string
          published_at?: string | null
          read_time?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read_at: string | null
          replied_at: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read_at?: string | null
          replied_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read_at?: string | null
          replied_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          display_order: number
          field: string
          id: string
          institution: string
          published: boolean
          status: string
          updated_at: string
          year: string | null
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          display_order?: number
          field: string
          id?: string
          institution: string
          published?: boolean
          status?: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          display_order?: number
          field?: string
          id?: string
          institution?: string
          published?: boolean
          status?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      experience_achievements: {
        Row: {
          achievement: string
          created_at: string
          display_order: number
          experience_id: string
          id: string
        }
        Insert: {
          achievement: string
          created_at?: string
          display_order?: number
          experience_id: string
          id?: string
        }
        Update: {
          achievement?: string
          created_at?: string
          display_order?: number
          experience_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_achievements_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_responsibilities: {
        Row: {
          created_at: string
          display_order: number
          experience_id: string
          id: string
          responsibility: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          experience_id: string
          id?: string
          responsibility: string
        }
        Update: {
          created_at?: string
          display_order?: number
          experience_id?: string
          id?: string
          responsibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_responsibilities_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_skills: {
        Row: {
          created_at: string
          display_order: number
          experience_id: string
          id: string
          skill: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          experience_id: string
          id?: string
          skill: string
        }
        Update: {
          created_at?: string
          display_order?: number
          experience_id?: string
          id?: string
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_skills_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string
          current: boolean
          display_order: number
          id: string
          organization: string
          period: string | null
          published: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current?: boolean
          display_order?: number
          id?: string
          organization: string
          period?: string | null
          published?: boolean
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current?: boolean
          display_order?: number
          id?: string
          organization?: string
          period?: string | null
          published?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt: string
          category: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          published: boolean
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          alt: string
          category: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          published?: boolean
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          alt?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          published?: boolean
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt: string
          caption: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          published: boolean
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          alt: string
          caption?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          published?: boolean
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          alt?: string
          caption?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          published?: boolean
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          linkedin: string | null
          location: string | null
          professional_name: string | null
          profile_image_url: string | null
          statement: string | null
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          linkedin?: string | null
          location?: string | null
          professional_name?: string | null
          profile_image_url?: string | null
          statement?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          linkedin?: string | null
          location?: string | null
          professional_name?: string | null
          profile_image_url?: string | null
          statement?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_videos: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          poster_url: string | null
          published: boolean
          storage_path: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          poster_url?: string | null
          published?: boolean
          storage_path?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          poster_url?: string | null
          published?: boolean
          storage_path?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_form_enabled: boolean
          id: string
          maintenance_mode: boolean
          site_description: string | null
          site_title: string | null
          updated_at: string
        }
        Insert: {
          contact_form_enabled?: boolean
          id?: string
          maintenance_mode?: boolean
          site_description?: string | null
          site_title?: string | null
          updated_at?: string
        }
        Update: {
          contact_form_enabled?: boolean
          id?: string
          maintenance_mode?: boolean
          site_description?: string | null
          site_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          category: string
          created_at: string
          display_order: number
          icon: string | null
          id: string
          published: boolean
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          published?: boolean
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string
          created_at: string
          display_order: number
          id: string
          name: string
          published: boolean
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          display_order?: number
          id?: string
          name: string
          published?: boolean
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          published?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          organization: string
          published: boolean
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          organization: string
          published?: boolean
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          organization?: string
          published?: boolean
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
