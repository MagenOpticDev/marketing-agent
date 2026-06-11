export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import ProductsClient from "@/components/products/ProductsClient";

export default async function ProductsPage() {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }, { data: brands }] = await Promise.all([
    supabase
      .from("products")
      .select("*, brand:brands(id, name), category:categories(id, name)")
      .order("name"),
    supabase.from("categories").select("id, name").order("sort_order"),
    supabase.from("brands").select("id, name").order("name"),
  ]);

  return (
    <>
      <TopBar
        title="מוצרים ומותגים"
        subtitle="ניהול קטלוג מוצרים ובסיס הידע השיווקי"
      />
      <div className="p-6">
        <ProductsClient
          initialProducts={products || []}
          categories={categories || []}
          brands={brands || []}
        />
      </div>
    </>
  );
}
