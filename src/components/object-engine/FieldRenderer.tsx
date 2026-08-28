import Link from "next/link";
import { getObjectConfig } from "@/lib/objects/config";
import { isCurrencyField, isEnumField, isFkField, type FieldConfig } from "@/lib/objects/types";
import type { RowWithLabels } from "@/lib/objects/queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function fkDisplayLabel(field: FieldConfig, record: RowWithLabels): string {
  if (!isFkField(field)) return "";
  const value = record[field.name];
  if (value === null || value === undefined) return "—";
  const refConfig = getObjectConfig(field.references);
  const label = record.__labels[field.name] ?? String(value);
  if (refConfig && refConfig.titleField === refConfig.primaryKey) {
    return `${refConfig.labelSingular} #${label}`;
  }
  return label;
}

export function FieldValue({
  field,
  record,
  linkFk = true,
}: {
  field: FieldConfig;
  record: RowWithLabels;
  linkFk?: boolean;
}) {
  const value = record[field.name];

  if (isEnumField(field)) {
    return <StatusBadge option={field.options.find((o) => o.value === value)} />;
  }

  if (isCurrencyField(field)) {
    const currency = field.currencyFixed ?? (record[field.currencyField ?? ""] as "EUR" | "USD" | undefined) ?? "EUR";
    return <span>{formatCurrency(value as number | null, currency)}</span>;
  }

  if (field.type === "date") {
    return <span>{formatDate(value as string | null)}</span>;
  }

  if (field.type === "boolean") {
    return <span>{value ? "Ja" : "Nee"}</span>;
  }

  if (isFkField(field)) {
    const label = fkDisplayLabel(field, record);
    const refConfig = getObjectConfig(field.references);
    if (linkFk && refConfig && value !== null && value !== undefined) {
      return (
        <Link href={`/${refConfig.slug}/${value}`} className="text-blue-600 hover:underline">
          {label}
        </Link>
      );
    }
    return <span>{label}</span>;
  }

  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">—</span>;
  }

  if (field.type === "textarea") {
    return <span className="whitespace-pre-wrap">{String(value)}</span>;
  }

  return <span>{String(value)}</span>;
}
