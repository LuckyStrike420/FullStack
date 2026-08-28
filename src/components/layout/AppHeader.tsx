"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getApps, objectHref } from "@/lib/objects/registry";
import { signOut } from "@/lib/auth/actions";

export function AppHeader({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const apps = getApps();

  const objectSlug = pathname.split("/").filter(Boolean)[0] ?? "";
  const currentApp = apps.find((a) => a.objects.some((o) => o.slug === objectSlug)) ?? apps[0];

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4">
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">
          W
        </div>

        <div ref={switcherRef} className="relative">
          <button
            type="button"
            onClick={() => setSwitcherOpen((o) => !o)}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {currentApp?.label ?? "Wholesale Ops"}
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-500">
              <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {switcherOpen && (
            <ul className="absolute left-0 z-30 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
              {apps.map((app) => (
                <li key={app.slug}>
                  <Link
                    href={objectHref(app.objects[0])}
                    onClick={() => setSwitcherOpen(false)}
                    className={cn(
                      "block px-3 py-1.5",
                      app.slug === currentApp?.slug
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    {app.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
        {currentApp?.objects.map((obj) => {
          const href = objectHref(obj);
          const active = pathname === href || pathname.startsWith(`/${obj.slug}/`) || pathname.startsWith(`/${obj.slug}?`);
          return (
            <Link
              key={obj.slug}
              href={href}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium",
                active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {obj.labelPlural}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm text-slate-500">{userEmail}</span>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Uitloggen
          </button>
        </form>
      </div>
    </header>
  );
}
