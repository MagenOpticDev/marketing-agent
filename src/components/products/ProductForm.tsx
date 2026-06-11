"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface Props {
  product: Product | null;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, categories, brands, onSave, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    name_en: product?.name_en || "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    brand_id: product?.brand_id || "",
    description: product?.description || "",
    description_en: product?.description_en || "",
    features: product?.features?.join("\n") || "",
    target_customers: product?.target_customers?.join(", ") || "",
    marketing_angles: product?.marketing_angles?.join("\n") || "",
    common_objections: product?.common_objections?.join("\n") || "",
    price_range: product?.price_range || "",
    certifications: product?.certifications?.join(", ") || "",
    is_active: product?.is_active !== false,
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      name_en: form.name_en || null,
      sku: form.sku || null,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      description: form.description || null,
      description_en: form.description_en || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      target_customers: form.target_customers ? form.target_customers.split(",").map(s => s.trim()).filter(Boolean) : [],
      marketing_angles: form.marketing_angles ? form.marketing_angles.split("\n").filter(Boolean) : [],
      common_objections: form.common_objections ? form.common_objections.split("\n").filter(Boolean) : [],
      price_range: form.price_range || null,
      certifications: form.certifications ? form.certifications.split(",").map(s => s.trim()).filter(Boolean) : [],
      is_active: form.is_active,
    };

    let data, error;
    if (product) {
      ({ data, error } = await supabase.from("products").update(payload).eq("id", product.id).select("*, brand:brands(id, name), category:categories(id, name)").single());
    } else {
      ({ data, error } = await supabase.from("products").insert(payload).select("*, brand:brands(id, name), category:categories(id, name)").single());
    }

    if (error) { toast.error("שגיאה בשמירה: " + error.message); setLoading(false); return; }
    toast.success(product ? "המוצר עודכן" : "המוצר נוסף");
    onSave(data as Product);
    setLoading(false);
  };

  const categoryOptions = [
    { value: "", label: "בחר קטגוריה" },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ];
  const brandOptions = [
    { value: "", label: "בחר מותג" },
    ...brands.map(b => ({ value: b.id, label: b.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <Input label="שם המוצר *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <Input label="שם באנגלית" value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} dir="ltr" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input label="מק&quot;ט (SKU)" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} dir="ltr" />
        <Select label="קטגוריה" options={categoryOptions} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} />
        <Select label="מותג" options={brandOptions} value={form.brand_id} onChange={e => setForm({ ...form, brand_id: e.target.value })} />
      </div>
      <Textarea label="תיאור המוצר" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="תיאור שיווקי של המוצר" />
      <Textarea
        label="יתרונות ותכונות (שורה אחת לכל תכונה)"
        value={form.features}
        onChange={e => setForm({ ...form, features: e.target.value })}
        rows={3}
        placeholder="יתרון 1&#10;יתרון 2&#10;יתרון 3"
      />
      <div className="grid grid-cols-2 gap-4">
        <Textarea
          label="זוויות שיווק (שורה אחת לכל זווית)"
          value={form.marketing_angles}
          onChange={e => setForm({ ...form, marketing_angles: e.target.value })}
          rows={3}
          placeholder="זווית שיווקית 1&#10;זווית שיווקית 2"
        />
        <Textarea
          label="התנגדויות נפוצות (שורה אחת לכל התנגדות)"
          value={form.common_objections}
          onChange={e => setForm({ ...form, common_objections: e.target.value })}
          rows={3}
          placeholder="התנגדות 1&#10;התנגדות 2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="טווח מחיר" value={form.price_range} onChange={e => setForm({ ...form, price_range: e.target.value })} placeholder="לדוג: ₪200-₪400" />
        <Input label="תעודות ותקנים (מופרד בפסיק)" value={form.certifications} onChange={e => setForm({ ...form, certifications: e.target.value })} placeholder="EN 361, ISO 9001" />
      </div>
      <Input label="לקוחות יעד (מופרד בפסיק)" value={form.target_customers} onChange={e => setForm({ ...form, target_customers: e.target.value })} placeholder="קבלני בניה, מפעלים, חברת החשמל" />
      <div className="flex items-center gap-3">
        <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
        <label htmlFor="is_active" className="text-sm text-slate-700">מוצר פעיל</label>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
        <Button type="submit" loading={loading}>{product ? "עדכן מוצר" : "הוסף מוצר"}</Button>
      </div>
    </form>
  );
}
