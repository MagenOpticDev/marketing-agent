export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import KnowledgeBaseClient from "@/components/knowledge-base/KnowledgeBaseClient";

export default async function KnowledgeBasePage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <TopBar title="בסיס ידע" subtitle="מסמכים, קטלוגים, תעודות ומידע מוצרים" />
      <div className="p-6">
        <KnowledgeBaseClient initialDocuments={documents || []} />
      </div>
    </>
  );
}
