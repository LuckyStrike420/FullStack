"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

/**
 * Type-to-filter dropdown that still submits as a plain form field: the
 * visible text input drives a filtered suggestion list, while a hidden
 * input carries the actual `value` so RecordForm's existing server actions
 * (which read FormData by field name) don't need to change.
 */
export function Combobox({
  name,
  options,
  defaultValue,
  placeholder,
  required,
  disabled,
  onValueChange,
}: {
  name: string;
  options: ComboboxOption[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const initialOption = options.find((o) => o.value === (defaultValue ?? ""));
  const [value, setValue] = useState(defaultValue ?? "");
  const [query, setQuery] = useState(initialOption?.label ?? "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    onValueChangeRef.current?.(value);
  }, [value]);

  // Re-sync the displayed label (or clear the selection) whenever the
  // options list itself changes — e.g. a dependent field (contactpersoon)
  // whose options got re-filtered because the klant field it depends on
  // changed. Reads value via a ref so this only reacts to `options`.
  useEffect(() => {
    const match = options.find((o) => o.value === valueRef.current);
    if (match) {
      setQuery(match.label);
    } else if (valueRef.current !== "") {
      setValue("");
      setQuery("");
    }
  }, [options]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        const selected = options.find((o) => o.value === value);
        setQuery(selected?.label ?? "");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [value, options]);

  function selectOption(option: ComboboxOption) {
    setValue(option.value);
    setQuery(option.label);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) selectOption(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        aria-required={required}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlighted(0);
          if (value) setValue("");
        }}
        onFocus={() => {
          setOpen(true);
          setHighlighted(Math.max(filtered.findIndex((o) => o.value === value), 0));
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
      {open && !disabled && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
          {filtered.length === 0 && <li className="px-3 py-1.5 text-slate-400">Geen resultaten</li>}
          {filtered.map((o, i) => (
            <li
              key={o.value || "__empty__"}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(o);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                "cursor-pointer px-3 py-1.5",
                i === highlighted ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50",
              )}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
