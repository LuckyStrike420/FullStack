import { notFound } from "next/navigation";
import { getObjectConfig } from "@/lib/objects/config";
import { getRecord } from "@/lib/objects/queries";
import { RecordDetail } from "@/components/object-engine/RecordDetail";

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ object: string; id: string }>;
}) {
  const { object, id } = await params;
  const config = getObjectConfig(object);
  if (!config || config.listOnly || !/^\d+$/.test(id)) notFound();

  const record = await getRecord(config, id);
  if (!record) notFound();

  return <RecordDetail config={config} record={record} />;
}
