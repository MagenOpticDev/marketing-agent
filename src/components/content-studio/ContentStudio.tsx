"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import ContentOutput from "./ContentOutput";
import ContentHistory from "./ContentHistory";
import type { AIGenerateRequest, ContentType, ContentTone, ContentLanguage } from "@/types";
import { CUSTOMER_SEGMENTS } from "@/types";
import { CONTENT_TYPE_LABELS, TONE_LABELS } from "@/lib/utils/format";
import { SparklesIcon, ClockIcon } from "@heroicons/react/24/outline";

interface Props {
  products: { id: string; name: string; category_id?: string }[];
  campaigns: { id: string; name: string }[];
}

const contentTypes: ContentType[] = [
  "whatsapp_message", "email", "facebook_post", "linkedin_post",
  "product_description", "sales_pitch", "customer_proposal", "tender_email",
  "supplier_email", "follow_up", "product_launch", "newsletter",
  "landing_page", "sales_script", "objection_response", "campaign_idea", "seo_blog_outline",
];

const tones: ContentTone[] = [
  "short_direct", "professional", "sales_focused", "technical", "executive", "friendly",
];

export default function ContentStudio({ products, campaigns }: Props) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ content: string; id?: string } | null>(null);

  const [form, setForm] = useState<AIGenerateRequest>({
    content_type: (searchParams.get("type") as ContentType) || "whatsapp_message",
    tone: "professional",
    language: "hebrew",
    product_id: "",
    target_audience: "",
    goal: "",
    additional_context: "",
  });

  useEffect(() => {
    const type = searchParams.get("type") as ContentType;
    if (type) setForm((f) => ({ ...f, content_type: type }));
  }, [searchParams]);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = { ...form };
      if (!payload.product_id) delete payload.product_id;
      if (!payload.campaign_id) delete payload.campaign_id;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "שגיאה ביצירת תוכן");
      }

      const data = await res.json();
      setResult({ content: data.content, id: data.id });
      toast.success("התוכן נוצר בהצלחה!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "שגיאה";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const productOptions = [
    { value: "", label: "ללא מוצר ספציפי" },
    ...products.map((p) => ({ value: p.id, label: p.name })),
  ];

  const campaignOptions = [
    { value: "", label: "ללא קמפיין" },
    ...campaigns.map((c) => ({ value: c.id, label: c.name })),
  ];

  const contentTypeOptions = contentTypes.map((t) => ({
    value: t,
    label: CONTENT_TYPE_LABELS[t] || t,
  }));

  const toneOptions = tones.map((t) => ({
    value: t,
    label: TONE_LABELS[t] || t,
  }));

  const segmentOptions = [
    { value: "", label: "כל קהל היעד" },
    ...CUSTOMER_SEGMENTS.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "generate"
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <SparklesIcon className="h-4 w-4" />
          יצירת תוכן חדש
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "history"
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ClockIcon className="h-4 w-4" />
          היסטוריית תוכן
        </button>
      </div>

      {activeTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                הגדרות יצירת תוכן
              </h2>
              <div className="space-y-4">
                <Select
                  label="סוג תוכן"
                  options={contentTypeOptions}
                  value={form.content_type}
                  onChange={(e) =>
                    setForm({ ...form, content_type: e.target.value as ContentType })
                  }
                />
                <Select
                  label="טון כתיבה"
                  options={toneOptions}
                  value={form.tone}
                  onChange={(e) =>
                    setForm({ ...form, tone: e.target.value as ContentTone })
                  }
                />
                <Select
                  label="שפה"
                  options={[
                    { value: "hebrew", label: "עברית" },
                    { value: "english", label: "אנגלית" },
                  ]}
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value as ContentLanguage })
                  }
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                הקשר ומיקוד
              </h2>
              <div className="space-y-4">
                <Select
                  label="מוצר / קטגוריה"
                  options={productOptions}
                  value={form.product_id || ""}
                  onChange={(e) =>
                    setForm({ ...form, product_id: e.target.value })
                  }
                  hint="בחר מוצר לתוכן ממוקד יותר"
                />
                <Select
                  label="קהל יעד"
                  options={segmentOptions}
                  value={form.target_audience || ""}
                  onChange={(e) =>
                    setForm({ ...form, target_audience: e.target.value })
                  }
                />
                <Select
                  label="קמפיין (אופציונלי)"
                  options={campaignOptions}
                  value={form.campaign_id || ""}
                  onChange={(e) =>
                    setForm({ ...form, campaign_id: e.target.value })
                  }
                />
                <Input
                  label="מטרה עסקית"
                  value={form.goal || ""}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  placeholder="לדוג': יצירת לידים, קידום מבצע, השקת מוצר"
                />
                <Textarea
                  label="הקשר נוסף"
                  value={form.additional_context || ""}
                  onChange={(e) =>
                    setForm({ ...form, additional_context: e.target.value })
                  }
                  placeholder="פרטים נוספים, מחיר, מבצע, אירוע מיוחד, נתונים טכניים..."
                  rows={3}
                />
              </div>
            </Card>

            <Button
              onClick={handleGenerate}
              loading={loading}
              size="lg"
              className="w-full"
              icon={<SparklesIcon className="h-5 w-5" />}
            >
              {loading ? "יוצר תוכן..." : "צור תוכן"}
            </Button>

            {loading && (
              <p className="text-sm text-slate-500 text-center animate-pulse">
                ה-AI חושב... עד 10 שניות
              </p>
            )}
          </div>

          {/* Right - Output */}
          <div className="lg:col-span-3">
            <ContentOutput
              result={result}
              contentType={form.content_type}
              language={form.language}
            />
          </div>
        </div>
      )}

      {activeTab === "history" && <ContentHistory />}
    </div>
  );
}
