"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import {
  CONTENT_TYPE_LABELS,
  TONE_LABELS,
  formatRelativeDate,
  truncate,
} from "@/lib/utils/format";
import {
  DocumentDuplicateIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ContentItem {
  id: string;
  content_type: string;
  content: string;
  status: string;
  language: string;
  tone?: string;
  target_audience?: string;
  created_at: string;
}

export default function ContentHistory() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [filter, setFilter] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("generated_contents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setItems(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את התוכן הזה?")) return;
    await supabase.from("generated_contents").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.success("נמחק");
  };

  const filteredItems = filter
    ? items.filter(
        (i) =>
          i.content.includes(filter) ||
          CONTENT_TYPE_LABELS[i.content_type]?.includes(filter)
      )
    : items;

  if (loading) return <PageLoader label="טוען היסטוריה..." />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <input
          type="text"
          placeholder="חיפוש בתוכן..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<SparklesIcon className="h-10 w-10" />}
            title="אין תוכן עדיין"
            description="צור תוכן ראשון בלשונית 'יצירת תוכן חדש'"
          />
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                hover
                padding="sm"
                className={`cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? "ring-2 ring-brand-500 border-brand-200"
                    : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium text-brand-600">
                        {CONTENT_TYPE_LABELS[item.content_type] || item.content_type}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {truncate(item.content, 80)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatRelativeDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-3">
        {selectedItem ? (
          <Card className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  {CONTENT_TYPE_LABELS[selectedItem.content_type]}
                </span>
                <StatusBadge status={selectedItem.status} />
                {selectedItem.tone && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {TONE_LABELS[selectedItem.tone]}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.content);
                    toast.success("הועתק");
                  }}
                  icon={<DocumentDuplicateIcon className="h-4 w-4" />}
                >
                  העתק
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedItem.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  icon={<TrashIcon className="h-4 w-4" />}
                >
                  מחק
                </Button>
              </div>
            </div>
            <div
              className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap min-h-[300px]"
              dir={selectedItem.language === "english" ? "ltr" : "rtl"}
            >
              {selectedItem.content}
            </div>
          </Card>
        ) : (
          <Card className="h-full min-h-[400px] flex items-center justify-center">
            <p className="text-slate-400 text-sm">בחר פריט מהרשימה לצפייה</p>
          </Card>
        )}
      </div>
    </div>
  );
}
