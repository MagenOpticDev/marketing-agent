"use client";
import Link from "next/link";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PhoneIcon,
  MegaphoneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const actions = [
  {
    label: "הודעת WhatsApp",
    icon: ChatBubbleLeftRightIcon,
    href: "/content-studio?type=whatsapp_message",
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    label: "קמפיין אימייל",
    icon: EnvelopeIcon,
    href: "/content-studio?type=email",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    label: "פוסט לינקדאין",
    icon: BriefcaseIcon,
    href: "/content-studio?type=linkedin_post",
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  },
  {
    label: "תיאור מוצר",
    icon: DocumentTextIcon,
    href: "/content-studio?type=product_description",
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  {
    label: "מעקב לקוח",
    icon: PhoneIcon,
    href: "/content-studio?type=follow_up",
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    label: "קמפיין חדש",
    icon: MegaphoneIcon,
    href: "/campaigns/new",
    color: "bg-red-50 text-red-600 hover:bg-red-100",
  },
  {
    label: "כל הכלים",
    icon: SparklesIcon,
    href: "/content-studio",
    color: "bg-slate-50 text-slate-600 hover:bg-slate-100",
  },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>פעולות מהירות</CardTitle>
        <span className="text-xs text-slate-500">יצירת תוכן מיידית</span>
      </CardHeader>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${action.color}`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-xs font-medium text-center leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
