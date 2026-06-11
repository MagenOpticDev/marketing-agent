"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  HomeIcon,
  SparklesIcon,
  MegaphoneIcon,
  CubeIcon,
  UserGroupIcon,
  FolderOpenIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  {
    label: "לוח בקרה",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "סטודיו תוכן AI",
    href: "/content-studio",
    icon: SparklesIcon,
  },
  {
    label: "קמפיינים",
    href: "/campaigns",
    icon: MegaphoneIcon,
  },
  {
    label: "מוצרים ומותגים",
    href: "/products",
    icon: CubeIcon,
  },
  {
    label: "לידים ומשימות",
    href: "/leads",
    icon: UserGroupIcon,
  },
  {
    label: "בסיס ידע",
    href: "/knowledge-base",
    icon: FolderOpenIcon,
  },
  {
    label: "תבניות",
    href: "/templates",
    icon: DocumentDuplicateIcon,
  },
  {
    label: "אישורים",
    href: "/approvals",
    icon: CheckBadgeIcon,
  },
];

const bottomItems = [
  {
    label: "הגדרות",
    href: "/settings",
    icon: Cog6ToothIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("התנתקת בהצלחה");
    router.push("/auth/login");
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
        <div className="flex-shrink-0 w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
          <ShieldCheckIcon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">מגן אופטיק</p>
          <p className="text-xs text-slate-400 truncate">סוכן שיווק AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-brand-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-700/60">
        <ul className="space-y-0.5 mb-2">
          {bottomItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-brand-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
          <span>התנתקות</span>
        </button>
      </div>
    </aside>
  );
}
