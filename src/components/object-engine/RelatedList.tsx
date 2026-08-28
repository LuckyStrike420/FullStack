import Link from "next/link";
import { getObjectConfig } from "@/lib/objects/config";
import { getRelatedList } from "@/lib/objects/queries";
import type { RelatedListConfig } from "@/lib/objects/types";
import { FieldValue } from "./FieldRenderer";

export async function RelatedList({ relation, parentId }: { relation: RelatedListConfig; parentId: string }) {
  const childConfig = getObjectConfig(relation.object);
  if (!childConfig) return null;

  const rows = await getRelatedList(childConfig, relation.foreignKey, parentId);
  const columns = childConfig.fields.filter((f) => f.listVisible);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <h3 className="text-sm font-semibold text-slate-700">
          {relation.label} <span className="font-normal text-slate-400">({rows.length})</span>
        </h3>
        <Link
          href={`/${childConfig.slug}/new?${relation.foreignKey}=${parentId}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          + Nieuw
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-slate-400">Geen gerelateerde records.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((f) => (
                  <th key={f.name} className="whitespace-nowrap px-4 py-1.5 text-left font-medium text-slate-500">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={String(row[childConfig.primaryKey])} className="hover:bg-slate-50">
                  {columns.map((f, i) => (
                    <td key={f.name} className="whitespace-nowrap px-4 py-1.5">
                      {i === 0 ? (
                        <Link
                          href={`/${childConfig.slug}/${row[childConfig.primaryKey]}`}
                          className="text-blue-600 hover:underline"
                        >
                          <FieldValue field={f} record={row} linkFk={false} />
                        </Link>
                      ) : (
                        <FieldValue field={f} record={row} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
