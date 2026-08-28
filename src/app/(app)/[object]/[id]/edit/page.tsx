import { notFound } from "next/navigation";
import { getObjectConfig } from "@/lib/objects/config";
import { getRecord, listFkOptions, type FkOption } from "@/lib/objects/queries";
import { isFkField } from "@/lib/objects/types";
import { RecordForm } from "@/components/object-engine/RecordForm";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ object: string; id: string }>;
}) {
  const { object, id } = await params;
  const config = getObjectConfig(object);
  if (!config || config.listOnly || !/^\d+$/.test(id)) notFound();

  const record = await getRecord(config, id);
  if (!record) notFound();

  const fkFields = config.fields.filter(isFkField);
  const fkOptions: Record<string, FkOption[]> = {};
  await Promise.all(
    fkFields.map(async (f) => {
      const refConfig = getObjectConfig(f.references);
      if (!refConfig) return;
      fkOptions[f.name] = await listFkOptions(refConfig, f.labelField, f.dependsOnField);
    }),
  );

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-lg font-semibold text-slate-900">
        Bewerken: {config.labelSingular} #{id}
      </h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <RecordForm
          config={config}
          mode="edit"
          recordId={id}
          initialValues={record}
          fkOptions={fkOptions}
        />
      </div>
    </div>
  );
}
