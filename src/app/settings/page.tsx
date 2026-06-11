export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("company_settings")
    .select("*")
    .single();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active, created_at")
    .order("created_at");

  return (
    <>
      <TopBar title="הגדרות" subtitle="הגדרות חברה, AI ומשתמשים" />
      <div className="p-6">
        <SettingsClient initialSettings={settings} profiles={profiles || []} />
      </div>
    </>
  );
}
