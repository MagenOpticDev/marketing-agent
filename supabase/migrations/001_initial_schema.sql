-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================
-- PROFILES & ROLES
-- =====================
CREATE TYPE user_role AS ENUM ('admin', 'marketing_manager', 'sales_manager', 'sales_agent', 'viewer');
CREATE TYPE content_status AS ENUM ('draft', 'pending_approval', 'approved', 'published', 'archived');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'waiting', 'won', 'lost');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE content_type AS ENUM (
  'whatsapp_message', 'email', 'facebook_post', 'linkedin_post', 'product_description',
  'sales_pitch', 'customer_proposal', 'tender_email', 'supplier_email', 'follow_up',
  'product_launch', 'newsletter', 'landing_page', 'sales_script', 'objection_response',
  'campaign_idea', 'seo_blog_outline'
);
CREATE TYPE content_tone AS ENUM ('short_direct', 'professional', 'sales_focused', 'technical', 'executive', 'friendly');
CREATE TYPE content_language AS ENUM ('hebrew', 'english');
CREATE TYPE campaign_channel AS ENUM ('whatsapp', 'email', 'linkedin', 'facebook', 'website', 'sales_agent');
CREATE TYPE ai_provider AS ENUM ('anthropic', 'openai');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'sales_agent',
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- COMPANY SETTINGS
-- =====================
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL DEFAULT 'מגן אופטיק בע"מ',
  phone TEXT DEFAULT '03-9617602',
  email TEXT DEFAULT 'info@maop.co.il',
  websites TEXT[] DEFAULT ARRAY['maop.co.il', 'shop.maop.co.il', 'evengear.co.il'],
  default_cta TEXT DEFAULT 'צרו קשר: 03-9617602 | info@maop.co.il',
  brand_voice TEXT DEFAULT 'מקצועי, ברור, פרקטי, ממוקד מכירות B2B, עם מומחיות בטיחות חזקה',
  ai_provider ai_provider NOT NULL DEFAULT 'anthropic',
  ai_model TEXT DEFAULT 'claude-sonnet-4-6',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- PRODUCTS & CATALOG
-- =====================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  country TEXT,
  website TEXT,
  logo_url TEXT,
  categories TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  brands TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  sku TEXT,
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  supplier_id UUID REFERENCES suppliers(id),
  description TEXT,
  description_en TEXT,
  features TEXT[],
  technical_specs JSONB DEFAULT '{}',
  target_customers TEXT[],
  marketing_angles TEXT[],
  common_objections TEXT[],
  related_product_ids UUID[],
  price_range TEXT,
  certifications TEXT[],
  images TEXT[],
  catalog_url TEXT,
  datasheet_url TEXT,
  supplier_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  missing_fields TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- CAMPAIGNS
-- =====================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  product_ids UUID[],
  category_ids UUID[],
  target_audience TEXT,
  goal TEXT,
  offer TEXT,
  channels campaign_channel[],
  status campaign_status NOT NULL DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  budget NUMERIC(12,2),
  leads_generated INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,
  opportunities INTEGER DEFAULT 0,
  revenue_estimate NUMERIC(12,2),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaign_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  channel campaign_channel NOT NULL,
  content_type content_type NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  language content_language NOT NULL DEFAULT 'hebrew',
  created_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- GENERATED CONTENT
-- =====================
CREATE TABLE generated_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  language content_language NOT NULL DEFAULT 'hebrew',
  tone content_tone,
  product_id UUID REFERENCES products(id),
  campaign_id UUID REFERENCES campaigns(id),
  target_audience TEXT,
  prompt_used TEXT,
  ai_model TEXT,
  created_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- LEADS & TASKS
-- =====================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  product_interest TEXT,
  category_interest TEXT,
  source TEXT,
  assigned_to UUID REFERENCES profiles(id),
  follow_up_date DATE,
  status lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  ai_next_action TEXT,
  ai_follow_up_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  priority task_priority NOT NULL DEFAULT 'medium',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- DOCUMENTS / KNOWLEDGE BASE
-- =====================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  extracted_text TEXT,
  product_ids UUID[],
  brand_ids UUID[],
  category_ids UUID[],
  tags TEXT[],
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index on document chunks
CREATE INDEX idx_document_chunks_content ON document_chunks USING gin(to_tsvector('simple', content));
CREATE INDEX idx_documents_name ON documents USING gin(to_tsvector('simple', name));

-- =====================
-- APPROVALS
-- =====================
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  content_table TEXT NOT NULL CHECK (content_table IN ('generated_contents', 'campaign_contents')),
  requested_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  status approval_status NOT NULL DEFAULT 'pending',
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- =====================
-- AUDIT LOG
-- =====================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_generated_contents_status ON generated_contents(status);
CREATE INDEX idx_generated_contents_created_by ON generated_contents(created_by);
CREATE INDEX idx_generated_contents_type ON generated_contents(content_type);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_follow_up ON leads(follow_up_date);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_campaign_contents_updated_at BEFORE UPDATE ON campaign_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_generated_contents_updated_at BEFORE UPDATE ON generated_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- NEW USER HANDLER
-- =====================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_agent')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
