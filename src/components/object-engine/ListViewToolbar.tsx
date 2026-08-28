import Link from "next/link";
import { isEnumField, type ObjectConfig } from "@/lib/objects/types";

export function ListViewToolbar({
  config,
  searchParams,
}: {
  config: ObjectConfig;
  searchParams: Record<string, string | undefined>;
}) {
  const filterFields = config.fields.filter((f) => f.filterable && isEnumField(f));

  return (
    <form method="GET" className="mb-4 flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="q" className="text-xs font-medium text-slate-500">
          Zoeken
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={searchParams.q ?? ""}
          placeholder={`Zoek in ${config.labelPlural.toLowerCase()}…`}
          className="w-64 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {filterFields.map((f) =>
        isEnumField(f) ? (
          <div key={f.name} className="flex flex-col gap-1">
            <label htmlFor={f.name} className="text-xs font-medium text-slate-500">
              {f.label}
            </label>
            <select
              id={f.name}
              name={f.name}
              defaultValue={searchParams[f.name] ?? ""}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Alle</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ) : null,
      )}

      <button
        type="submit"
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Filteren
      </button>

      {(searchParams.q || Object.keys(searchParams).some((k) => k !== "q" && searchParams[k])) && (
        <Link
          href={`/${config.slug}`}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Wissen
        </Link>
      )}

      {!config.listOnly && (
        <Link
          href={`/${config.slug}/new`}
          className="ml-auto rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + Nieuw
        </Link>
      )}
    </form>
  );
}
