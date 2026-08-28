"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface DealCardData {
  deal_id: number;
  stage: string;
  incoterm: string;
  verwachte_waarde: number | null;
  verwachte_afsluitdatum: string | null;
  klant_naam: string;
}

export function DealCard({ deal }: { deal: DealCardData }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.deal_id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab touch-none rounded-md border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing",
        isDragging && "z-10 opacity-70 shadow-md",
      )}
    >
      <Link
        href={`/deals/${deal.deal_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {deal.klant_naam}
      </Link>
      <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
        <span>{deal.incoterm}</span>
        <span>{formatCurrency(deal.verwachte_waarde, "EUR")}</span>
      </div>
      {deal.verwachte_afsluitdatum && (
        <div className="mt-1 text-xs text-slate-400">Sluit: {formatDate(deal.verwachte_afsluitdatum)}</div>
      )}
    </div>
  );
}
