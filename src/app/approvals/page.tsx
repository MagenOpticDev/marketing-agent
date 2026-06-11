export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import ApprovalsClient from "@/components/approvals/ApprovalsClient";

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: pendingContent } = await supabase
    .from("generated_contents")
    .select("*")
    .in("status", ["pending_approval", "approved"])
    .order("created_at", { ascending: false });

  return (
    <>
      <TopBar title="אישורים" subtitle="ניהול תוכן הממתין לאישור ופרסום" />
      <div className="p-6">
        <ApprovalsClient initialItems={pendingContent || []} />
      </div>
    </>
  );
}
