import { createClient } from "@/lib/supabase/server";

export interface AppSettings {
  logoUrl: string | null;
}

export async function getAppSettings(): Promise<AppSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("app_instellingen").select("logo_url").eq("id", true).maybeSingle();
  return { logoUrl: (data as { logo_url: string | null } | null)?.logo_url ?? null };
}
