import { format, formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

export function formatDate(date: string | Date, pattern = "dd/MM/yyyy") {
  return format(new Date(date), pattern, { locale: he });
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: he });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(amount);
}

export function truncate(str: string, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  whatsapp_message: "הודעת WhatsApp",
  email: "אימייל",
  facebook_post: "פוסט פייסבוק",
  linkedin_post: "פוסט לינקדאין",
  product_description: "תיאור מוצר",
  sales_pitch: "מצגת מכירות",
  customer_proposal: "הצעה ללקוח",
  tender_email: "אימייל מכרז",
  supplier_email: "אימייל לספק (אנגלית)",
  follow_up: "מעקב לאחר פגישה",
  product_launch: "השקת מוצר",
  newsletter: "ניוזלטר",
  landing_page: "עמוד נחיתה",
  sales_script: "סקריפט מכירות",
  objection_response: "תשובה להתנגדות",
  campaign_idea: "רעיון קמפיין",
  seo_blog_outline: "מתווה מאמר SEO",
};

export const TONE_LABELS: Record<string, string> = {
  short_direct: "קצר וישיר",
  professional: "מקצועי",
  sales_focused: "ממוקד מכירות",
  technical: "טכני",
  executive: "רמת הנהלה",
  friendly: "ידידותי",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "טיוטה",
  pending_approval: "ממתין לאישור",
  approved: "מאושר",
  published: "פורסם",
  archived: "בארכיון",
  new: "חדש",
  contacted: "נוצר קשר",
  meeting_scheduled: "נקבעה פגישה",
  proposal_sent: "הצעה נשלחה",
  waiting: "ממתין",
  won: "נסגר",
  lost: "אבוד",
  active: "פעיל",
  paused: "מושהה",
  completed: "הושלם",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_approval: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  published: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-500",
  new: "bg-purple-100 text-purple-700",
  contacted: "bg-blue-100 text-blue-700",
  meeting_scheduled: "bg-indigo-100 text-indigo-700",
  proposal_sent: "bg-orange-100 text-orange-700",
  waiting: "bg-yellow-100 text-yellow-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

export const ROLE_LABELS: Record<string, string> = {
  admin: "מנהל מערכת",
  marketing_manager: "מנהל שיווק",
  sales_manager: "מנהל מכירות",
  sales_agent: "סוכן מכירות",
  viewer: "צופה",
};
