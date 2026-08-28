"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { updateStatus } from "@/lib/objects/mutations";
import { isNormalTransition } from "@/lib/objects/status-transitions";
import type { EnumFieldConfig } from "@/lib/objects/types";
import { StatusBadge } from "./StatusBadge";

export function StatusChangeControl({
  slug,
  id,
  field,
  currentValue,
}: {
  slug: string;
  id: string;
  field: EnumFieldConfig;
  currentValue: string;
}) {
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function commit(value: string) {
    startTransition(async () => {
      try {
        await updateStatus(slug, id, field.name, value);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bijwerken mislukt.");
      }
      setPendingValue(null);
    });
  }

  function handleChange(value: string) {
    if (value === currentValue) return;
    if (isNormalTransition(slug, currentValue, value)) {
      commit(value);
    } else {
      setPendingValue(value);
    }
  }

  const targetOption = field.options.find((o) => o.value === pendingValue);
  const currentOption = field.options.find((o) => o.value === currentValue);

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentValue}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}

      <Dialog.Root
        open={pendingValue !== null}
        onOpenChange={(open) => {
          if (!open) setPendingValue(null);
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
                  <span>Je wijzigt de status van</span>
                  <StatusBadge option={currentOption} />
                  <span>naar</span>
                  <StatusBadge option={targetOption} />
                </div>
                <p className="mt-2">Dit is geen gebruikelijke vervolgstap. Weet je het zeker?</p>
              </div>
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setPendingValue(null)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuleren
              </button>
              <button
                onClick={() => pendingValue && commit(pendingValue)}
                disabled={isPending}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Doorgaan
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
