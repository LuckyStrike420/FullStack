export function formatCurrency(amount: number | null | undefined, currency: "EUR" | "USD" = "EUR"): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency }).format(amount);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("nl-NL", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value),
  );
}
