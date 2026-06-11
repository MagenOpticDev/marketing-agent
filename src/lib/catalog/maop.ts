// Fetches the live Magen Optic catalog from the public WooCommerce
// Store API (no credentials required) and normalizes it into the shape
// of our `products` / `categories` tables.

const STORE_API =
  process.env.MAOP_STORE_API || "https://shop.maop.co.il/wp-json/wc/store/v1";

export interface WooProduct {
  id: number;
  name: string;
  sku: string;
  permalink: string;
  short_description: string;
  description: string;
  prices?: {
    price?: string;
    currency_minor_unit?: number;
    currency_symbol?: string;
  };
  categories?: { id: number; name: string; slug: string }[];
  images?: { src: string }[];
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface NormalizedProduct {
  external_id: string;
  source: "maop";
  name: string;
  sku: string | null;
  description: string | null;
  features: string[];
  price_range: string | null;
  images: string[];
  catalog_url: string;
  category_name: string | null;
  is_active: boolean;
}

// Strip HTML tags / entities and collapse whitespace into clean text the
// AI can use directly in prompts.
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|div|li|br|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#8362;/g, "₪")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatPrice(p?: WooProduct["prices"]): string | null {
  if (!p?.price) return null;
  const minor = p.currency_minor_unit ?? 2;
  const value = Number(p.price) / Math.pow(10, minor);
  if (!value || Number.isNaN(value)) return null;
  return `${p.currency_symbol || "₪"}${value.toLocaleString("he-IL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function normalize(p: WooProduct): NormalizedProduct {
  const shortText = stripHtml(p.short_description);
  const longText = stripHtml(p.description);
  const description = shortText || longText || null;
  // Derive bullet "features" from the longer description's lines.
  const features = longText
    ? longText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 8 && l.length < 200)
        .slice(0, 6)
    : [];

  return {
    external_id: String(p.id),
    source: "maop",
    name: p.name,
    sku: p.sku || null,
    description,
    features,
    price_range: formatPrice(p.prices),
    images: (p.images || []).map((i) => i.src).slice(0, 5),
    catalog_url: p.permalink,
    category_name: p.categories?.[0]?.name || null,
    is_active: true,
  };
}

async function getJson<T>(path: string): Promise<{ data: T; total: number }> {
  const res = await fetch(`${STORE_API}${path}`, {
    headers: { Accept: "application/json" },
    // Always fetch fresh catalog data on an explicit sync.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Store API ${path} returned ${res.status}`);
  }
  const total = Number(res.headers.get("x-wp-total") || 0);
  // The Store API responds with a leading UTF-8 BOM that breaks JSON.parse
  // (Node's undici fetch does not strip it), so parse the text ourselves.
  const text = (await res.text()).replace(/^﻿/, "");
  const data = JSON.parse(text) as T;
  return { data, total };
}

// Pull every product, paging through the Store API.
export async function fetchAllProducts(): Promise<NormalizedProduct[]> {
  const perPage = 100;
  const first = await getJson<WooProduct[]>(
    `/products?per_page=${perPage}&page=1`
  );
  const totalPages = Math.max(1, Math.ceil((first.total || perPage) / perPage));
  let all = [...first.data];

  for (let page = 2; page <= totalPages; page++) {
    const { data } = await getJson<WooProduct[]>(
      `/products?per_page=${perPage}&page=${page}`
    );
    if (!data.length) break;
    all = all.concat(data);
  }

  return all.map(normalize);
}

export async function fetchCategories(): Promise<WooCategory[]> {
  const { data } = await getJson<WooCategory[]>(
    `/products/categories?per_page=100`
  );
  return data.filter((c) => c.count > 0);
}
