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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      child_consents: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          child_id: string
          consent_text: string
          consent_version: string
          created_at: string
          guardian_id: string
          id: string
        }
        Insert: {
          accepted?: boolean
          accepted_at?: string | null
          child_id: string
          consent_text: string
          consent_version?: string
          created_at?: string
          guardian_id: string
          id?: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          child_id?: string
          consent_text?: string
          consent_version?: string
          created_at?: string
          guardian_id?: string
          id?: string
        }
        Relationships: []
      }
      child_digital_cards: {
        Row: {
          child_id: string
          created_at: string
          display_id: string
          id: string
          issued_at: string
          public_code: string
          revoked_at: string | null
          status: Database["public"]["Enums"]["digital_card_status"]
          updated_at: string
        }
        Insert: {
          child_id: string
          created_at?: string
          display_id: string
          id?: string
          issued_at?: string
          public_code: string
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["digital_card_status"]
          updated_at?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          display_id?: string
          id?: string
          issued_at?: string
          public_code?: string
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["digital_card_status"]
          updated_at?: string
        }
        Relationships: []
      }
      children: {
        Row: {
          address: string | null
          age: number | null
          birth_date: string | null
          created_at: string
          full_name: string
          guardian_id: string
          id: string
          nucleus: string
          school: string | null
          sports_interests: string[]
          status: Database["public"]["Enums"]["child_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          birth_date?: string | null
          created_at?: string
          full_name: string
          guardian_id: string
          id?: string
          nucleus: string
          school?: string | null
          sports_interests?: string[]
          status?: Database["public"]["Enums"]["child_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          birth_date?: string | null
          created_at?: string
          full_name?: string
          guardian_id?: string
          id?: string
          nucleus?: string
          school?: string | null
          sports_interests?: string[]
          status?: Database["public"]["Enums"]["child_status"]
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount_cents: number
          checkout_url: string | null
          club_id: string | null
          created_at: string
          currency: string
          customer_email: string | null
          external_reference: string
          id: string
          mercadopago_payment_id: string | null
          mercadopago_preapproval_id: string | null
          mercadopago_preference_id: string | null
          paid_at: string | null
          payment_method_id: string | null
          payment_type_id: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          raw_payment: Json | null
          recurring: boolean
          status: Database["public"]["Enums"]["donation_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          checkout_url?: string | null
          club_id?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          external_reference: string
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preapproval_id?: string | null
          mercadopago_preference_id?: string | null
          paid_at?: string | null
          payment_method_id?: string | null
          payment_type_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          raw_payment?: Json | null
          recurring?: boolean
          status?: Database["public"]["Enums"]["donation_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          checkout_url?: string | null
          club_id?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          external_reference?: string
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preapproval_id?: string | null
          mercadopago_preference_id?: string | null
          paid_at?: string | null
          payment_method_id?: string | null
          payment_type_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          raw_payment?: Json | null
          recurring?: boolean
          status?: Database["public"]["Enums"]["donation_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      guardians: {
        Row: {
          created_at: string
          document_number: string | null
          email: string | null
          full_name: string
          id: string
          phone: string
          relationship: Database["public"]["Enums"]["guardian_relationship"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone: string
          relationship?: Database["public"]["Enums"]["guardian_relationship"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          document_number?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          relationship?: Database["public"]["Enums"]["guardian_relationship"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      news_drafts: {
        Row: {
          call_to_action: string
          created_at: string
          generated_by: string
          id: string
          image_url: string | null
          published_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string
          social_relevance: string
          sources: string[]
          status: Database["public"]["Enums"]["news_status"]
          summary: string
          title: string
          topic: Database["public"]["Enums"]["news_topic"]
          updated_at: string
        }
        Insert: {
          call_to_action?: string
          created_at?: string
          generated_by?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug: string
          social_relevance?: string
          sources?: string[]
          status?: Database["public"]["Enums"]["news_status"]
          summary: string
          title: string
          topic?: Database["public"]["Enums"]["news_topic"]
          updated_at?: string
        }
        Update: {
          call_to_action?: string
          created_at?: string
          generated_by?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string
          social_relevance?: string
          sources?: string[]
          status?: Database["public"]["Enums"]["news_status"]
          summary?: string
          title?: string
          topic?: Database["public"]["Enums"]["news_topic"]
          updated_at?: string
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          donation_id: string | null
          event_id: string | null
          event_type: string | null
          id: string
          payload: Json
          processed_at: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          resource_id: string | null
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          resource_id?: string | null
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          resource_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          city: string
          club_id: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          profile_completed: boolean
          referral_code: string | null
          referred_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          supporter_card_id: string | null
          supporter_card_status: Database["public"]["Enums"]["supporter_card_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string
          club_id?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          profile_completed?: boolean
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          supporter_card_id?: string | null
          supporter_card_status?: Database["public"]["Enums"]["supporter_card_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string
          club_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          profile_completed?: boolean
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          supporter_card_id?: string | null
          supporter_card_status?: Database["public"]["Enums"]["supporter_card_status"]
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount_cents: number
          authorized_at: string | null
          cancelled_at: string | null
          created_at: string
          currency: string
          customer_email: string
          donation_id: string | null
          external_reference: string
          id: string
          mercadopago_preapproval_id: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          raw_preapproval: Json | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          authorized_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          donation_id?: string | null
          external_reference: string
          id?: string
          mercadopago_preapproval_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          raw_preapproval?: Json | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          authorized_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          donation_id?: string | null
          external_reference?: string
          id?: string
          mercadopago_preapproval_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          raw_preapproval?: Json | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_child_card: {
        Args: {
          _child_id: string
        }
        Returns: Database["public"]["Tables"]["child_digital_cards"]["Row"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_child_card: {
        Args: {
          _public_code: string
        }
        Returns: {
          display_id: string
          child_initials: string
          nucleus: string
          status: Database["public"]["Enums"]["digital_card_status"]
          issued_at: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      child_status: "pending_review" | "active" | "inactive" | "blocked"
      digital_card_status: "active" | "inactive" | "revoked"
      donation_status: "pending" | "approved" | "authorized" | "in_process" | "rejected" | "cancelled" | "refunded" | "charged_back" | "unknown"
      guardian_relationship: "mother" | "father" | "legal_guardian" | "other"
      news_status: "draft" | "approved" | "rejected" | "published"
      news_topic: "social_sports" | "selecao_brasileira" | "copa"
      payment_provider: "mercadopago"
      subscription_status: "pending" | "authorized" | "paused" | "cancelled" | "ended" | "unknown"
      supporter_card_status: "active" | "inactive" | "blocked"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      news_status: ["draft", "approved", "rejected", "published"],
      news_topic: ["social_sports", "selecao_brasileira", "copa", "futebol_nacional", "futebol_mundial", "esporte_social"],
    },
  },
} as const
