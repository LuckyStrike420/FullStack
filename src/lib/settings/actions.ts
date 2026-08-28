"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateAppSettings(_prevState: string | undefined, formData: FormData) {
  const raw = String(formData.get("logo_url") ?? "").trim();
  const logoUrl = raw === "" ? null : raw;

  const supabase = await createClient();
  const { error } = await supabase.from("app_instellingen").update({ logo_url: logoUrl }).eq("id", true);

  if (error) return "Opslaan van instellingen is mislukt.";

  revalidatePath("/", "layout");
  return undefined;
}
