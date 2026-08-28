import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export async function TopBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">
      <span className="text-sm text-slate-500">{user?.email}</span>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Uitloggen
        </button>
      </form>
    </header>
  );
}
