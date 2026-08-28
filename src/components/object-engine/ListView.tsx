import Link from "next/link";
import type { ObjectConfig } from "@/lib/objects/types";
import type { RowWithLabels } from "@/lib/objects/queries";
import { FieldValue } from "./FieldRenderer";

export function ListView({ config, rows }: { config: ObjectConfig; rows: RowWithLabels[] }) {
  const columns = config.fields.filter((f) => f.listVisible);
  const showIdColumn = config.titleField === config.primaryKey && !config.listOnly;
  const totalColumns = columns.length + (showIdColumn ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {showIdColumn && (
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-500">#</th>
            )}
            {columns.map((f) => (
              <th key={f.name} className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-500">
                {f.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const id = row[config.primaryKey];
            return (
              <tr key={String(id)} className="hover:bg-slate-50">
                {showIdColumn && (
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-blue-600">
                    <Link href={`/${config.slug}/${id}`} className="hover:underline">
                      #{String(id)}
                    </Link>
                  </td>
                )}
                {columns.map((f, i) => (
                  <td key={f.name} className="whitespace-nowrap px-4 py-2">
                    {!showIdColumn && i === 0 && !config.listOnly ? (
                      <Link href={`/${config.slug}/${id}`} className="font-medium text-blue-600 hover:underline">
                        <FieldValue field={f} record={row} linkFk={false} />
                      </Link>
                    ) : (
                      <FieldValue field={f} record={row} />
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={totalColumns} className="px-4 py-10 text-center text-slate-400">
                Geen resultaten.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
