"use client";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SparklesIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const TEMPLATES = [
  {
    title: "הודעת WhatsApp – ציוד עבודה בגובה",
    type: "whatsapp_message",
    category: "עבודה בגובה",
    audience: "קבלני בניה",
    content: `שלום [שם],

מגן אופטיק – פתרונות בטיחות לעבודה בגובה 🦺

האם אתם מחפשים ציוד בטיחות אמין לעובדים שלכם בגובה?
אנחנו מציעים:
✅ רתמות בטיחות מהמובילות בשוק – SKYLOTEC, IKAR, COURANT
✅ ציוד עמידה בתקנים EN
✅ ייעוץ מקצועי חינם

📞 לתיאום פגישה: 03-9617602
📧 info@maop.co.il`,
  },
  {
    title: "אימייל קר – מנהלי בטיחות",
    type: "email",
    category: "PPE כללי",
    audience: "מנהלי בטיחות",
    content: `נושא: פתרונות PPE מתקדמים לארגון שלכם

שלום [שם],

אני [שם המוכר] ממגן אופטיק, חברה ישראלית המתמחה בציוד מיגון אישי ובטיחות תעשייתית.

שמנו לב שהחברה שלכם פועלת ב[תחום] – תחום שדורש ציוד בטיחות ברמה גבוהה.

אנחנו מייצגים מותגים מובילים כמו 3M, Honeywell ו-PUMA Safety, ומציעים:
• ייעוץ מקצועי ללא עלות
• מגוון מוצרים לכל צורכי הבטיחות
• שירות מהיר ואמין

האם נוכל לקבוע שיחת היכרות של 15 דקות?

[שם] | מגן אופטיק
03-9617602 | info@maop.co.il`,
  },
  {
    title: "פוסט LinkedIn – השקת מוצר",
    type: "linkedin_post",
    category: "גלאי גז",
    audience: "מנהלי בטיחות ורכש",
    content: `מגן אופטיק משיקה: גלאי גז Honeywell BW Clip – 2 שנות הגנה ללא תחזוקה

בעידן שבו בטיחות העובדים היא עדיפות עליונה, גלאי ה-BW Clip מציע פתרון חסר תקדים:

✅ פעיל 2 שנות ים ללא כיול ותחזוקה
✅ עמידות IP66/68 – עובד בכל תנאי שטח
✅ אזעקה קולית + ויברציה
✅ חסכוני יותר מגלאים מסורתיים

מתאים במיוחד לקבלנים, חברות תשתיות ומפעלי תעשייה.

רוצים לשמוע עוד? השאירו תגובה או שלחו הודעה.

#בטיחות #PPE #MagenOptic #גלאיגז`,
  },
  {
    title: "תסריט מכירות – שיחת טלפון",
    type: "sales_script",
    category: "PPE כללי",
    audience: "מנהל רכש",
    content: `פתיחה:
"שלום [שם], אני [שמך] ממגן אופטיק. אני מתקשר כי ראיתי שהחברה שלכם עובדת ב[תחום] ורציתי להציג לכם פתרון שיכול לחסוך לכם כסף ולשפר את רמת הבטיחות.

יש לכם דקה?"

גילוי צרכים:
"כרגע, מאיפה אתם רוכשים את ציוד הבטיחות שלכם?"
"מה האתגר הגדול ביותר שלכם עם הספק הנוכחי?"
"כמה עובדים צריכים ציוד?"

הצגת פתרון:
"מגן אופטיק מייצגת את המותגים המובילים – 3M, Honeywell, SKYLOTEC. כל המוצרים שלנו עמידים בתקנים ישראליים ואירופיים."

CTA:
"אני רוצה לשלוח לכם הצעת מחיר ממוקדת. מתי נוח לכם לפגישה קצרה – פיזית או זום?"`,
  },
  {
    title: "מייל ספק – English",
    type: "supplier_email",
    category: "ספקים",
    audience: "Supplier",
    content: `Subject: Request for Updated Price List & New Product Information – Magen Optic Ltd.

Dear [Contact Name],

I hope this email finds you well.

My name is [Your Name] and I am a Sales Representative at Magen Optic Ltd., a leading distributor of PPE and safety equipment in Israel.

We have been a loyal partner of [Brand Name] for [X years] and would like to request:

1. Updated price list for Q[X] [Year]
2. Information on new product launches
3. Any promotional materials or digital assets

We are currently preparing for our annual safety equipment campaign and would appreciate a prompt response.

Thank you for your continued support.

Best regards,
[Your Name]
Magen Optic Ltd.
Tel: 03-9617602 | info@maop.co.il | maop.co.il`,
  },
  {
    title: "תגובה להתנגדות מחיר",
    type: "objection_response",
    category: "PPE כללי",
    audience: "לקוח",
    content: `התנגדות: "יקר מדי / יש לי הצעה יותר זולה"

תגובה 1 – ערך לעומת מחיר:
"אני מבין לגמרי את השיקול. אבל בואו נחשב יחד – אם נעל בטיחות יוצרת פציעה שעולה 50,000₪ לאורכה, כמה שווה הזול?"

תגובה 2 – עלות בעלות:
"המוצרים שלנו ממותגים מוכרים נמשכים פי 2-3 יותר מאשר מוצרים זולים. בסוף, עלות הבעלות נמוכה יותר."

תגובה 3 – רגולציה:
"ציוד שאינו עומד בתקנים עלול לגרום לקנסות ממפקח העבודה. האם ציוד ה[מתחרה] מאושר לפי [תקן]?"

תגובה 4 – שירות:
"מעבר למחיר, אנחנו מציעים ייעוץ, הדרכה ותמיכה. מה קורה כשיש בעיה עם ספק זול?"`,
  },
];

export default function TemplatesClient() {
  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("התבנית הועתקה ללוח");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {TEMPLATES.length} תבניות מוכנות לשימוש · לחץ על תבנית להעתקה
        </p>
        <Link href="/content-studio">
          <Button icon={<SparklesIcon className="h-4 w-4" />} variant="outline">
            צור תבנית חדשה עם AI
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template, i) => (
          <Card
            key={i}
            hover
            padding="sm"
            className="cursor-pointer"
            onClick={() => copyTemplate(template.content)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{template.title}</h3>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                    {template.category}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {template.audience}
                  </span>
                </div>
              </div>
            </div>
            <p
              className="text-xs text-slate-600 line-clamp-4 leading-relaxed"
              dir={template.type === "supplier_email" ? "ltr" : "rtl"}
            >
              {template.content}
            </p>
            <p className="text-xs text-brand-600 mt-3 font-medium">
              לחץ להעתקה ←
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
