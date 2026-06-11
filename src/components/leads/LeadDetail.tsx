"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Lead } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { SparklesIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function LeadDetail({ lead }: { lead: Lead }) {
  const [generating, setGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState(lead.ai_follow_up_message || "");
  const [messageType, setMessageType] = useState("follow_up");

  const generateFollowUp = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: messageType,
          tone: "sales_focused",
          language: "hebrew",
          target_audience: lead.category_interest || "מנהל רכש",
          additional_context: `שם הלקוח: ${lead.name}\nחברה: ${lead.company || "לא ידוע"}\nעניין: ${lead.product_interest || lead.category_interest || "ציוד בטיחות"}\nסטטוס: ${lead.status}\nהערות: ${lead.notes || ""}`,
        }),
      });
      const data = await res.json();
      setAiMessage(data.content);
    } catch {
      toast.error("שגיאה ביצירת הודעה");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          ["חברה", lead.company],
          ["איש קשר", lead.contact_person],
          ["טלפון", lead.phone],
          ["אימייל", lead.email],
          ["עניין", lead.product_interest || lead.category_interest],
          ["מקור", lead.source],
        ].map(([label, value]) => value ? (
          <div key={label}>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-slate-800">{value}</p>
          </div>
        ) : null)}
        <div>
          <p className="text-xs text-slate-400">סטטוס</p>
          <StatusBadge status={lead.status} />
        </div>
        {lead.follow_up_date && (
          <div>
            <p className="text-xs text-slate-400">מעקב</p>
            <p className="text-slate-800">{formatDate(lead.follow_up_date)}</p>
          </div>
        )}
      </div>

      {lead.notes && (
        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
          <p className="text-xs text-slate-400 mb-1">הערות</p>
          {lead.notes}
        </div>
      )}

      {/* AI Follow-up generator */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-sm font-semibold text-slate-800">מחולל הודעת מעקב AI</h4>
          <div className="flex items-center gap-2">
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="follow_up">מעקב לאחר פגישה</option>
              <option value="whatsapp_message">הודעת WhatsApp</option>
              <option value="email">אימייל</option>
              <option value="sales_pitch">מצגת מכירות</option>
            </select>
            <Button
              size="sm"
              onClick={generateFollowUp}
              loading={generating}
              icon={<SparklesIcon className="h-4 w-4" />}
              variant="outline"
            >
              {generating ? "יוצר..." : "צור הודעה"}
            </Button>
          </div>
        </div>
        {aiMessage ? (
          <div className="relative bg-green-50 rounded-xl p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border border-green-100">
            {aiMessage}
            <button
              className="absolute top-2 left-2 p-1.5 rounded text-slate-400 hover:text-brand-600"
              onClick={() => { navigator.clipboard.writeText(aiMessage); toast.success("הועתק"); }}
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 text-center border border-dashed border-slate-200">
            לחץ &quot;צור הודעה&quot; לקבלת הצעת מעקב מותאמת ללקוח
          </div>
        )}
      </div>
    </div>
  );
}
