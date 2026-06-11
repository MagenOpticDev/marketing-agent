"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ProductForm from "./ProductForm";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Props {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

export default function ProductsClient({
  initialProducts,
  categories,
  brands,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [syncing, setSyncing] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSync = async () => {
    if (
      !confirm(
        "לייבא את כל המוצרים מאתר מגן אופטיק (shop.maop.co.il)? הפעולה תעדכן את הקטלוג."
      )
    )
      return;
    setSyncing(true);
    const toastId = toast.loading("מסנכרן מוצרים מהאתר...");
    try {
      const res = await fetch("/api/catalog/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "סנכרון נכשל");
      toast.success(`${data.synced} מוצרים סונכרנו בהצלחה`, { id: toastId });
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "סנכרון נכשל";
      toast.error(message, { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts((prev) => [product, ...prev]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק מוצר זה?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("שגיאה במחיקה"); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("המוצר נמחק");
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    const matchCategory = !filterCategory || p.category_id === filterCategory;
    const matchBrand = !filterBrand || p.brand_id === filterBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  const categoryOptions = [
    { value: "", label: "כל הקטגוריות" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const brandOptions = [
    { value: "", label: "כל המותגים" },
    ...brands.map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <>
      <div className="space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
            <p className="text-sm text-slate-600">סה&quot;כ מוצרים</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {products.filter((p) => p.is_active).length}
            </p>
            <p className="text-sm text-slate-600">מוצרים פעילים</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.missing_fields && p.missing_fields.length > 0).length}
            </p>
            <p className="text-sm text-slate-600">חסרים שדות</p>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש מוצר..."
              startIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>
          <div className="w-48">
            <Select
              options={categoryOptions}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              options={brandOptions}
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleSync}
            loading={syncing}
            icon={<ArrowPathIcon className="h-4 w-4" />}
          >
            {syncing ? "מסנכרן..." : "סנכרון מהאתר"}
          </Button>
          <Button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            icon={<PlusIcon className="h-4 w-4" />}
          >
            מוצר חדש
          </Button>
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CubeIcon className="h-12 w-12" />}
            title="לא נמצאו מוצרים"
            description="הוסף מוצרים לקטלוג כדי שה-AI יוכל ליצור תוכן מדויק"
            action={{ label: "הוסף מוצר ראשון", onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <Card key={product.id} hover padding="sm" className="group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {product.name}
                    </h3>
                    {product.name_en && (
                      <p className="text-xs text-slate-400 truncate ltr-content">
                        {product.name_en}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingProduct(product); setShowForm(true); }}
                      className="p-1.5 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {product.brand && (
                    <Badge variant="info">{product.brand.name}</Badge>
                  )}
                  {product.category && (
                    <Badge variant="default">{product.category.name}</Badge>
                  )}
                  {!product.is_active && (
                    <Badge variant="warning">לא פעיל</Badge>
                  )}
                </div>

                {product.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                )}

                {product.missing_fields && product.missing_fields.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-50 rounded-lg px-2 py-1.5">
                    <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>חסר: {product.missing_fields.slice(0, 2).join(", ")}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); }}
        title={editingProduct ? "עריכת מוצר" : "הוספת מוצר חדש"}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          brands={brands}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      </Modal>
    </>
  );
}
