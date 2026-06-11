import Link from "next/link";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";
import { MegaphoneIcon } from "@heroicons/react/24/outline";

interface Campaign {
  id: string;
  name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  target_audience?: string;
  channels?: string[];
}

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "אימייל",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  website: "אתר",
  sales_agent: "סוכן מכירות",
};

export default function ActiveCampaigns({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Card padding="none">
      <div className="p-6 border-b border-slate-100">
        <CardHeader className="mb-0">
          <CardTitle>קמפיינים פעילים</CardTitle>
          <Link
            href="/campaigns"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            כל הקמפיינים
          </Link>
        </CardHeader>
      </div>
      {campaigns.length === 0 ? (
        <EmptyState
          icon={<MegaphoneIcon className="h-12 w-12" />}
          title="אין קמפיינים פעילים"
          description="צור קמפיין חדש כדי להתחיל"
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{campaign.name}</p>
                {campaign.target_audience && (
                  <p className="text-xs text-slate-500 mt-0.5">{campaign.target_audience}</p>
                )}
                {campaign.channels && campaign.channels.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {campaign.channels.slice(0, 3).map((ch) => (
                      <span
                        key={ch}
                        className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                      >
                        {CHANNEL_LABELS[ch] || ch}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <StatusBadge status={campaign.status} />
                {campaign.end_date && (
                  <span className="text-xs text-slate-400">
                    עד {formatDate(campaign.end_date)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
