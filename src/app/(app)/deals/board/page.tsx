import Link from "next/link";
import { getObjectConfig } from "@/lib/objects/config";
import { listRecords } from "@/lib/objects/queries";
import { isEnumField } from "@/lib/objects/types";
import { DealsKanbanBoard } from "@/components/kanban/DealsKanbanBoard";
import type { DealCardData } from "@/components/kanban/DealCard";

export default async function DealsBoardPage() {
  const config = getObjectConfig("deals")!;
  const rows = await listRecords(config);

  const deals: DealCardData[] = rows.map((r) => ({
    deal_id: Number(r.deal_id),
    stage: String(r.stage),
    incoterm: String(r.incoterm),
    verwachte_waarde: (r.verwachte_waarde as number | null) ?? null,
    verwachte_afsluitdatum: (r.verwachte_afsluitdatum as string | null) ?? null,
    klant_naam: r.__labels.klant_id ?? "—",
  }));

  const stageField = config.fields.find((f) => isEnumField(f) && f.isStatusField);
  const stageOptions = stageField && isEnumField(stageField) ? stageField.options : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Deals — pipeline</h1>
        <div className="flex gap-2">
          <Link
            href="/deals"
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Lijstweergave
          </Link>
          <Link
            href="/deals/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Nieuw
          </Link>
        </div>
      </div>
      <DealsKanbanBoard initialDeals={deals} stageOptions={stageOptions} />
    </div>
  );
}
