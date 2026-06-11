export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentContent from "@/components/dashboard/RecentContent";
import ActiveCampaigns from "@/components/dashboard/ActiveCampaigns";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: campaigns },
    { data: pendingApprovals },
    { data: recentContent },
    { data: upcomingTasks },
    { data: leadsThisMonth },
  ] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id, name, status, start_date, end_date, target_audience, channels")
      .eq("status", "active")
      .limit(5),
    supabase
      .from("approvals")
      .select("id")
      .eq("status", "pending"),
    supabase
      .from("generated_contents")
      .select("id, content_type, title, content, status, created_at, language")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("tasks")
      .select("id, title, due_date, priority, is_completed, lead_id")
      .eq("is_completed", false)
      .order("due_date", { ascending: true })
      .limit(5),
    supabase
      .from("leads")
      .select("id")
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const stats = {
    active_campaigns: campaigns?.length || 0,
    pending_approvals: pendingApprovals?.length || 0,
    leads_this_month: leadsThisMonth?.length || 0,
    content_generated_today: recentContent?.filter(c => {
      const today = new Date().toDateString();
      return new Date(c.created_at).toDateString() === today;
    }).length || 0,
    follow_ups_due: upcomingTasks?.filter(t => {
      if (!t.due_date) return false;
      const today = new Date().toDateString();
      return new Date(t.due_date).toDateString() === today;
    }).length || 0,
  };

  return (
    <DashboardShell
      title="לוח בקרה"
      subtitle="ברוך הבא למערכת שיווק AI של מגן אופטיק"
    >
      <div className="space-y-6">
        <DashboardStats stats={stats} />
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentContent items={recentContent || []} />
            <ActiveCampaigns campaigns={campaigns || []} />
          </div>
          <div>
            <UpcomingTasks tasks={upcomingTasks || []} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
