"use server";

import { OBJECTS } from "@/lib/objects/config";
import { listRecords } from "@/lib/objects/queries";

export interface SearchResultItem {
  id: string;
  label: string;
}

export interface SearchResultGroup {
  slug: string;
  labelPlural: string;
  items: SearchResultItem[];
}

const SEARCHABLE_OBJECTS = OBJECTS.filter((o) => o.showInNav && o.fields.some((f) => f.searchable));

export async function globalSearch(term: string): Promise<SearchResultGroup[]> {
  const q = term.trim();
  if (q.length < 2) return [];

  const groups = await Promise.all(
    SEARCHABLE_OBJECTS.map(async (config): Promise<SearchResultGroup | null> => {
      const rows = await listRecords(config, { search: q });
      if (rows.length === 0) return null;

      return {
        slug: config.slug,
        labelPlural: config.labelPlural,
        items: rows.slice(0, 5).map((r) => ({
          id: String(r[config.primaryKey]),
          label: String(r.__labels[config.titleField] ?? r[config.titleField] ?? r[config.primaryKey]),
        })),
      };
    }),
  );

  return groups.filter((g): g is SearchResultGroup => g !== null);
}
