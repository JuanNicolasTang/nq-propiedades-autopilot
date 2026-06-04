import type { LeadStatus } from "./leads";
import type { ShowingStatus } from "./showings";

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          property_slug: string;
          full_name: string;
          phone: string;
          email: string | null;
          budget_range: string | null;
          financing_status: string | null;
          purchase_timeline: string | null;
          wants_visit_this_week: boolean;
          message: string | null;
          status: LeadStatus;
          score: number;
          source: string;
          consent: boolean;
          created_at: string;
        };
        Insert: {
          property_slug: string;
          full_name: string;
          phone: string;
          email?: string | null;
          budget_range?: string | null;
          financing_status?: string | null;
          purchase_timeline?: string | null;
          wants_visit_this_week?: boolean;
          message?: string | null;
          status?: LeadStatus;
          score?: number;
          source?: string;
          consent: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      lead_events: {
        Row: {
          id: string;
          lead_id: string;
          event_type: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          lead_id: string;
          event_type: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lead_events"]["Insert"]>;
      };
      showings: {
        Row: {
          id: string;
          lead_id: string;
          property_slug: string;
          scheduled_at: string;
          status: ShowingStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          lead_id: string;
          property_slug: string;
          scheduled_at: string;
          status?: ShowingStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["showings"]["Insert"]>;
      };
    };
  };
};
