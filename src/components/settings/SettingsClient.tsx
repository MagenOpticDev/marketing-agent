"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import type { CompanySettings, Profile } from "@/types";
import { ROLE_LABELS } from "@/lib/utils/format";
import { formatDate } from "@/lib/utils/format";
import toast from "react-hot-toast";
import {
  BuildingOfficeIcon,
  SparklesIcon,
  UsersIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  initialSettings: CompanySettings | null;
  profiles: Profile[];
}

type SettingsTab = "company" | "ai" | "users" | "about";

export default function SettingsClient({ initialSettings, profiles }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const [settings, setSettings] = useState<Partial<CompanySettings>>(
    initialSettings || {}
  );
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("company_settings")
      .upsert({ id: settings.id || undefined, ...settings });
    if (error) { toast.error("שגיאה בשמירה"); setSaving(false); return; }
    toast.success("ההגדרות נשמרו");
    setSaving(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    if (error) { toast.error("שגיאה"); return; }
    toast.success("התפקיד עודכן");
  };

  const tabs = [
    { key: "company" as SettingsTab, label: "הגדרות חברה", icon: BuildingOfficeIcon },
    { key: "ai" as SettingsTab, label: "הגדרות AI", icon: SparklesIcon },
    { key: "users" as SettingsTab, label: "משתמשים", icon: UsersIcon },
    { key: "about" as SettingsTab, label: "אודות המערכת", icon: InformationCircleIcon },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar tabs */}
      <div className="w-52 flex-shrink-0">
        <Card padding="sm">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-right ${
                  activeTab === tab.key
                    ? "bg-brand-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl">
        {activeTab === "company" && (
          <Card>
            <h2 className="text-base font-semibold text-slate-900 mb-5">פרטי החברה</h2>
            <div className="space-y-4">
              <Input
                label="שם החברה"
                value={settings.company_name || ""}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="טלפון"
                  value={settings.phone || ""}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  dir="ltr"
                />
                <Input
                  label="אימייל"
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  dir="ltr"
                />
              </div>
              <Textarea
                label="CTA ברירת מחדל"
                value={settings.default_cta || ""}
                onChange={(e) => setSettings({ ...settings, default_cta: e.target.value })}
                rows={2}
                hint="הטקסט שיופיע בסוף כל תוכן שיווקי"
              />
              <Textarea
                label="הגדרות טון ומיתוג (Brand Voice)"
                value={settings.brand_voice || ""}
                onChange={(e) => setSettings({ ...settings, brand_voice: e.target.value })}
                rows={3}
                hint="הגדר כיצד ה-AI צריך לכתוב עבור החברה"
              />
              <Button onClick={handleSave} loading={saving}>שמור שינויים</Button>
            </div>
          </Card>
        )}

        {activeTab === "ai" && (
          <Card>
            <h2 className="text-base font-semibold text-slate-900 mb-5">הגדרות AI</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <p className="font-medium mb-1">🔑 מפתחות API</p>
                <p>מפתחות API מוגדרים דרך משתני סביבה בקובץ .env.local</p>
                <p className="mt-1 font-mono text-xs">ANTHROPIC_API_KEY=sk-ant-...</p>
              </div>
              <Select
                label="ספק AI מועדף"
                options={[
                  { value: "anthropic", label: "Anthropic Claude (מומלץ)" },
                  { value: "openai", label: "OpenAI GPT" },
                ]}
                value={settings.ai_provider || "anthropic"}
                onChange={(e) => setSettings({ ...settings, ai_provider: e.target.value as "anthropic" | "openai" })}
              />
              <Input
                label="מודל AI"
                value={settings.ai_model || "claude-sonnet-4-6"}
                onChange={(e) => setSettings({ ...settings, ai_model: e.target.value })}
                dir="ltr"
                hint="לדוג': claude-sonnet-4-6, gpt-4o"
              />
              <div className="bg-slate-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-slate-700 mb-2">מצבי AI זמינים:</p>
                <ul className="space-y-1 text-slate-600 text-xs">
                  <li>• Marketing Strategist – אסטרטגיית שיווק</li>
                  <li>• Sales Copywriter – תוכן מכירות</li>
                  <li>• Product Expert – מומחה מוצרים</li>
                  <li>• Hebrew Business Editor – עורך עברית</li>
                  <li>• English Supplier Writer – מיילים לספקים</li>
                  <li>• Campaign Planner – תכנון קמפיינים</li>
                  <li>• Sales Follow-up Assistant – מעקב מכירות</li>
                </ul>
              </div>
              <Button onClick={handleSave} loading={saving}>שמור שינויים</Button>
            </div>
          </Card>
        )}

        {activeTab === "users" && (
          <Card>
            <h2 className="text-base font-semibold text-slate-900 mb-5">
              ניהול משתמשים ({profiles.length})
            </h2>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{profile.full_name}</p>
                    <p className="text-xs text-slate-500">{profile.email}</p>
                    <p className="text-xs text-slate-400">נרשם: {formatDate(profile.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={profile.is_active ? "success" : "warning"}>
                      {profile.is_active ? "פעיל" : "לא פעיל"}
                    </Badge>
                    <select
                      defaultValue={profile.role}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {profiles.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">אין משתמשים רשומים</p>
              )}
            </div>
          </Card>
        )}

        {activeTab === "about" && (
          <Card>
            <h2 className="text-base font-semibold text-slate-900 mb-5">אודות המערכת</h2>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
                <h3 className="font-semibold text-brand-800 mb-2">מגן אופטיק – סוכן שיווק AI</h3>
                <p className="text-brand-700 text-xs leading-relaxed">
                  פלטפורמת AI לשיווק ומכירות מותאמת לחברת מגן אופטיק. המערכת מאפשרת יצירת תוכן שיווקי, ניהול קמפיינים, מעקב לידים ובסיס ידע.
                </p>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong>גרסה:</strong> 1.0.0</p>
                <p><strong>Stack:</strong> Next.js 14 · TypeScript · Tailwind CSS · Supabase</p>
                <p><strong>AI:</strong> Anthropic Claude / OpenAI GPT (מוגדר ב-.env)</p>
                <p><strong>אחסון:</strong> Supabase Storage</p>
                <p><strong>אימות:</strong> Supabase Auth</p>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p><strong>אתרי החברה:</strong></p>
                <p>• maop.co.il · shop.maop.co.il · evengear.co.il</p>
                <p>• info@maop.co.il · 03-9617602</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
