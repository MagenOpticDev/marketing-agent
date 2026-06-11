# מגן אופטיק – סוכן שיווק ומכירות AI

פלטפורמת AI לשיווק ומכירות של חברת מגן אופטיק בע"מ.

---

## תכונות עיקריות

- **סטודיו תוכן AI** – יצירת הודעות WhatsApp, אימיילים, פוסטים לסושיאל, תסריטי מכירות ועוד
- **ניהול קמפיינים** – בניית קמפיינים מרובי ערוצים עם תוכן AI
- **קטלוג מוצרים** – בסיס ידע של מוצרים, מותגים, ספקים
- **ניהול לידים** – CRM קל לסוכני מכירות עם AI מעקב
- **בסיס ידע** – העלאת קטלוגים, תעודות, מחירונים
- **תהליך אישורים** – Draft → אישור → פרסום
- **תבניות מוכנות** – 6 תבניות מוכנות לשימוש מיידי
- **ניהול משתמשים** – 5 רמות הרשאה עם RLS

---

## התקנה מקומית

### דרישות מקדימות

- Node.js 20+
- חשבון Supabase (חינם)
- מפתח API של Anthropic או OpenAI

### צעד 1: התקנת dependencies

```bash
npm install
```

### צעד 2: הגדרת משתני סביבה

```bash
cp .env.example .env.local
```

ערוך את `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI (בחר אחד)
ANTHROPIC_API_KEY=sk-ant-...
# או
OPENAI_API_KEY=sk-...

AI_PROVIDER=anthropic
AI_MODEL=claude-sonnet-4-6
```

### צעד 3: הגדרת Supabase

1. צור פרוייקט חדש ב-[supabase.com](https://supabase.com)
2. העתק את URL ו-anon key לקובץ `.env.local`
3. הרץ migrations:

```bash
# מה-Supabase Dashboard → SQL Editor
# הרץ לפי הסדר:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_rls_policies.sql
# 3. supabase/migrations/003_seed_data.sql
# 4. supabase/migrations/004_storage.sql
```

### צעד 4: הפעלת שרת פיתוח

```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000)

---

## פריסה ל-Vercel

```bash
# 1. Push לGitHub
git push origin main

# 2. חבר ב-vercel.com
# 3. הוסף משתני סביבה (Environment Variables) מ-.env.example
# 4. Deploy
```

---

## מבנה הפרויקט

```
src/
├── app/
│   ├── auth/login/         # עמוד התחברות
│   ├── auth/register/      # עמוד הרשמה
│   ├── dashboard/          # לוח בקרה ראשי
│   ├── content-studio/     # סטודיו תוכן AI
│   ├── campaigns/          # ניהול קמפיינים
│   ├── products/           # קטלוג מוצרים
│   ├── leads/              # לידים ומשימות
│   ├── knowledge-base/     # בסיס ידע ומסמכים
│   ├── templates/          # תבניות מוכנות
│   ├── approvals/          # תהליך אישורים
│   ├── settings/           # הגדרות מערכת
│   └── api/
│       └── ai/generate/    # API ליצירת תוכן
├── components/
│   ├── ui/                 # Button, Card, Modal, Input...
│   ├── layout/             # Sidebar, TopBar, DashboardShell
│   ├── dashboard/          # Stats, QuickActions, RecentContent
│   ├── content-studio/     # ContentStudio, ContentOutput
│   ├── campaigns/          # CampaignsClient, CampaignForm
│   ├── products/           # ProductsClient, ProductForm
│   ├── leads/              # LeadsClient, LeadForm, LeadDetail
│   ├── knowledge-base/     # KnowledgeBaseClient
│   ├── approvals/          # ApprovalsClient
│   ├── templates/          # TemplatesClient
│   └── settings/           # SettingsClient
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   ├── ai/                 # client.ts, prompts.ts
│   └── utils/              # cn.ts, format.ts
└── types/
    └── index.ts            # כל הטיפוסים
```

---

## הגדרת מפתחות AI

### Anthropic (מומלץ)

1. הרשם ב-[console.anthropic.com](https://console.anthropic.com)
2. צור API Key
3. הוסף ל-.env.local: `ANTHROPIC_API_KEY=sk-ant-...`
4. הגדר: `AI_PROVIDER=anthropic`

### OpenAI (חלופי)

1. הרשם ב-[platform.openai.com](https://platform.openai.com)
2. צור API Key
3. הוסף ל-.env.local: `OPENAI_API_KEY=sk-...`
4. הגדר: `AI_PROVIDER=openai`

---

## הוספת מוצרים

1. עבור לדף **מוצרים ומותגים**
2. לחץ **מוצר חדש**
3. מלא: שם, קטגוריה, מותג, תיאור, יתרונות, זוויות שיווק
4. המוצר יהיה זמין ל-AI בסטודיו התוכן

**טיפ:** ככל שתמלא יותר שדות, כך ה-AI יכתוב תוכן מדויק יותר.

---

## מצבי AI

| מצב | שימוש |
|-----|-------|
| Marketing Strategist | אסטרטגיית קמפיינים |
| Sales Copywriter | WhatsApp, אימייל, סושיאל |
| Product Expert | תיאורי מוצר |
| Hebrew Business Editor | עריכת עברית עסקית |
| English Supplier Writer | מיילים לספקים |
| Campaign Planner | תכנון קמפיינים |
| Sales Follow-up Assistant | מעקב לידים |

---

## רמות הרשאה

| תפקיד | הרשאות |
|--------|---------|
| Admin | גישה מלאה לכל המערכת |
| Marketing Manager | גישה מלאה + אישורים |
| Sales Manager | ניהול לידים + קמפיינים |
| Sales Agent | יצירת תוכן + ניהול לידים אישיים |
| Viewer | צפייה בלבד |

---

## מה מיושם (v1.0)

✅ מערכת התחברות עם 5 תפקידים  
✅ לוח בקרה עם סטטיסטיקות  
✅ סטודיו תוכן AI עם 17 סוגי תוכן  
✅ היסטוריית תוכן שנוצר  
✅ ניהול קמפיינים  
✅ קטלוג מוצרים ומותגים  
✅ CRM לידים עם pipeline  
✅ בסיס ידע עם drag & drop  
✅ תהליך אישורים  
✅ 6 תבניות מוכנות  
✅ הגדרות חברה ו-AI  
✅ ניהול משתמשים  
✅ RTL מלא בעברית  
✅ Row Level Security ב-Supabase  
✅ מבנה מודולרי להחלפת AI  

---

## פיתוח נוסף (Phase 2)

- [ ] RAG – עיבוד PDF לחיפוש סמנטי
- [ ] AI Chat – שיחה ישירה עם הנציג
- [ ] קישור מסמכים למוצרים
- [ ] דוחות ואנליטיקס
- [ ] שליחת מיילים דרך Resend
- [ ] תזמון תוכן
- [ ] אינטגרציה עם CRM חיצוני
- [ ] ייצוא PDF/DOCX של תוכן

---

## קשר

**מגן אופטיק בע"מ**  
טלפון: 03-9617602  
אימייל: info@maop.co.il  
אתר: maop.co.il
