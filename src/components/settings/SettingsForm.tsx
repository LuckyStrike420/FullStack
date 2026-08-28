"use client";

import { useActionState, useState } from "react";
import { updateAppSettings } from "@/lib/settings/actions";

export function SettingsForm({ initialLogoUrl }: { initialLogoUrl: string | null }) {
  const [error, formAction, pending] = useActionState(updateAppSettings, undefined);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? "");

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Logo-URL</label>
        <input
          type="text"
          name="logo_url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
        <p className="text-xs text-slate-500">Laat leeg om het standaardlogo te gebruiken.</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Voorbeeld:</span>
        {logoUrl.trim() ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl.trim()} alt="Logo voorbeeld" className="h-8 w-8 rounded object-contain" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">
            W
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Opslaan…" : "Opslaan"}
      </button>
    </form>
  );
}
