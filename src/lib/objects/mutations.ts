"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getObjectConfig } from "./config";
import type { FieldConfig } from "./types";

function coerceValue(field: FieldConfig, raw: FormDataEntryValue | null): unknown {
  if (raw === null || raw === "") return null;
  const str = String(raw);
  switch (field.type) {
    case "integer":
      return Number.isNaN(parseInt(str, 10)) ? null : parseInt(str, 10);
    case "number":
    case "currency":
      return Number.isNaN(parseFloat(str)) ? null : parseFloat(str);
    case "boolean":
      return str === "on" || str === "true";
    case "fk":
      return Number.isNaN(Number(str)) ? str : Number(str);
    default:
      return str;
  }
}

function friendlyError(message: string): string {
  if (message.includes("contactpersoon_klant_fkey")) {
    return "Deze contactpersoon hoort niet bij de geselecteerde klant.";
  }
  return message;
}

function buildPayload(fields: FieldConfig[], formData: FormData): Record<string, unknown> | string {
  for (const field of fields) {
    if (field.readOnly) continue;
    if (field.required) {
      const raw = formData.get(field.name);
      if (raw === null || raw === "") return `${field.label} is verplicht.`;
    }
  }

  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.readOnly) continue;
    const value = coerceValue(field, formData.get(field.name));
    if (value === null && !field.required) continue;
    payload[field.name] = value;
  }
  return payload;
}

export async function createRecord(slug: string, _prevState: string | undefined, formData: FormData) {
  const config = getObjectConfig(slug);
  if (!config) return "Onbekend object.";

  const payload = buildPayload(config.fields, formData);
  if (typeof payload === "string") return payload;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(config.table)
    .insert(payload)
    .select(config.primaryKey)
    .single();

  if (error) return friendlyError(error.message);

  revalidatePath(`/${slug}`);
  redirect(`/${slug}/${(data as unknown as Record<string, unknown>)[config.primaryKey]}`);
}

export async function updateRecord(
  slug: string,
  id: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  const config = getObjectConfig(slug);
  if (!config) return "Onbekend object.";

  const payload = buildPayload(config.fields, formData);
  if (typeof payload === "string") return payload;

  const supabase = await createClient();
  const { error } = await supabase.from(config.table).update(payload).eq(config.primaryKey, id);

  if (error) return friendlyError(error.message);

  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/${id}`);
  redirect(`/${slug}/${id}`);
}

export async function updateStatus(slug: string, id: string, statusField: string, newStatus: string) {
  const config = getObjectConfig(slug);
  if (!config) throw new Error("Onbekend object.");

  const supabase = await createClient();
  const { error } = await supabase
    .from(config.table)
    .update({ [statusField]: newStatus })
    .eq(config.primaryKey, id);

  if (error) throw new Error(error.message);

  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/${id}`);
  if (slug === "deals") revalidatePath("/deals/board");
}
