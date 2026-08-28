import { notFound } from "next/navigation";
import { getObjectConfig } from "@/lib/objects/config";
import { listFkOptions, type FkOption } from "@/lib/objects/queries";
import { isFkField } from "@/lib/objects/types";
import { RecordForm } from "@/components/object-engine/RecordForm";

export default async function NewRecordPage({
  params,
  searchParams,
}: {
  params: Promise<{ object: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { object } = await params;
  const config = getObjectConfig(object);
  if (!config || config.listOnly) notFound();

  const sp = await searchParams;
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
      <h1 className="text-lg font-semibold text-slate-900">Nieuw: {config.labelSingular}</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <RecordForm config={config} mode="create" initialValues={sp} fkOptions={fkOptions} />
      </div>
    </div>
  );
}
