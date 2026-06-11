"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

const roleOptions = [
  { value: "admin", label: "מנהל מערכת" },
  { value: "marketing_manager", label: "מנהל שיווק" },
  { value: "sales_manager", label: "מנהל מכירות" },
  { value: "sales_agent", label: "סוכן מכירות" },
  { value: "viewer", label: "צופה" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "sales_agent",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, role: form.role },
      },
    });
    if (error) {
      toast.error("שגיאה ברישום: " + error.message);
      setLoading(false);
      return;
    }
    toast.success("החשבון נוצר בהצלחה! בדוק את האימייל לאישור.");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4">
            <ShieldCheckIcon className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">מגן אופטיק</h1>
          <p className="text-slate-400 text-sm">סוכן שיווק ומכירות AI</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            יצירת חשבון חדש
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="שם מלא"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="ישראל ישראלי"
              required
            />
            <Input
              label="כתובת אימייל"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
              required
              dir="ltr"
            />
            <Input
              label="סיסמה"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="לפחות 8 תווים"
              required
              minLength={8}
              dir="ltr"
            />
            <Select
              label="תפקיד"
              options={roleOptions}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? "יוצר חשבון..." : "צור חשבון"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              יש לך חשבון?{" "}
              <Link
                href="/auth/login"
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                התחבר
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
