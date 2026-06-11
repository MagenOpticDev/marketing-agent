-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is admin or manager
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'marketing_manager', 'sales_manager')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =====================
-- PROFILES POLICIES
-- =====================
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin_or_manager());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (is_admin());

-- =====================
-- COMPANY SETTINGS POLICIES
-- =====================
CREATE POLICY "All authenticated can view settings" ON company_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can modify settings" ON company_settings FOR ALL USING (is_admin());

-- =====================
-- CATALOG POLICIES (read = all auth, write = admin/manager)
-- =====================
CREATE POLICY "All auth can view categories" ON categories FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can modify categories" ON categories FOR ALL USING (is_admin_or_manager());

CREATE POLICY "All auth can view brands" ON brands FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can modify brands" ON brands FOR ALL USING (is_admin_or_manager());

CREATE POLICY "All auth can view suppliers" ON suppliers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can modify suppliers" ON suppliers FOR ALL USING (is_admin_or_manager());

CREATE POLICY "All auth can view products" ON products FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can modify products" ON products FOR ALL USING (is_admin_or_manager());

-- =====================
-- CAMPAIGNS POLICIES
-- =====================
CREATE POLICY "All auth can view campaigns" ON campaigns FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can modify campaigns" ON campaigns FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Sales agents can insert campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "All auth can view campaign contents" ON campaign_contents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can insert campaign content" ON campaign_contents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can update campaign content" ON campaign_contents FOR UPDATE USING (is_admin_or_manager());

-- =====================
-- GENERATED CONTENT POLICIES
-- =====================
CREATE POLICY "Users can view own content" ON generated_contents FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Managers can view all content" ON generated_contents FOR SELECT USING (is_admin_or_manager());
CREATE POLICY "Auth users can create content" ON generated_contents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own draft content" ON generated_contents FOR UPDATE USING (
  created_by = auth.uid() AND status = 'draft'
);
CREATE POLICY "Managers can update any content" ON generated_contents FOR UPDATE USING (is_admin_or_manager());

-- =====================
-- LEADS POLICIES
-- =====================
CREATE POLICY "Users can view assigned leads" ON leads FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Managers can view all leads" ON leads FOR SELECT USING (is_admin_or_manager());
CREATE POLICY "Auth users can create leads" ON leads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update assigned leads" ON leads FOR UPDATE USING (assigned_to = auth.uid());
CREATE POLICY "Managers can update all leads" ON leads FOR UPDATE USING (is_admin_or_manager());

-- =====================
-- TASKS POLICIES
-- =====================
CREATE POLICY "Users can view assigned tasks" ON tasks FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Managers can view all tasks" ON tasks FOR SELECT USING (is_admin_or_manager());
CREATE POLICY "Auth users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update assigned tasks" ON tasks FOR UPDATE USING (assigned_to = auth.uid());
CREATE POLICY "Managers can update all tasks" ON tasks FOR UPDATE USING (is_admin_or_manager());

-- =====================
-- DOCUMENTS POLICIES
-- =====================
CREATE POLICY "All auth can view documents" ON documents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can upload documents" ON documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can modify documents" ON documents FOR UPDATE USING (is_admin_or_manager());
CREATE POLICY "Admins can delete documents" ON documents FOR DELETE USING (is_admin());

CREATE POLICY "All auth can view chunks" ON document_chunks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert chunks" ON document_chunks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================
-- APPROVALS POLICIES
-- =====================
CREATE POLICY "All auth can view approvals" ON approvals FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can request approval" ON approvals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can review approvals" ON approvals FOR UPDATE USING (is_admin_or_manager());

-- =====================
-- AUDIT LOG POLICIES
-- =====================
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);
