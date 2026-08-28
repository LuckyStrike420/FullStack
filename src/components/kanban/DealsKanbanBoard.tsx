"use client";

import { useState } from "react";
import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import * as Dialog from "@radix-ui/react-dialog";
import { updateStatus } from "@/lib/objects/mutations";
import { isNormalTransition } from "@/lib/objects/status-transitions";
import type { EnumOption } from "@/lib/objects/types";
import { StatusBadge } from "@/components/object-engine/StatusBadge";
import { cn } from "@/lib/utils";
import { DealCard, type DealCardData } from "./DealCard";

export function DealsKanbanBoard({
  initialDeals,
  stageOptions,
}: {
  initialDeals: DealCardData[];
  stageOptions: EnumOption[];
}) {
  const [deals, setDeals] = useState(initialDeals);
  const [pendingMove, setPendingMove] = useState<{ dealId: number; from: string; to: string } | null>(null);

  function commitMove(dealId: number, from: string, to: string) {
    setDeals((prev) => prev.map((d) => (d.deal_id === dealId ? { ...d, stage: to } : d)));
    updateStatus("deals", String(dealId), "stage", to).catch(() => {
      setDeals((prev) => prev.map((d) => (d.deal_id === dealId ? { ...d, stage: from } : d)));
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const dealId = Number(active.id);
    const to = String(over.id);
    const deal = deals.find((d) => d.deal_id === dealId);
    if (!deal || deal.stage === to) return;

    if (isNormalTransition("deals", deal.stage, to)) {
      commitMove(dealId, deal.stage, to);
    } else {
      setPendingMove({ dealId, from: deal.stage, to });
    }
  }

  const pendingDeal = pendingMove ? deals.find((d) => d.deal_id === pendingMove.dealId) : undefined;
  const fromOption = pendingMove ? stageOptions.find((o) => o.value === pendingMove.from) : undefined;
  const toOption = pendingMove ? stageOptions.find((o) => o.value === pendingMove.to) : undefined;

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stageOptions.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              deals={deals.filter((d) => d.stage === stage.value)}
            />
          ))}
        </div>
      </DndContext>

      <Dialog.Root
        open={pendingMove !== null}
        onOpenChange={(open) => {
          if (!open) setPendingMove(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-base font-semibold text-slate-900">
              Ongebruikelijke statusovergang
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="mt-3 text-sm text-slate-600">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span>{pendingDeal?.klant_naam} verplaatsen van</span>
                  <StatusBadge option={fromOption} />
                  <span>naar</span>
                  <StatusBadge option={toOption} />
                </div>
                <p className="mt-2">Dit is geen gebruikelijke vervolgstap. Weet je het zeker?</p>
              </div>
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setPendingMove(null)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  if (pendingMove) commitMove(pendingMove.dealId, pendingMove.from, pendingMove.to);
                  setPendingMove(null);
                }}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Doorgaan
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function KanbanColumn({ stage, deals }: { stage: EnumOption; deals: DealCardData[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.value });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-100/60 p-2",
        isOver && "ring-2 ring-blue-400",
      )}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <StatusBadge option={stage} />
        <span className="text-xs text-slate-400">{deals.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {deals.map((deal) => (
          <DealCard key={deal.deal_id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <p className="px-1 py-4 text-center text-xs text-slate-400">Geen deals</p>
        )}
      </div>
    </div>
  );
}
