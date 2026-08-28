"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

/**
 * Warns before leaving a dirty create/edit form: a native beforeunload
 * prompt for tab close/hard navigation, and a custom confirm dialog for
 * in-app link clicks (sidebar nav, breadcrumbs, related-list links, ...).
 *
 * Next.js App Router has no built-in "block this navigation" API, so
 * in-app links are intercepted with a capture-phase click listener that
 * calls preventDefault before Next's own Link handler runs, then replays
 * the navigation via router.push once the user confirms.
 */
export function UnsavedChangesGuard({ isDirty }: { isDirty: boolean }) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;
  // Once the user confirms leaving, suppress further prompts for the rest of
  // this component's lifetime — separate from isDirtyRef so the render-time
  // sync above can't race it back to true before the navigation completes.
  const suppressedRef = useRef(false);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (suppressedRef.current || !isDirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }

    function handleClick(e: MouseEvent) {
      if (suppressedRef.current || !isDirtyRef.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.origin !== window.location.origin) return;

      e.preventDefault();
      e.stopPropagation();
      setPendingHref(anchor.getAttribute("href"));
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  function confirmNavigation() {
    suppressedRef.current = true;
    const href = pendingHref;
    setPendingHref(null);
    if (href) router.push(href);
  }

  return (
    <Dialog.Root
      open={pendingHref !== null}
      onOpenChange={(open) => {
        if (!open) setPendingHref(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-base font-semibold text-slate-900">Niet-opgeslagen wijzigingen</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-slate-600">
            Je hebt wijzigingen die nog niet zijn opgeslagen. Weet je zeker dat je wilt annuleren?
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setPendingHref(null)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Terug naar formulier
            </button>
            <button
              onClick={confirmNavigation}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Wijzigingen verwijderen
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
