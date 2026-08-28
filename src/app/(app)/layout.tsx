import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      <AppHeader userEmail={user.email} />
      <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
    </div>
  );
}
