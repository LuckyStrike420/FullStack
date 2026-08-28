"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getApps, objectHref } from "@/lib/objects/registry";
import { signOut } from "@/lib/auth/actions";
import { GlobalSearch } from "./GlobalSearch";

export function AppHeader({ userEmail, logoUrl }: { userEmail?: string; logoUrl?: string | null }) {
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
    <div className="flex shrink-0 flex-col border-b border-slate-200 bg-white">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-7 w-7 rounded object-contain" />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">
              W
            </div>
          )}

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

        <div className="flex justify-center">
          <GlobalSearch />
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-slate-500">{userEmail}</span>
          <Link
            href="/instellingen"
            title="Instellingen"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
              <path
                d="M8.3 3.5c.1-.6.6-1 1.2-1h1c.6 0 1.1.4 1.2 1l.1.7c.5.1.9.3 1.3.6l.7-.3c.5-.2 1.2 0 1.5.5l.5.9c.3.5.2 1.1-.2 1.5l-.5.5c.1.5.1 1 0 1.5l.5.5c.4.4.5 1 .2 1.5l-.5.9c-.3.5-1 .7-1.5.5l-.7-.3c-.4.3-.8.5-1.3.6l-.1.7c-.1.6-.6 1-1.2 1h-1c-.6 0-1.1-.4-1.2-1l-.1-.7a4.3 4.3 0 01-1.3-.6l-.7.3c-.5.2-1.2 0-1.5-.5l-.5-.9c-.3-.5-.2-1.1.2-1.5l.5-.5a4.2 4.2 0 010-1.5l-.5-.5c-.4-.4-.5-1-.2-1.5l.5-.9c.3-.5 1-.7 1.5-.5l.7.3c.4-.3.8-.5 1.3-.6l.1-.7z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 px-4 py-1.5">
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
    </div>
  );
}
