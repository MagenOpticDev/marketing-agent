import Card from "@/components/ui/Card";
import type { DashboardStats as Stats } from "@/types";
import {
  MegaphoneIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

function StatCard({ title, value, icon, color, description }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </Card>
  );
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  const cards: StatCardProps[] = [
    {
      title: "קמפיינים פעילים",
      value: stats.active_campaigns,
      icon: <MegaphoneIcon className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "ממתין לאישור",
      value: stats.pending_approvals,
      icon: <CheckBadgeIcon className="h-6 w-6 text-yellow-600" />,
      color: "bg-yellow-50",
      description: "תוכן שצריך אישורך",
    },
    {
      title: "לידים החודש",
      value: stats.leads_this_month,
      icon: <UserGroupIcon className="h-6 w-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "תוכן שנוצר היום",
      value: stats.content_generated_today,
      icon: <SparklesIcon className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "מעקבים להיום",
      value: stats.follow_ups_due,
      icon: <ClockIcon className="h-6 w-6 text-red-600" />,
      color: "bg-red-50",
      description: "משימות לביצוע היום",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
