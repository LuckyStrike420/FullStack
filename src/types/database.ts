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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      assemblage_verbruik: {
        Row: {
          aantal_verbruikt: number
          assemblage_id: number
          created_at: string
          id: number
          ontvangst_id: number
        }
        Insert: {
          aantal_verbruikt: number
          assemblage_id: number
          created_at?: string
          id?: never
          ontvangst_id: number
        }
        Update: {
          aantal_verbruikt?: number
          assemblage_id?: number
          created_at?: string
          id?: never
          ontvangst_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "assemblage_verbruik_assemblage_id_fkey"
            columns: ["assemblage_id"]
            isOneToOne: false
            referencedRelation: "assemblages"
            referencedColumns: ["assemblage_id"]
          },
          {
            foreignKeyName: "assemblage_verbruik_ontvangst_id_fkey"
            columns: ["ontvangst_id"]
            isOneToOne: false
            referencedRelation: "ontvangsten"
            referencedColumns: ["ontvangst_id"]
          },
        ]
      }
      assemblages: {
        Row: {
          aantal_geproduceerd: number
          assemblage_id: number
          created_at: string
          datum: string
          eindproduct_id: number
          status: string
        }
        Insert: {
          aantal_geproduceerd: number
          assemblage_id?: never
          created_at?: string
          datum?: string
          eindproduct_id: number
          status?: string
        }
        Update: {
          aantal_geproduceerd?: number
          assemblage_id?: never
          created_at?: string
          datum?: string
          eindproduct_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "assemblages_eindproduct_id_fkey"
            columns: ["eindproduct_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
        ]
      }
      betalingen: {
        Row: {
          bedrag: number
          betaling_id: number
          created_at: string
          datum_doorgestuurd: string | null
          datum_ontvangen: string | null
          po_id: number
          status: string
          type: string
          valuta: string
        }
        Insert: {
          bedrag: number
          betaling_id?: never
          created_at?: string
          datum_doorgestuurd?: string | null
          datum_ontvangen?: string | null
          po_id: number
          status?: string
          type: string
          valuta: string
        }
        Update: {
          bedrag?: number
          betaling_id?: never
          created_at?: string
          datum_doorgestuurd?: string | null
          datum_ontvangen?: string | null
          po_id?: number
          status?: string
          type?: string
          valuta?: string
        }
        Relationships: [
          {
            foreignKeyName: "betalingen_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "inkooporders"
            referencedColumns: ["po_id"]
          },
        ]
      }
      contactpersonen: {
        Row: {
          contactpersoon_id: number
          created_at: string
          email: string | null
          functie: string | null
          hoofdcontact: boolean
          klant_id: number
          naam: string
          notities: string | null
          telefoon: string | null
        }
        Insert: {
          contactpersoon_id?: never
          created_at?: string
          email?: string | null
          functie?: string | null
          hoofdcontact?: boolean
          klant_id: number
          naam: string
          notities?: string | null
          telefoon?: string | null
        }
        Update: {
          contactpersoon_id?: never
          created_at?: string
          email?: string | null
          functie?: string | null
          hoofdcontact?: boolean
          klant_id?: number
          naam?: string
          notities?: string | null
          telefoon?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contactpersonen_klant_id_fkey"
            columns: ["klant_id"]
            isOneToOne: false
            referencedRelation: "klanten"
            referencedColumns: ["klant_id"]
          },
        ]
      }
      container_regels: {
        Row: {
          aantal: number
          container_id: number
          created_at: string
          id: number
          po_regel_id: number
        }
        Insert: {
          aantal: number
          container_id: number
          created_at?: string
          id?: never
          po_regel_id: number
        }
        Update: {
          aantal?: number
          container_id?: number
          created_at?: string
          id?: never
          po_regel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "container_regels_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["container_id"]
          },
          {
            foreignKeyName: "container_regels_po_regel_id_fkey"
            columns: ["po_regel_id"]
            isOneToOne: false
            referencedRelation: "inkooporder_regels"
            referencedColumns: ["po_regel_id"]
          },
        ]
      }
      containers: {
        Row: {
          container_id: number
          containernummer: string
          created_at: string
          eta: string | null
          etd: string | null
          status: string
        }
        Insert: {
          container_id?: never
          containernummer: string
          created_at?: string
          eta?: string | null
          etd?: string | null
          status?: string
        }
        Update: {
          container_id?: never
          containernummer?: string
          created_at?: string
          eta?: string | null
          etd?: string | null
          status?: string
        }
        Relationships: []
      }
      deal_regels: {
        Row: {
          created_at: string
          deal_id: number
          deal_regel_id: number
          maat: string | null
          product_id: number
          verwacht_aantal: number
        }
        Insert: {
          created_at?: string
          deal_id: number
          deal_regel_id?: never
          maat?: string | null
          product_id: number
          verwacht_aantal: number
        }
        Update: {
          created_at?: string
          deal_id?: number
          deal_regel_id?: never
          maat?: string | null
          product_id?: number
          verwacht_aantal?: number
        }
        Relationships: [
          {
            foreignKeyName: "deal_regels_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deal_regels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
        ]
      }
      deals: {
        Row: {
          contactpersoon_id: number | null
          created_at: string
          deal_id: number
          incoterm: string
          klant_id: number
          stage: string
          verwachte_afsluitdatum: string | null
          verwachte_waarde: number | null
        }
        Insert: {
          contactpersoon_id?: number | null
          created_at?: string
          deal_id?: never
          incoterm: string
          klant_id: number
          stage?: string
          verwachte_afsluitdatum?: string | null
          verwachte_waarde?: number | null
        }
        Update: {
          contactpersoon_id?: number | null
          created_at?: string
          deal_id?: never
          incoterm?: string
          klant_id?: number
          stage?: string
          verwachte_afsluitdatum?: string | null
          verwachte_waarde?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contactpersoon_klant_fkey"
            columns: ["contactpersoon_id", "klant_id"]
            isOneToOne: false
            referencedRelation: "contactpersonen"
            referencedColumns: ["contactpersoon_id", "klant_id"]
          },
          {
            foreignKeyName: "deals_klant_id_fkey"
            columns: ["klant_id"]
            isOneToOne: false
            referencedRelation: "klanten"
            referencedColumns: ["klant_id"]
          },
        ]
      }
      inkooporder_regels: {
        Row: {
          aantal: number
          created_at: string
          maat: string | null
          po_id: number
          po_regel_id: number
          prijs_per_stuk: number
          product_id: number
          valuta: string
        }
        Insert: {
          aantal: number
          created_at?: string
          maat?: string | null
          po_id: number
          po_regel_id?: never
          prijs_per_stuk: number
          product_id: number
          valuta: string
        }
        Update: {
          aantal?: number
          created_at?: string
          maat?: string | null
          po_id?: number
          po_regel_id?: never
          prijs_per_stuk?: number
          product_id?: number
          valuta?: string
        }
        Relationships: [
          {
            foreignKeyName: "inkooporder_regels_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "inkooporders"
            referencedColumns: ["po_id"]
          },
          {
            foreignKeyName: "inkooporder_regels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
        ]
      }
      inkooporders: {
        Row: {
          created_at: string
          incoterm: string
          leadtime_weken: number | null
          leverancier_id: number
          orderdatum: string
          po_id: number
          status: string
        }
        Insert: {
          created_at?: string
          incoterm: string
          leadtime_weken?: number | null
          leverancier_id: number
          orderdatum?: string
          po_id?: never
          status?: string
        }
        Update: {
          created_at?: string
          incoterm?: string
          leadtime_weken?: number | null
          leverancier_id?: number
          orderdatum?: string
          po_id?: never
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inkooporders_leverancier_id_fkey"
            columns: ["leverancier_id"]
            isOneToOne: false
            referencedRelation: "leveranciers"
            referencedColumns: ["leverancier_id"]
          },
        ]
      }
      klanten: {
        Row: {
          btw_nummer: string | null
          created_at: string
          klant_id: number
          kvk_nummer: string | null
          land: string
          naam: string
          plaats: string | null
          postcode: string | null
          straat: string | null
          telefoon: string | null
          website: string | null
        }
        Insert: {
          btw_nummer?: string | null
          created_at?: string
          klant_id?: never
          kvk_nummer?: string | null
          land: string
          naam: string
          plaats?: string | null
          postcode?: string | null
          straat?: string | null
          telefoon?: string | null
          website?: string | null
        }
        Update: {
          btw_nummer?: string | null
          created_at?: string
          klant_id?: never
          kvk_nummer?: string | null
          land?: string
          naam?: string
          plaats?: string | null
          postcode?: string | null
          straat?: string | null
          telefoon?: string | null
          website?: string | null
        }
        Relationships: []
      }
      leveranciers: {
        Row: {
          created_at: string
          land: string
          leverancier_id: number
          naam: string
        }
        Insert: {
          created_at?: string
          land: string
          leverancier_id?: never
          naam: string
        }
        Update: {
          created_at?: string
          land?: string
          leverancier_id?: never
          naam?: string
        }
        Relationships: []
      }
      matching: {
        Row: {
          aantal_toegewezen: number
          created_at: string
          id: number
          po_regel_id: number
          so_regel_id: number
        }
        Insert: {
          aantal_toegewezen: number
          created_at?: string
          id?: never
          po_regel_id: number
          so_regel_id: number
        }
        Update: {
          aantal_toegewezen?: number
          created_at?: string
          id?: never
          po_regel_id?: number
          so_regel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "matching_po_regel_id_fkey"
            columns: ["po_regel_id"]
            isOneToOne: false
            referencedRelation: "inkooporder_regels"
            referencedColumns: ["po_regel_id"]
          },
          {
            foreignKeyName: "matching_so_regel_id_fkey"
            columns: ["so_regel_id"]
            isOneToOne: false
            referencedRelation: "verkooporder_regels"
            referencedColumns: ["so_regel_id"]
          },
        ]
      }
      ontvangsten: {
        Row: {
          aantal_ontvangen: number
          created_at: string
          houdbaarheidsdatum: string | null
          lotnummer: string
          ontvangst_id: number
          ontvangstdatum: string
          po_regel_id: number
        }
        Insert: {
          aantal_ontvangen: number
          created_at?: string
          houdbaarheidsdatum?: string | null
          lotnummer: string
          ontvangst_id?: never
          ontvangstdatum?: string
          po_regel_id: number
        }
        Update: {
          aantal_ontvangen?: number
          created_at?: string
          houdbaarheidsdatum?: string | null
          lotnummer?: string
          ontvangst_id?: never
          ontvangstdatum?: string
          po_regel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ontvangsten_po_regel_id_fkey"
            columns: ["po_regel_id"]
            isOneToOne: false
            referencedRelation: "inkooporder_regels"
            referencedColumns: ["po_regel_id"]
          },
        ]
      }
      producten: {
        Row: {
          created_at: string
          heeft_maten: boolean
          naam: string
          product_id: number
          type: string
        }
        Insert: {
          created_at?: string
          heeft_maten?: boolean
          naam: string
          product_id?: never
          type: string
        }
        Update: {
          created_at?: string
          heeft_maten?: boolean
          naam?: string
          product_id?: never
          type?: string
        }
        Relationships: []
      }
      recepturen: {
        Row: {
          aantal_per_eenheid: number
          component_id: number
          created_at: string
          eindproduct_id: number
          receptuur_id: number
        }
        Insert: {
          aantal_per_eenheid: number
          component_id: number
          created_at?: string
          eindproduct_id: number
          receptuur_id?: never
        }
        Update: {
          aantal_per_eenheid?: number
          component_id?: number
          created_at?: string
          eindproduct_id?: number
          receptuur_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "recepturen_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "recepturen_eindproduct_id_fkey"
            columns: ["eindproduct_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
        ]
      }
      verkooporder_regels: {
        Row: {
          aantal: number
          created_at: string
          maat: string | null
          prijs_per_stuk: number
          product_id: number
          so_id: number
          so_regel_id: number
          valuta: string
        }
        Insert: {
          aantal: number
          created_at?: string
          maat?: string | null
          prijs_per_stuk: number
          product_id: number
          so_id: number
          so_regel_id?: never
          valuta: string
        }
        Update: {
          aantal?: number
          created_at?: string
          maat?: string | null
          prijs_per_stuk?: number
          product_id?: number
          so_id?: number
          so_regel_id?: never
          valuta?: string
        }
        Relationships: [
          {
            foreignKeyName: "verkooporder_regels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "verkooporder_regels_so_id_fkey"
            columns: ["so_id"]
            isOneToOne: false
            referencedRelation: "verkooporders"
            referencedColumns: ["so_id"]
          },
        ]
      }
      verkooporders: {
        Row: {
          contactpersoon_id: number | null
          created_at: string
          deal_id: number | null
          incoterm: string
          klant_id: number
          orderdatum: string
          so_id: number
          status: string
        }
        Insert: {
          contactpersoon_id?: number | null
          created_at?: string
          deal_id?: number | null
          incoterm: string
          klant_id: number
          orderdatum?: string
          so_id?: never
          status?: string
        }
        Update: {
          contactpersoon_id?: number | null
          created_at?: string
          deal_id?: number | null
          incoterm?: string
          klant_id?: number
          orderdatum?: string
          so_id?: never
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "verkooporders_contactpersoon_klant_fkey"
            columns: ["contactpersoon_id", "klant_id"]
            isOneToOne: false
            referencedRelation: "contactpersonen"
            referencedColumns: ["contactpersoon_id", "klant_id"]
          },
          {
            foreignKeyName: "verkooporders_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "verkooporders_klant_id_fkey"
            columns: ["klant_id"]
            isOneToOne: false
            referencedRelation: "klanten"
            referencedColumns: ["klant_id"]
          },
        ]
      }
      verzendingen: {
        Row: {
          aantal_verzonden: number
          created_at: string
          so_regel_id: number
          verzenddatum: string
          verzending_id: number
        }
        Insert: {
          aantal_verzonden: number
          created_at?: string
          so_regel_id: number
          verzenddatum?: string
          verzending_id?: never
        }
        Update: {
          aantal_verzonden?: number
          created_at?: string
          so_regel_id?: number
          verzenddatum?: string
          verzending_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "verzendingen_so_regel_id_fkey"
            columns: ["so_regel_id"]
            isOneToOne: false
            referencedRelation: "verkooporder_regels"
            referencedColumns: ["so_regel_id"]
          },
        ]
      }
      voorraadmutaties: {
        Row: {
          aantal: number
          bron_id: number
          bron_type: string
          created_at: string
          datum: string
          id: number
          maat: string | null
          product_id: number
          richting: string
        }
        Insert: {
          aantal: number
          bron_id: number
          bron_type: string
          created_at?: string
          datum?: string
          id?: never
          maat?: string | null
          product_id: number
          richting: string
        }
        Update: {
          aantal?: number
          bron_id?: number
          bron_type?: string
          created_at?: string
          datum?: string
          id?: never
          maat?: string | null
          product_id?: number
          richting?: string
        }
        Relationships: [
          {
            foreignKeyName: "voorraadmutaties_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
        ]
      }
    }
    Views: {
      voorraad_actueel: {
        Row: {
          maat: string | null
          product_id: number | null
          voorraad: number | null
        }
        Relationships: [
          {
            foreignKeyName: "voorraadmutaties_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "producten"
            referencedColumns: ["product_id"]
          },
        ]
      }
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
    Enums: {},
  },
} as const
