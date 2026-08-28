import { notFound } from "next/navigation";
import { getObjectConfig } from "@/lib/objects/config";
import { listRecords } from "@/lib/objects/queries";
import { ListView } from "@/components/object-engine/ListView";
import { ListViewToolbar } from "@/components/object-engine/ListViewToolbar";

export default async function ObjectListPage({
  params,
  searchParams,
}: {
  params: Promise<{ object: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { object } = await params;
  const config = getObjectConfig(object);
  if (!config) notFound();

  const sp = await searchParams;
  const { q, ...filters } = sp;
  const rows = await listRecords(config, { search: q, filters: filters as Record<string, string> });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-slate-900">{config.labelPlural}</h1>
      <ListViewToolbar config={config} searchParams={sp} />
      <ListView config={config} rows={rows} />
    </div>
  );
}
