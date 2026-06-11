import type { AIGenerateRequest } from "@/types";

export const COMPANY_CONTEXT = `
חברת מגן אופטיק בע"מ - מובילה בישראל בציוד מיגון אישי (PPE), ציוד בטיחות, עבודה בגובה, חילוץ והצלה, גלאי גז, נעלי בטיחות, הגנת נשימה, עיניים, ראש, פנים, כפפות, בגדי עבודה, ציוד חירום ופתרונות בטיחות תעשייתיים.
אתרים: maop.co.il | shop.maop.co.il | evengear.co.il
טלפון: 03-9617602 | אימייל: info@maop.co.il
מותגים מרכזיים: 3M, Honeywell, PIP, IKAR, SKYLOTEC, PROTEKT, PUMA Safety, ALBATROS, CMC, COURANT, Pacific Helmets, BLS, MARTOR, Portwest, Kappler, Ronin
`;

export const BRAND_VOICE_RULES = `
כללי טון ומיתוג:
- כתיבה מקצועית, ברורה ופרקטית
- ממוקד מכירות B2B
- מומחיות בטיחות חזקה - לא לבדות נתונים טכניים
- לא להגזים בהבטחות
- עברית עסקית טבעית וברורה
- הודעות לקוח - קצרות וישירות
- מיילים להנהלה - טון VP חד וממוקד
- מיילים לספקים באנגלית - מנומסים, מקצועיים, תמציתיים
- אם חסרים נתונים טכניים - ציין שחסר מידע, אל תמציא
`;

export function buildSystemPrompt(mode: string): string {
  const baseContext = `${COMPANY_CONTEXT}\n\n${BRAND_VOICE_RULES}`;

  const modes: Record<string, string> = {
    marketing_strategist: `${baseContext}\n\nאתה אסטרטג שיווקי מקצועי של מגן אופטיק. תפקידך לגבש אסטרטגיות שיווק חכמות, לזהות הזדמנויות עסקיות, ולהציע תכניות קמפיין מקיפות.`,
    sales_copywriter: `${baseContext}\n\nאתה כותב תוכן מכירות מקצועי. אתה יוצר הודעות WhatsApp, מיילים, פוסטים לרשתות חברתיות, ותסריטי מכירה שמניעים לפעולה.`,
    product_expert: `${baseContext}\n\nאתה מומחה מוצר של מגן אופטיק. יש לך ידע עמוק בכל המוצרים, המותגים, התקנים, ויישומים בשטח.`,
    hebrew_editor: `${baseContext}\n\nאתה עורך עברית עסקי בכיר. אתה מתמחה בכתיבה עסקית עברית ברמה גבוהה, ברורה, מדויקת ומקצועית.`,
    english_supplier_writer: `You are a professional B2B communication specialist for Magen Optic Ltd., an Israeli PPE and safety equipment distributor. You write polite, concise, professional business English emails to international suppliers and brands.`,
    campaign_planner: `${baseContext}\n\nאתה מתכנן קמפיינים. תפקידך לבנות תכניות קמפיין מלאות הכוללות אסטרטגיה, מסרים מרכזיים, תוכן לכל ערוץ, ותכנית מעקב.`,
    sales_followup: `${baseContext}\n\nאתה עוזר מכירות לסוכני השטח. אתה מנסח הודעות מעקב, תגובות להתנגדויות, והצעות מכירה מותאמות ללקוח.`,
  };

  return modes[mode] || modes.sales_copywriter;
}

export function buildUserPrompt(req: AIGenerateRequest): string {
  const toneMap: Record<string, string> = {
    short_direct: "קצר וישיר - עד 3 משפטים",
    professional: "מקצועי וענייני",
    sales_focused: "ממוקד מכירות עם קריאה לפעולה ברורה",
    technical: "טכני ומפורט",
    executive: "רמת הנהלה - VP, מנהל בכיר",
    friendly: "ידידותי ונגיש",
  };

  const contentTypeInstructions: Record<string, string> = {
    whatsapp_message: `צור הודעת WhatsApp שיווקית. כללים: קצר (עד 150 מילים), ישיר, עם אימוג'י מינימלי ומקצועי, CTA ברור בסוף (שם ומספר טלפון).`,
    email: `צור מייל שיווקי מקצועי. כלול: שורת נושא, גוף מייל מובנה, CTA.`,
    facebook_post: `צור פוסט לפייסבוק. כלול: פתיחה מושכת, תוכן, hashtags רלוונטיים, CTA.`,
    linkedin_post: `צור פוסט לינקדאין מקצועי לשוק B2B. טון מקצועי ועניני. עד 300 מילים.`,
    product_description: `צור תיאור מוצר מכירותי מקצועי. כלול: יתרונות, שימושים עיקריים, קהל יעד.`,
    sales_pitch: `צור מצגת מכירות קצרה ומשכנעת. כלול: הגדרת בעיה, הפתרון, היתרון שלנו, CTA.`,
    customer_proposal: `צור פתיח הצעה מקצועי ללקוח. כלול: פתיחה, הבנת הצורך, ההצעה, הצעד הבא.`,
    tender_email: `צור מייל מקצועי לבירור מכרז/RFP. כלול: הצגה, שאלות הבהרה, בקשת מידע.`,
    supplier_email: `Write a professional business email in English to a supplier/brand representative.`,
    follow_up: `צור הודעת מעקב לאחר פגישה/שיחה. קצר, ממוקד, עם הצעד הבא.`,
    product_launch: `צור הודעת השקת מוצר. כלול: כותרת, תיאור המוצר, יתרונות, קריאה לפעולה.`,
    newsletter: `צור תוכן לניוזלטר. כלול: כותרת, חדשות/מבצעים, מוצרים מומלצים, CTA.`,
    landing_page: `צור עותק לעמוד נחיתה. כלול: כותרת ראשית, תת-כותרת, יתרונות עיקריים, CTA.`,
    sales_script: `צור תסריט שיחת מכירות. כלול: פתיחה, גילוי צרכים, הצגת פתרון, טיפול בהתנגדויות, סגירה.`,
    objection_response: `צור תגובות מקצועיות להתנגדויות נפוצות. כלול 3-5 תגובות שונות לכל התנגדות.`,
    campaign_idea: `הצע רעיון קמפיין מלא. כלול: שם, מסר מרכזי, ערוצים, תוכן לכל ערוץ, תאריכים מוצעים.`,
    seo_blog_outline: `צור מתווה מאמר SEO. כלול: כותרת, כתובת URL, תת-כותרות, נקודות עיקריות.`,
  };

  const productContext = req.product_name
    ? `\nמוצר/קטגוריה: ${req.product_name}`
    : req.category
    ? `\nקטגוריה: ${req.category}`
    : "";

  const audienceContext = req.target_audience
    ? `\nקהל יעד: ${req.target_audience}`
    : "";

  const goalContext = req.goal ? `\nמטרה עסקית: ${req.goal}` : "";

  const additionalContext = req.additional_context
    ? `\nהקשר נוסף: ${req.additional_context}`
    : "";

  const toneInstruction = toneMap[req.tone] || "";

  const contentInstruction =
    contentTypeInstructions[req.content_type] || `צור תוכן מסוג: ${req.content_type}`;

  const languageInstruction =
    req.language === "english"
      ? "\nכתוב באנגלית מקצועית."
      : "\nכתוב בעברית עסקית ברורה ומקצועית.";

  return `${contentInstruction}

טון: ${toneInstruction}${languageInstruction}${productContext}${audienceContext}${goalContext}${additionalContext}

חשוב: אם חסרים נתונים טכניים, ציין [נא להוסיף נתון X] ואל תמציא מידע.`;
}

export function buildCampaignStrategyPrompt(campaign: {
  name: string;
  target_audience: string;
  goal: string;
  channels: string[];
  product?: string;
}): string {
  return `בנה אסטרטגיית קמפיין שיווקי מלאה עבור מגן אופטיק:

שם קמפיין: ${campaign.name}
קהל יעד: ${campaign.target_audience}
מטרה: ${campaign.goal}
ערוצים: ${campaign.channels.join(", ")}
${campaign.product ? `מוצר/קטגוריה: ${campaign.product}` : ""}

${COMPANY_CONTEXT}

צור אסטרטגיה שכוללת:
1. כותרת הקמפיין
2. המסר המרכזי (core message)
3. נקודות כאב של קהל היעד
4. יתרונות עיקריים להדגשה
5. קריאה לפעולה (CTA)
6. תוכן לכל ערוץ (${campaign.channels.join(", ")})
7. סדר הפעולות המוצע
8. טיפים לתוצאות מקסימליות

פורמט: JSON מובנה`;
}
