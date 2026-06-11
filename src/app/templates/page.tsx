export const dynamic = "force-dynamic";
import TopBar from "@/components/layout/TopBar";
import TemplatesClient from "@/components/templates/TemplatesClient";

export default function TemplatesPage() {
  return (
    <>
      <TopBar title="תבניות" subtitle="תבניות תוכן לשימוש חוזר" />
      <div className="p-6">
        <TemplatesClient />
      </div>
    </>
  );
}
