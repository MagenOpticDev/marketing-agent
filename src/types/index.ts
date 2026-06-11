export type UserRole = "admin" | "marketing_manager" | "sales_manager" | "sales_agent" | "viewer";

export type ContentStatus = "draft" | "pending_approval" | "approved" | "published" | "archived";

export type LeadStatus = "new" | "contacted" | "meeting_scheduled" | "proposal_sent" | "waiting" | "won" | "lost";

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

export type ContentType =
  | "whatsapp_message"
  | "email"
  | "facebook_post"
  | "linkedin_post"
  | "product_description"
  | "sales_pitch"
  | "customer_proposal"
  | "tender_email"
  | "supplier_email"
  | "follow_up"
  | "product_launch"
  | "newsletter"
  | "landing_page"
  | "sales_script"
  | "objection_response"
  | "campaign_idea"
  | "seo_blog_outline";

export type ContentTone = "short_direct" | "professional" | "sales_focused" | "technical" | "executive" | "friendly";

export type ContentLanguage = "hebrew" | "english";

export type Channel = "whatsapp" | "email" | "linkedin" | "facebook" | "website" | "sales_agent";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_id?: string;
  avatar_url?: string;
  phone?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  country?: string;
  website?: string;
  logo_url?: string;
  categories?: string[];
  notes?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  brands?: string[];
  notes?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  parent_id?: string;
  icon?: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  sku?: string;
  category_id?: string;
  brand_id?: string;
  supplier_id?: string;
  description?: string;
  description_en?: string;
  features?: string[];
  technical_specs?: Record<string, string>;
  target_customers?: string[];
  marketing_angles?: string[];
  common_objections?: string[];
  related_product_ids?: string[];
  price_range?: string;
  certifications?: string[];
  images?: string[];
  catalog_url?: string;
  datasheet_url?: string;
  supplier_url?: string;
  is_active: boolean;
  missing_fields?: string[];
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  product_ids?: string[];
  category_ids?: string[];
  target_audience?: string;
  goal?: string;
  offer?: string;
  channels: Channel[];
  status: CampaignStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  leads_generated?: number;
  meetings_booked?: number;
  opportunities?: number;
  revenue_estimate?: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignContent {
  id: string;
  campaign_id: string;
  channel: Channel;
  content_type: ContentType;
  title?: string;
  content: string;
  status: ContentStatus;
  language: ContentLanguage;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface GeneratedContent {
  id: string;
  content_type: ContentType;
  title?: string;
  content: string;
  status: ContentStatus;
  language: ContentLanguage;
  tone?: ContentTone;
  product_id?: string;
  campaign_id?: string;
  target_audience?: string;
  prompt_used?: string;
  ai_model?: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  product_interest?: string;
  category_interest?: string;
  source?: string;
  assigned_to?: string;
  follow_up_date?: string;
  status: LeadStatus;
  notes?: string;
  ai_next_action?: string;
  ai_follow_up_message?: string;
  created_at: string;
  updated_at: string;
  assigned_profile?: Profile;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  lead_id?: string;
  campaign_id?: string;
  assigned_to?: string;
  due_date?: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  created_at: string;
  lead?: Lead;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  extracted_text?: string;
  product_ids?: string[];
  brand_ids?: string[];
  category_ids?: string[];
  tags?: string[];
  uploaded_by: string;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

export interface Approval {
  id: string;
  content_id: string;
  content_type: "generated_content" | "campaign_content";
  requested_by: string;
  reviewed_by?: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
  created_at: string;
  reviewed_at?: string;
  content?: GeneratedContent | CampaignContent;
  requester?: Profile;
  reviewer?: Profile;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  phone: string;
  email: string;
  websites: string[];
  default_cta?: string;
  brand_voice?: string;
  ai_provider: "anthropic" | "openai";
  ai_model?: string;
  logo_url?: string;
}

export interface AIGenerateRequest {
  content_type: ContentType;
  product_id?: string;
  product_name?: string;
  category?: string;
  target_audience?: string;
  tone: ContentTone;
  language: ContentLanguage;
  goal?: string;
  additional_context?: string;
  campaign_id?: string;
  channel?: Channel;
}

export interface AIGenerateResponse {
  content: string;
  title?: string;
  model_used: string;
  prompt_used?: string;
}

export interface DashboardStats {
  active_campaigns: number;
  pending_approvals: number;
  leads_this_month: number;
  content_generated_today: number;
  follow_ups_due: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  name_en: string;
  description?: string;
}

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  { id: "contractors", name: "קבלני בניה", name_en: "Construction Contractors" },
  { id: "factories", name: "מפעלים תעשייתיים", name_en: "Industrial Factories" },
  { id: "energy", name: "מגזר האנרגיה", name_en: "Energy Sector" },
  { id: "electric_corp", name: "חברת החשמל", name_en: "Israel Electric Corporation" },
  { id: "rescue", name: "יחידות חילוץ והצלה", name_en: "Rescue Units" },
  { id: "fire_brigade", name: "כיבוי אש", name_en: "Fire Brigade" },
  { id: "rope_access", name: "חברות עבודה בגובה", name_en: "Rope Access Companies" },
  { id: "municipalities", name: "עיריות ומועצות", name_en: "Municipalities" },
  { id: "logistics", name: "חברות לוגיסטיקה", name_en: "Logistics Companies" },
  { id: "safety_managers", name: "מנהלי בטיחות", name_en: "Safety Managers" },
  { id: "procurement", name: "מנהלי רכש", name_en: "Procurement Managers" },
  { id: "maintenance", name: "מנהלי אחזקה", name_en: "Maintenance Managers" },
];
