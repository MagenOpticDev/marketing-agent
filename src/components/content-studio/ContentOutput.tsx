"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import toast from "react-hot-toast";
import { CONTENT_TYPE_LABELS } from "@/lib/utils/format";
import {
  DocumentDuplicateIcon,
  CheckIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface ContentOutputProps {
  result: { content: string; id?: string } | null;
  contentType: string;
  language: string;
}

export default function ContentOutput({
  result,
  contentType,
  language,
}: ContentOutputProps) {
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("draft");
  const supabase = createClient();

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    toast.success("הועתק ללוח");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitForApproval = async () => {
    if (!result?.id) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("generated_contents")
      .update({ status: "pending_approval" })
      .eq("id", result.id);

    if (error) {
      toast.error("שגיאה בשליחה לאישור");
    } else {
      setStatus("pending_approval");
      toast.success("נשלח לאישור בהצלחה");
    }
    setSubmitting(false);
  };

  if (!result) {
    return (
      <Card className="h-full min-h-[500px] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="h-8 w-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            מוכן ליצירת תוכן
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            בחר סוג תוכן, מוצר וטון בטופס משמאל, ולחץ על &quot;צור תוכן&quot;
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            {CONTENT_TYPE_LABELS[contentType] || contentType}
          </span>
          <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {language === "hebrew" ? "עברית" : "English"}
          </span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <CheckIcon className="h-4 w-4" /> : <DocumentDuplicateIcon className="h-4 w-4" />}
          >
            {copied ? "הועתק!" : "העתק"}
          </Button>
          {result.id && status === "draft" && (
            <Button
              variant="secondary"
              size="sm"
              loading={submitting}
              onClick={handleSubmitForApproval}
              icon={<PaperAirplaneIcon className="h-4 w-4" />}
            >
              שלח לאישור
            </Button>
          )}
        </div>
      </div>

      <div
        className={`bg-slate-50 rounded-xl p-5 border border-slate-200 min-h-[350px] text-sm leading-relaxed text-slate-800 whitespace-pre-wrap ${
          language === "english" ? "text-left ltr-content" : "text-right"
        }`}
        dir={language === "english" ? "ltr" : "rtl"}
      >
        {result.content}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <SparklesIcon className="h-3.5 w-3.5" />
        <span>נוצר על ידי AI · נא לוודא את הדיוק הטכני לפני שליחה</span>
      </div>
    </Card>
  );
}
