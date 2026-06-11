// Pulls Magen Optic blog / guide articles from the public WordPress REST
// API (maop.co.il) and normalizes them into `documents` rows so they
// enrich the knowledge base with real safety-domain context.

import { stripHtml } from "@/lib/catalog/maop";

const WP_API = process.env.MAOP_WP_API || "https://maop.co.il/wp-json/wp/v2";

interface WpPost {
  id: number;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: { "wp:term"?: { name: string }[][] };
}

export interface NormalizedArticle {
  external_id: string;
  name: string;
  description: string | null;
  extracted_text: string;
  file_url: string;
  tags: string[];
  published_at: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#8217;|&#8216;|&#8242;/g, "'")
    .replace(/&#8220;|&#8221;|&#8243;/g, '"')
    .replace(/&#8211;|&#8212;/g, "-")
    .replace(/&#160;|&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#?[a-z0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(p: WpPost): NormalizedArticle {
  const terms = p._embedded?.["wp:term"]
    ? p._embedded["wp:term"].flat().map((t) => t.name)
    : [];
  // Dedupe tags, keep order.
  const tags = Array.from(new Set(terms)).slice(0, 10);

  return {
    external_id: String(p.id),
    name: decodeEntities(p.title.rendered),
    description: decodeEntities(p.excerpt.rendered).slice(0, 500) || null,
    extracted_text: stripHtml(p.content.rendered),
    file_url: p.link,
    tags,
    published_at: p.date,
  };
}

async function getJson<T>(path: string): Promise<{ data: T; total: number }> {
  const res = await fetch(`${WP_API}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`WP API ${path} returned ${res.status}`);
  const total = Number(res.headers.get("x-wp-total") || 0);
  // WordPress responses can carry a leading UTF-8 BOM that breaks JSON.parse.
  const text = (await res.text()).replace(/^﻿/, "");
  return { data: JSON.parse(text) as T, total };
}

// Fetch every published post/guide, paging through the API.
export async function fetchAllArticles(): Promise<NormalizedArticle[]> {
  const perPage = 50;
  const first = await getJson<WpPost[]>(
    `/posts?per_page=${perPage}&page=1&_embed=1`
  );
  const totalPages = Math.max(1, Math.ceil((first.total || perPage) / perPage));
  let all = [...first.data];

  for (let page = 2; page <= totalPages; page++) {
    const { data } = await getJson<WpPost[]>(
      `/posts?per_page=${perPage}&page=${page}&_embed=1`
    );
    if (!data.length) break;
    all = all.concat(data);
  }

  return all.map(normalize);
}
