"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Lead, LeadStatus } from "@/types";
import { CUSTOMER_SEGMENTS } from "@/types";
import toast from "react-hot-toast";

interface Props {
  lead: Lead | null;
  onSave: (lead: Lead) => void;
  onCancel: () => void;
}

export default function LeadForm({ lead, onSave, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: lead?.name || "",
    company: lead?.company || "",
    contact_person: lead?.contact_person || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    product_interest: lead?.product_interest || "",
    category_interest: lead?.category_interest || "",
    source: lead?.source || "",
    follow_up_date: lead?.follow_up_date || "",
    status: lead?.status || ("new" as LeadStatus),
    notes: lead?.notes || "",
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("שם הליד חובה"); return; }
    setLoading(true);

    const payload = {
      ...form,
      follow_up_date: form.follow_up_date || null,
    };

    let data, error;
    if (lead) {
      ({ data, error } = await supabase.from("leads").update(payload).eq("id", lead.id).select().single());
    } else {
      ({ data, error } = await supabase.from("leads").insert(payload).select().single());
    }

    if (error) { toast.error("שגיאה בשמירה"); setLoading(false); return; }
    toast.success(lead ? "הליד עודכן" : "הליד נוסף");
    onSave(data as Lead);
    setLoading(false);
  };

  const segmentOptions = [
    { value: "", label: "בחר קטגוריית עניין" },
    ...CUSTOMER_SEGMENTS.map((s) => ({ value: s.name, label: s.name })),
  ];

  const sourceOptions = [
    { value: "", label: "מקור הליד" },
    { value: "phone", label: "שיחת טלפון נכנסת" },
    { value: "website", label: "אתר האינטרנט" },
    { value: "referral", label: "הפניה" },
    { value: "exhibition", label: "תערוכה" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "cold_call", label: "שיחה יוצאת" },
    { value: "existing_customer", label: "לקוח קיים" },
    { value: "email", label: "אימייל" },
    { value: "other", label: "אחר" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <Input label="שם הלקוח *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="חברה" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="איש קשר" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
        <Input label="טלפון" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="אימייל" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
        <Select label="מקור" options={sourceOptions} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="עניין במוצר" value={form.product_interest} onChange={(e) => setForm({ ...form, product_interest: e.target.value })} placeholder="לדוג': רתמות בטיחות, גלאי גז..." />
        <Select label="קטגוריית לקוח" options={segmentOptions} value={form.category_interest} onChange={(e) => setForm({ ...form, category_interest: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="סטטוס"
          options={[
            { value: "new", label: "חדש" },
            { value: "contacted", label: "נוצר קשר" },
            { value: "meeting_scheduled", label: "נקבעה פגישה" },
            { value: "proposal_sent", label: "הצעה נשלחה" },
            { value: "waiting", label: "ממתין" },
            { value: "won", label: "נסגר" },
            { value: "lost", label: "אבוד" },
          ]}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
        />
        <Input label="תאריך מעקב" type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} dir="ltr" />
      </div>
      <Textarea label="הערות" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="הערות פנימיות על הליד..." />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
        <Button type="submit" loading={loading}>{lead ? "עדכן ליד" : "הוסף ליד"}</Button>
      </div>
    </form>
  );
}
