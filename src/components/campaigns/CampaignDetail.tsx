"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { Campaign } from "@/types";
import { SparklesIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "אימייל",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  website: "אתר",
  sales_agent: "סוכן",
};

export default function CampaignDetail({ campaign }: { campaign: Campaign }) {
  const [generating, setGenerating] = useState(false);
  const [strategy, setStrategy] = useState<string>("");

  const generateStrategy = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: "campaign_idea",
          tone: "professional",
          language: "hebrew",
          target_audience: campaign.target_audience,
          goal: campaign.goal,
          additional_context: `שם קמפיין: ${campaign.name}\nערוצים: ${campaign.channels?.join(", ")}\nהצעה: ${campaign.offer || "לא הוגדרה"}`,
        }),
      });
      const data = await res.json();
      setStrategy(data.content);
    } catch {
      toast.error("שגיאה ביצירת אסטרטגיה");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500 mb-1">קהל יעד</p>
          <p className="text-slate-800">{campaign.target_audience || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">מטרה</p>
          <p className="text-slate-800">{campaign.goal || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">הצעה/מבצע</p>
          <p className="text-slate-800">{campaign.offer || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">ערוצים</p>
          <div className="flex gap-1 flex-wrap">
            {campaign.channels?.map((ch) => (
              <Badge key={ch} variant="info">{CHANNEL_LABELS[ch] || ch}</Badge>
            ))}
          </div>
        </div>
      </div>

      {campaign.notes && (
        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
          <p className="text-xs text-slate-500 mb-1">הערות</p>
          {campaign.notes}
        </div>
      )}

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-800">אסטרטגיית קמפיין AI</h4>
          <Button
            size="sm"
            onClick={generateStrategy}
            loading={generating}
            icon={<SparklesIcon className="h-4 w-4" />}
            variant="outline"
          >
            {generating ? "יוצר..." : "צור אסטרטגיה"}
          </Button>
        </div>
        {strategy ? (
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border border-blue-100">
            {strategy}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 text-center border border-dashed border-slate-200">
            לחץ על &quot;צור אסטרטגיה&quot; לקבלת המלצות AI לקמפיין זה
          </div>
        )}
      </div>
    </div>
  );
}
