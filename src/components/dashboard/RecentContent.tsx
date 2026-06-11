"use client";
import Link from "next/link";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { CONTENT_TYPE_LABELS } from "@/lib/utils/format";
import { formatRelativeDate, truncate } from "@/lib/utils/format";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ContentItem {
  id: string;
  content_type: string;
  title?: string;
  content: string;
  status: string;
  created_at: string;
  language: string;
}

export default function RecentContent({ items }: { items: ContentItem[] }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("הועתק ללוח");
  };

  return (
    <Card padding="none">
      <div className="p-6 border-b border-slate-100">
        <CardHeader className="mb-0">
          <CardTitle>תוכן שנוצר לאחרונה</CardTitle>
          <Link href="/content-studio" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            צפה בכל התוכן
          </Link>
        </CardHeader>
      </div>
      {items.length === 0 ? (
        <EmptyState
          title="אין תוכן עדיין"
          description="צור תוכן ראשון דרך סטודיו התוכן"
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {CONTENT_TYPE_LABELS[item.content_type] || item.content_type}
                    </span>
                    <StatusBadge status={item.status} />
                    {item.language === "english" && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">EN</span>
                    )}
                  </div>
                  {item.title && (
                    <p className="text-sm font-medium text-slate-800 mb-0.5">{item.title}</p>
                  )}
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {truncate(item.content, 120)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatRelativeDate(item.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className="flex-shrink-0 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                  title="העתק"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
