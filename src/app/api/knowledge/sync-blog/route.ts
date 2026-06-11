import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAllArticles } from "@/lib/knowledge/blog";

// Allow up to 60s — fetching + storing ~44 articles.
export const maxDuration = 60;

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (
      !profile ||
      !["admin", "marketing_manager", "sales_manager"].includes(profile.role)
    ) {
      return NextResponse.json(
        { error: "רק מנהל יכול לסנכרן את בסיס הידע" },
        { status: 403 }
      );
    }

    const articles = await fetchAllArticles();

    // Idempotent without a schema change: skip articles already imported
    // (matched by their source URL).
    const { data: existing } = await supabase
      .from("documents")
      .select("file_url")
      .eq("file_type", "article");
    const known = new Set((existing || []).map((d) => d.file_url));

    const rows = articles
      .filter((a) => !known.has(a.file_url))
      .map((a) => ({
        name: a.name,
        description: a.description,
        file_type: "article",
        file_url: a.file_url,
        extracted_text: a.extracted_text,
        tags: a.tags,
        uploaded_by: user.id,
      }));

    let imported = 0;
    if (rows.length) {
      const { error } = await supabase.from("documents").insert(rows);
      if (error) {
        console.error("Blog sync insert error:", error);
        return NextResponse.json(
          { error: `שגיאה בשמירת מאמרים: ${error.message}` },
          { status: 500 }
        );
      }
      imported = rows.length;
    }

    return NextResponse.json({
      imported,
      skipped: articles.length - imported,
      total: articles.length,
    });
  } catch (error) {
    console.error("Blog sync error:", error);
    const message =
      error instanceof Error ? error.message : "שגיאה לא ידועה בסנכרון";
    return NextResponse.json(
      { error: `סנכרון נכשל: ${message}` },
      { status: 500 }
    );
  }
}
