"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavGroups } from "@/lib/objects/registry";

export function AppLauncherSidebar() {
  const pathname = usePathname();
  const groups = getNavGroups();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">
          W
        </div>
        <span className="text-sm font-semibold text-slate-900">Wholesale Ops</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {groups.map((group) => (
          <div key={group.name} className="mb-4">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.name}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.objects.map((obj) => {
                const href = obj.slug === "deals" ? "/deals/board" : `/${obj.slug}`;
                const active = pathname === href || pathname.startsWith(`/${obj.slug}/`) || pathname.startsWith(`/${obj.slug}?`);
                return (
                  <li key={obj.slug}>
                    <Link
                      href={href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm font-medium",
                        active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      {obj.labelPlural}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
