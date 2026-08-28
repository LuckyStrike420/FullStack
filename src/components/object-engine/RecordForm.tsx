"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { isEnumField, isFkField, type ObjectConfig } from "@/lib/objects/types";
import type { FkOption } from "@/lib/objects/queries";
import { createRecord, updateRecord } from "@/lib/objects/mutations";
import { cn } from "@/lib/utils";
import { UnsavedChangesGuard } from "./UnsavedChangesGuard";
import { Combobox } from "./Combobox";

export function RecordForm({
  config,
  mode,
  recordId,
  initialValues = {},
  fkOptions = {},
}: {
  config: ObjectConfig;
  mode: "create" | "edit";
  recordId?: string;
  initialValues?: Record<string, unknown>;
  fkOptions?: Record<string, FkOption[]>;
}) {
  const action =
    mode === "create" ? createRecord.bind(null, config.slug) : updateRecord.bind(null, config.slug, recordId!);
  const [error, formAction, pending] = useActionState(action, undefined);
  const [dirty, setDirty] = useState(false);

  // Current value of every fk field, seeded synchronously from initialValues
  // (the record on edit, or a related-list prefill on create) so a
  // dependent field's options are correctly scoped from the very first
  // render — no flash of the wrong/unfiltered list.
  const [fkValues, setFkValues] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    for (const f of config.fields) {
      if (isFkField(f)) {
        const raw = initialValues[f.name];
        seed[f.name] = raw !== undefined && raw !== null ? String(raw) : "";
      }
    }
    return seed;
  });

  const editableFields = config.fields.filter((f) => !f.readOnly);
  const cancelHref = mode === "edit" ? `/${config.slug}/${recordId}` : `/${config.slug}`;

  return (
    <form action={formAction} onChange={() => setDirty(true)} className="flex flex-col gap-5">
      <UnsavedChangesGuard isDirty={dirty && !pending} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {editableFields.map((f) => {
          const rawValue = initialValues[f.name];

          if (isEnumField(f)) {
            return (
              <FieldWrapper key={f.name} label={f.label} required={f.required}>
                <Combobox
                  name={f.name}
                  required={f.required}
                  defaultValue={(rawValue as string) ?? ""}
                  placeholder={`Zoek ${f.label.toLowerCase()}…`}
                  options={f.options}
                />
              </FieldWrapper>
            );
          }

          if (isFkField(f)) {
            const allOptions = fkOptions[f.name] ?? [];
            const dependsOn = f.dependsOnField ? config.fields.find((d) => d.name === f.dependsOnField) : undefined;
            const dependsOnValue = f.dependsOnField ? (fkValues[f.dependsOnField] ?? "") : undefined;
            const options =
              dependsOnValue !== undefined
                ? allOptions.filter((o) => o.groupValue === dependsOnValue)
                : allOptions;
            const disabled = dependsOnValue !== undefined && dependsOnValue === "";
            const placeholder = disabled
              ? `Kies eerst ${dependsOn?.label.toLowerCase() ?? "een gerelateerd veld"}…`
              : `Zoek ${f.label.toLowerCase()}…`;

            return (
              <FieldWrapper key={f.name} label={f.label} required={f.required}>
                <Combobox
                  name={f.name}
                  required={f.required}
                  defaultValue={rawValue !== undefined && rawValue !== null ? String(rawValue) : ""}
                  placeholder={placeholder}
                  disabled={disabled}
                  options={options}
                  onValueChange={(v) => setFkValues((prev) => (prev[f.name] === v ? prev : { ...prev, [f.name]: v }))}
                />
              </FieldWrapper>
            );
          }

          if (f.type === "boolean") {
            return (
              <FieldWrapper key={f.name} label={f.label} required={f.required}>
                <input
                  type="checkbox"
                  name={f.name}
                  defaultChecked={Boolean(rawValue)}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </FieldWrapper>
            );
          }

          if (f.type === "date") {
            return (
              <FieldWrapper key={f.name} label={f.label} required={f.required}>
                <input
                  type="date"
                  name={f.name}
                  required={f.required}
                  defaultValue={(rawValue as string) ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </FieldWrapper>
            );
          }

          if (f.type === "integer" || f.type === "number" || f.type === "currency") {
            return (
              <FieldWrapper key={f.name} label={f.label} required={f.required}>
                <input
                  type="number"
                  step={f.type === "integer" ? 1 : "any"}
                  name={f.name}
                  required={f.required}
                  defaultValue={(rawValue as number | string) ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </FieldWrapper>
            );
          }

          if (f.type === "textarea") {
            return (
              <FieldWrapper key={f.name} label={f.label} required={f.required} full>
                <textarea
                  name={f.name}
                  required={f.required}
                  rows={3}
                  defaultValue={(rawValue as string) ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </FieldWrapper>
            );
          }

          return (
            <FieldWrapper key={f.name} label={f.label} required={f.required}>
              <input
                type="text"
                name={f.name}
                required={f.required}
                defaultValue={(rawValue as string) ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </FieldWrapper>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link
          href={cancelHref}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Annuleren
        </Link>
      </div>
    </form>
  );
}

function FieldWrapper({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
