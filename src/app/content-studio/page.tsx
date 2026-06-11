export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import ContentStudio from "@/components/content-studio/ContentStudio";

export default async function ContentStudioPage() {
  const supabase = await createClient();

  const [{ data: products }, { data: campaigns }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, category_id")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("campaigns")
      .select("id, name")
      .in("status", ["draft", "active"])
      .order("name"),
  ]);

  return (
    <>
      <TopBar
        title="סטודיו תוכן AI"
        subtitle="יצירת תוכן שיווקי ומכירתי חכם"
      />
      <div className="p-6">
        <ContentStudio
          products={products || []}
          campaigns={campaigns || []}
        />
      </div>
    </>
  );
}
