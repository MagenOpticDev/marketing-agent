"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Campaign, Channel, CampaignStatus } from "@/types";
import toast from "react-hot-toast";

interface Props {
  campaign: Campaign | null;
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

const CHANNELS: { value: Channel; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "אימייל" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "אתר האינטרנט" },
  { value: "sales_agent", label: "סוכני מכירות" },
];

export default function CampaignForm({ campaign, onSave, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: campaign?.name || "",
    description: campaign?.description || "",
    target_audience: campaign?.target_audience || "",
    goal: campaign?.goal || "",
    offer: campaign?.offer || "",
    channels: campaign?.channels || ([] as Channel[]),
    status: campaign?.status || ("draft" as CampaignStatus),
    start_date: campaign?.start_date || "",
    end_date: campaign?.end_date || "",
    notes: campaign?.notes || "",
  });
  const supabase = createClient();

  const toggleChannel = (channel: Channel) => {
    setForm((f) => ({
      ...f,
      channels: f.channels.includes(channel)
        ? f.channels.filter((c) => c !== channel)
        : [...f.channels, channel],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("שם הקמפיין חובה"); return; }
    if (form.channels.length === 0) { toast.error("בחר לפחות ערוץ אחד"); return; }
    setLoading(true);

    const payload = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    let data, error;
    if (campaign) {
      ({ data, error } = await supabase.from("campaigns").update(payload).eq("id", campaign.id).select().single());
    } else {
      ({ data, error } = await supabase.from("campaigns").insert(payload).select().single());
    }

    if (error) { toast.error("שגיאה בשמירה"); setLoading(false); return; }
    toast.success(campaign ? "הקמפיין עודכן" : "הקמפיין נוצר");
    onSave(data as Campaign);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <Input
        label="שם הקמפיין *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="לדוג': קמפיין קיץ - עבודה בגובה"
        required
      />
      <Textarea
        label="תיאור הקמפיין"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={2}
        placeholder="תיאור קצר של הקמפיין"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="קהל יעד"
          value={form.target_audience}
          onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
          placeholder="קבלני בניה, מנהלי בטיחות..."
        />
        <Input
          label="מטרה עסקית"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          placeholder="יצירת לידים, השקת מוצר..."
        />
      </div>
      <Input
        label="הצעה / מבצע"
        value={form.offer}
        onChange={(e) => setForm({ ...form, offer: e.target.value })}
        placeholder="הנחה של 10%, משלוח חינם, מתנה עם הזמנה..."
      />

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">ערוצים *</p>
        <div className="grid grid-cols-3 gap-2">
          {CHANNELS.map((ch) => (
            <label
              key={ch.value}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                form.channels.includes(ch.value)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={form.channels.includes(ch.value)}
                onChange={() => toggleChannel(ch.value)}
                className="rounded text-brand-600"
              />
              {ch.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Select
          label="סטטוס"
          options={[
            { value: "draft", label: "טיוטה" },
            { value: "active", label: "פעיל" },
            { value: "paused", label: "מושהה" },
            { value: "completed", label: "הסתיים" },
          ]}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })}
        />
        <Input
          label="תאריך התחלה"
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          dir="ltr"
        />
        <Input
          label="תאריך סיום"
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          dir="ltr"
        />
      </div>
      <Textarea
        label="הערות"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        rows={2}
        placeholder="הערות פנימיות..."
      />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
        <Button type="submit" loading={loading}>{campaign ? "עדכן" : "צור קמפיין"}</Button>
      </div>
    </form>
  );
}
