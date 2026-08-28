import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/AppHeader";
import { getAppSettings } from "@/lib/settings/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const settings = await getAppSettings();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      <AppHeader userEmail={user.email} logoUrl={settings.logoUrl} />
      <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
    </div>
  );
}
