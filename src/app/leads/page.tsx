export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import LeadsClient from "@/components/leads/LeadsClient";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <TopBar title="לידים ומשימות" subtitle="ניהול לידים, מעקב ומשימות מכירה" />
      <div className="p-6">
        <LeadsClient initialLeads={leads || []} />
      </div>
    </>
  );
}
