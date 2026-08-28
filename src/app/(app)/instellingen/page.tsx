import { getAppSettings } from "@/lib/settings/queries";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const settings = await getAppSettings();

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-lg font-semibold text-slate-900">Instellingen</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <SettingsForm initialLogoUrl={settings.logoUrl} />
      </div>
    </div>
  );
}
