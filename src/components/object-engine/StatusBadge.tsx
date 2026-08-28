import { cn } from "@/lib/utils";
import type { EnumOption } from "@/lib/objects/types";

const COLOR_CLASSES: Record<NonNullable<EnumOption["color"]>, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  green: "bg-green-50 text-green-700 ring-green-600/20",
  gray: "bg-slate-100 text-slate-700 ring-slate-500/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
};

export function StatusBadge({ option }: { option: EnumOption | undefined }) {
  if (!option) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        COLOR_CLASSES[option.color ?? "gray"],
      )}
    >
      {option.label}
    </span>
  );
}
