export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import CampaignsClient from "@/components/campaigns/CampaignsClient";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <TopBar title="קמפיינים" subtitle="ניהול קמפיינים שיווקיים ומכירתיים" />
      <div className="p-6">
        <CampaignsClient initialCampaigns={campaigns || []} />
      </div>
    </>
  );
}
