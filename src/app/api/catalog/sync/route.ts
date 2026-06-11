import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  fetchAllProducts,
  fetchCategories,
  stripHtml,
} from "@/lib/catalog/maop";

// Allow up to 60s — fetching ~500 products across several pages.
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

    // Only admins / managers may modify the catalog.
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
        { error: "רק מנהל יכול לסנכרן את הקטלוג" },
        { status: 403 }
      );
    }

    // 1) Sync categories first so we can map products to category_id.
    const wooCategories = await fetchCategories();
    if (wooCategories.length) {
      await supabase.from("categories").upsert(
        wooCategories.map((c) => ({
          name: c.name,
          description: stripHtml(c.description).slice(0, 1000) || null,
        })),
        { onConflict: "name", ignoreDuplicates: false }
      );
    }

    const { data: categoryRows } = await supabase
      .from("categories")
      .select("id, name");
    const categoryIdByName = new Map(
      (categoryRows || []).map((c) => [c.name, c.id])
    );

    // 2) Fetch + upsert all products.
    const products = await fetchAllProducts();
    const now = new Date().toISOString();

    const rows = products.map((p) => ({
      source: p.source,
      external_id: p.external_id,
      name: p.name,
      sku: p.sku,
      description: p.description,
      features: p.features,
      price_range: p.price_range,
      images: p.images,
      catalog_url: p.catalog_url,
      category_id: p.category_name
        ? categoryIdByName.get(p.category_name) ?? null
        : null,
      is_active: p.is_active,
      last_synced_at: now,
    }));

    // Upsert in batches to stay within payload limits.
    const batchSize = 100;
    let synced = 0;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error } = await supabase
        .from("products")
        .upsert(batch, { onConflict: "source,external_id" });
      if (error) {
        console.error("Catalog upsert error:", error);
        return NextResponse.json(
          { error: `שגיאה בשמירת מוצרים: ${error.message}` },
          { status: 500 }
        );
      }
      synced += batch.length;
    }

    return NextResponse.json({
      synced,
      categories: wooCategories.length,
    });
  } catch (error) {
    console.error("Catalog sync error:", error);
    const message =
      error instanceof Error ? error.message : "שגיאה לא ידועה בסנכרון";
    return NextResponse.json(
      { error: `סנכרון נכשל: ${message}` },
      { status: 500 }
    );
  }
}
