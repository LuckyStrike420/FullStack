"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { globalSearch, type SearchResultGroup } from "@/lib/search/actions";

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<SearchResultGroup[]>([]);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const term = query.trim();

  useEffect(() => {
    if (term.length < 2) {
      requestIdRef.current++;
      return;
    }
    const requestId = ++requestIdRef.current;
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const result = await globalSearch(term);
        if (requestIdRef.current === requestId) setGroups(result);
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, [term]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function goTo(slug: string, id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/${slug}/${id}`);
  }

  const visibleGroups = term.length < 2 ? [] : groups;
  const showDropdown = open && term.length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Zoeken…"
          className="w-full rounded-full border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-3 text-left text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-96 overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
          {visibleGroups.length === 0 && (
            <p className="px-3 py-2 text-slate-400">
              {pending ? "Zoeken…" : `Geen resultaten voor "${term}"`}
            </p>
          )}
          {visibleGroups.map((g) => (
            <div key={g.slug} className="py-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {g.labelPlural}
              </p>
              {g.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    goTo(g.slug, item.id);
                  }}
                  className="block w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
