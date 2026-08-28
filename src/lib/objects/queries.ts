import { createClient } from "@/lib/supabase/server";
import { getObjectConfig } from "./config";
import { isFkField, type ObjectConfig } from "./types";

export type RowRecord = Record<string, unknown>;
export type RowWithLabels = RowRecord & { __labels: Record<string, string> };

async function attachFkLabels(config: ObjectConfig, rows: RowRecord[]): Promise<RowWithLabels[]> {
  const fkFields = config.fields.filter(isFkField);
  if (fkFields.length === 0 || rows.length === 0) {
    return rows.map((r) => ({ ...r, __labels: {} }));
  }

  const supabase = await createClient();
  const labelMaps: Record<string, Map<string, string>> = {};

  await Promise.all(
    fkFields.map(async (field) => {
      const refConfig = getObjectConfig(field.references);
      if (!refConfig) return;

      const ids = Array.from(
        new Set(
          rows
            .map((r) => r[field.name])
            .filter((v): v is string | number => v !== null && v !== undefined),
        ),
      );
      const map = new Map<string, string>();
      labelMaps[field.name] = map;
      if (ids.length === 0) return;

      const columns = Array.from(new Set([refConfig.primaryKey, field.labelField])).join(", ");
      const { data } = await supabase.from(refConfig.table).select(columns).in(refConfig.primaryKey, ids);
      for (const row of (data ?? []) as unknown as RowRecord[]) {
        map.set(String(row[refConfig.primaryKey]), String(row[field.labelField] ?? ""));
      }
    }),
  );

  return rows.map((r) => {
    const labels: Record<string, string> = {};
    for (const field of fkFields) {
      const id = r[field.name];
      if (id !== null && id !== undefined) {
        labels[field.name] = labelMaps[field.name]?.get(String(id)) ?? String(id);
      }
    }
    return { ...r, __labels: labels };
  });
}

export async function listRecords(
  config: ObjectConfig,
  opts: { search?: string; filters?: Record<string, string> } = {},
): Promise<RowWithLabels[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order(config.defaultSort.field, { ascending: config.defaultSort.dir === "asc" });

  if (error) throw new Error(error.message);

  let rows = await attachFkLabels(config, data ?? []);

  if (opts.filters) {
    for (const [key, value] of Object.entries(opts.filters)) {
      if (!value) continue;
      rows = rows.filter((r) => String(r[key]) === value);
    }
  }

  if (opts.search) {
    const term = opts.search.toLowerCase();
    const searchableFields = config.fields.filter((f) => f.searchable);
    rows = rows.filter((r) =>
      searchableFields.some((f) => {
        const value = isFkField(f) ? r.__labels[f.name] : r[f.name];
        return String(value ?? "").toLowerCase().includes(term);
      }),
    );
  }

  return rows;
}

export async function getRecord(config: ObjectConfig, id: string): Promise<RowWithLabels | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .eq(config.primaryKey, id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const [withLabels] = await attachFkLabels(config, [data]);
  return withLabels;
}

export async function getRelatedList(
  childConfig: ObjectConfig,
  foreignKey: string,
  parentId: string,
): Promise<RowWithLabels[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(childConfig.table)
    .select("*")
    .eq(foreignKey, parentId)
    .order(childConfig.defaultSort.field, { ascending: childConfig.defaultSort.dir === "asc" });

  if (error) throw new Error(error.message);
  return attachFkLabels(childConfig, data ?? []);
}

export interface FkOption {
  value: string;
  label: string;
  /** Value of `groupColumn` for this row, when listFkOptions was asked to include one. */
  groupValue?: string;
}

export async function listFkOptions(
  refConfig: ObjectConfig,
  labelField: string,
  groupColumn?: string,
): Promise<FkOption[]> {
  const supabase = await createClient();
  const columns = Array.from(
    new Set([refConfig.primaryKey, labelField, ...(groupColumn ? [groupColumn] : [])]),
  ).join(", ");
  const { data, error } = await supabase
    .from(refConfig.table)
    .select(columns)
    .order(refConfig.defaultSort.field, { ascending: refConfig.defaultSort.dir === "asc" });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as RowRecord[]).map((row) => {
    const label =
      refConfig.titleField === refConfig.primaryKey
        ? `${refConfig.labelSingular} #${row[refConfig.primaryKey]}`
        : String(row[labelField] ?? row[refConfig.primaryKey]);
    return {
      value: String(row[refConfig.primaryKey]),
      label,
      groupValue: groupColumn ? String(row[groupColumn] ?? "") : undefined,
    };
  });
}
