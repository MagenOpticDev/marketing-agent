"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import type { GeneratedContent } from "@/types";
import { CONTENT_TYPE_LABELS, TONE_LABELS, formatRelativeDate, truncate } from "@/lib/utils/format";
import { CheckBadgeIcon, DocumentDuplicateIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function ApprovalsClient({
  initialItems,
}: {
  initialItems: GeneratedContent[];
}) {
  const [items, setItems] = useState<GeneratedContent[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<GeneratedContent | null>(null);
  const [filter, setFilter] = useState("pending_approval");
  const supabase = createClient();

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("generated_contents")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error("שגיאה"); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "approved" as GeneratedContent["status"] } : i));
    if (selectedItem?.id === id) setSelectedItem((s) => s ? { ...s, status: "approved" as GeneratedContent["status"] } : s);
    toast.success("אושר!");
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("generated_contents")
      .update({ status: "draft" })
      .eq("id", id);
    if (error) { toast.error("שגיאה"); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "draft" as GeneratedContent["status"] } : i));
    if (selectedItem?.id === id) setSelectedItem((s) => s ? { ...s, status: "draft" as GeneratedContent["status"] } : s);
    toast.success("הוחזר לטיוטה");
  };

  const handlePublish = async (id: string) => {
    const { error } = await supabase
      .from("generated_contents")
      .update({ status: "published" })
      .eq("id", id);
    if (error) { toast.error("שגיאה"); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.success("פורסם!");
  };

  const filtered = items.filter((i) =>
    filter === "all" ? true : i.status === filter
  );

  const counts = {
    pending_approval: items.filter((i) => i.status === "pending_approval").length,
    approved: items.filter((i) => i.status === "approved").length,
  };

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 w-fit">
        {[
          { key: "pending_approval", label: `ממתין לאישור (${counts.pending_approval})` },
          { key: "approved", label: `מאושר (${counts.approved})` },
          { key: "all", label: "הכל" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key ? "bg-brand-600 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckBadgeIcon className="h-12 w-12" />}
          title="אין פריטים לאישור"
          description="כל התוכן מטופל!"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.map((item) => (
              <Card
                key={item.id}
                hover
                padding="sm"
                className={`cursor-pointer ${selectedItem?.id === item.id ? "ring-2 ring-brand-500" : ""}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium text-brand-600">
                        {CONTENT_TYPE_LABELS[item.content_type] || item.content_type}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{truncate(item.content, 80)}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatRelativeDate(item.created_at)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detail */}
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
                </div>

                <div
                  className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap min-h-[250px]"
                  dir={selectedItem.language === "english" ? "ltr" : "rtl"}
                >
                  {selectedItem.content}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText(selectedItem.content); toast.success("הועתק"); }}
                    icon={<DocumentDuplicateIcon className="h-4 w-4" />}
                  >
                    העתק
                  </Button>
                  {selectedItem.status === "pending_approval" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(selectedItem.id)}
                        icon={<CheckCircleIcon className="h-4 w-4" />}
                      >
                        אשר
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(selectedItem.id)}
                        icon={<XCircleIcon className="h-4 w-4" />}
                      >
                        החזר לטיוטה
                      </Button>
                    </>
                  )}
                  {selectedItem.status === "approved" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePublish(selectedItem.id)}
                    >
                      סמן כ&quot;פורסם&quot;
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="h-full min-h-[400px] flex items-center justify-center">
                <p className="text-slate-400 text-sm">בחר פריט לצפייה ואישור</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
