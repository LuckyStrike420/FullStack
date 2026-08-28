import Link from "next/link";
import { isEnumField, type ObjectConfig } from "@/lib/objects/types";
import type { RowWithLabels } from "@/lib/objects/queries";
import { FieldValue } from "./FieldRenderer";
import { StatusChangeControl } from "./StatusChangeControl";
import { RelatedList } from "./RelatedList";

export function RecordDetail({ config, record }: { config: ObjectConfig; record: RowWithLabels }) {
  const id = String(record[config.primaryKey]);
  const title =
    config.titleField === config.primaryKey
      ? `${config.labelSingular} #${id}`
      : String(record[config.titleField] ?? id);

  const statusField = config.fields.find((f) => isEnumField(f) && f.isStatusField);
  const detailFields = config.fields.filter((f) => f !== statusField);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{config.labelSingular}</p>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {statusField && isEnumField(statusField) && (
            <StatusChangeControl
              slug={config.slug}
              id={id}
              field={statusField}
              currentValue={String(record[statusField.name])}
            />
          )}
          <Link
            href={`/${config.slug}/${id}/edit`}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Bewerken
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        {detailFields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{f.label}</span>
            <div className="text-sm text-slate-900">
              <FieldValue field={f} record={record} />
            </div>
          </div>
        ))}
      </div>

      {config.relatedLists && config.relatedLists.length > 0 && (
        <div className="flex flex-col gap-4">
          {config.relatedLists.map((relation) => (
            <RelatedList key={`${relation.object}-${relation.foreignKey}`} relation={relation} parentId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
