-- =====================
-- SEED: COMPANY SETTINGS
-- =====================
INSERT INTO company_settings (company_name, phone, email, websites, default_cta, brand_voice, ai_provider, ai_model)
VALUES (
  'מגן אופטיק בע"מ',
  '03-9617602',
  'info@maop.co.il',
  ARRAY['maop.co.il', 'shop.maop.co.il', 'evengear.co.il'],
  'צרו קשר עכשיו: 03-9617602 | info@maop.co.il | www.maop.co.il',
  'מקצועי, ברור, פרקטי, ממוקד מכירות B2B. מומחיות בטיחות חזקה. עברית עסקית טבעית וברורה.',
  'anthropic',
  'claude-sonnet-4-6'
) ON CONFLICT DO NOTHING;

-- =====================
-- SEED: CATEGORIES
-- =====================
INSERT INTO categories (id, name, name_en, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'ציוד מיגון אישי (PPE)', 'Personal Protective Equipment', 1),
  ('11111111-1111-1111-1111-111111111102', 'עבודה בגובה ומניעת נפילות', 'Work at Height & Fall Arrest', 2),
  ('11111111-1111-1111-1111-111111111103', 'ציוד חילוץ והצלה', 'Rescue Equipment', 3),
  ('11111111-1111-1111-1111-111111111104', 'גז וזיהוי גזים', 'Gas Detection', 4),
  ('11111111-1111-1111-1111-111111111105', 'נעלי בטיחות', 'Safety Shoes', 5),
  ('11111111-1111-1111-1111-111111111106', 'הגנת דרכי נשימה', 'Respiratory Protection', 6),
  ('11111111-1111-1111-1111-111111111107', 'הגנת ראש', 'Head Protection', 7),
  ('11111111-1111-1111-1111-111111111108', 'הגנת עיניים ופנים', 'Eye & Face Protection', 8),
  ('11111111-1111-1111-1111-111111111109', 'כפפות הגנה', 'Protective Gloves', 9),
  ('11111111-1111-1111-1111-111111111110', 'הגנת גוף ובגדי עבודה', 'Protective Clothing', 10),
  ('11111111-1111-1111-1111-111111111111', 'חליפות כימיות', 'Chemical Suits', 11),
  ('11111111-1111-1111-1111-111111111112', 'מקלחות חירום ועין', 'Emergency Showers', 12),
  ('11111111-1111-1111-1111-111111111113', 'ציוד כיבוי אש וחירום', 'Firefighter & Emergency Equipment', 13),
  ('11111111-1111-1111-1111-111111111114', 'אחסון חומרים מסוכנים', 'Hazardous Material Storage', 14),
  ('11111111-1111-1111-1111-111111111115', 'הגנת שמיעה', 'Hearing Protection', 15)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- SEED: BRANDS
-- =====================
INSERT INTO brands (id, name, country, categories) VALUES
  ('22222222-2222-2222-2222-222222222201', '3M', 'USA', ARRAY['respiratory', 'eye_protection', 'hearing', 'head_protection']),
  ('22222222-2222-2222-2222-222222222202', 'Honeywell', 'USA', ARRAY['gas_detection', 'respiratory', 'eye_protection', 'fall_arrest']),
  ('22222222-2222-2222-2222-222222222203', 'PIP', 'USA', ARRAY['gloves', 'ppe']),
  ('22222222-2222-2222-2222-222222222204', 'IKAR', 'Germany', ARRAY['fall_arrest', 'rescue']),
  ('22222222-2222-2222-2222-222222222205', 'SKYLOTEC', 'Germany', ARRAY['fall_arrest', 'rescue', 'rope_access']),
  ('22222222-2222-2222-2222-222222222206', 'PROTEKT', 'Poland', ARRAY['fall_arrest', 'ppe']),
  ('22222222-2222-2222-2222-222222222207', 'PUMA Safety', 'Germany', ARRAY['safety_shoes']),
  ('22222222-2222-2222-2222-222222222208', 'ALBATROS', 'Germany', ARRAY['safety_shoes']),
  ('22222222-2222-2222-2222-222222222209', 'CMC Rescue', 'USA', ARRAY['rescue', 'rope_access']),
  ('22222222-2222-2222-2222-222222222210', 'COURANT', 'France', ARRAY['fall_arrest', 'rescue', 'rope_access']),
  ('22222222-2222-2222-2222-222222222211', 'Pacific Helmets', 'New Zealand', ARRAY['head_protection', 'rescue']),
  ('22222222-2222-2222-2222-222222222212', 'BLS', 'Turkey', ARRAY['respiratory']),
  ('22222222-2222-2222-2222-222222222213', 'MARTOR', 'Germany', ARRAY['cutting_tools', 'safety']),
  ('22222222-2222-2222-2222-222222222214', 'Portwest', 'Ireland', ARRAY['ppe', 'gloves', 'clothing', 'footwear']),
  ('22222222-2222-2222-2222-222222222215', 'Kappler', 'USA', ARRAY['chemical_suits', 'protective_clothing']),
  ('22222222-2222-2222-2222-222222222216', 'Ronin', 'Israel', ARRAY['ppe', 'safety'])
ON CONFLICT (id) DO NOTHING;

-- =====================
-- SEED: SAMPLE PRODUCTS
-- =====================
INSERT INTO products (name, name_en, category_id, brand_id, description, features, target_customers, marketing_angles, common_objections, is_active) VALUES
(
  'רתמת בטיחות מלאה SKYLOTEC',
  'SKYLOTEC Full Body Harness',
  '11111111-1111-1111-1111-111111111102',
  '22222222-2222-2222-2222-222222222205',
  'רתמת בטיחות מלאה עם 5 נקודות עיגון, עמידה בתקנים EN 361/358/813',
  ARRAY['5 נקודות עיגון', 'מתאים לעבודה בגובה', 'תואם EN 361/358/813', 'אבזמי נעילה מהירה', 'מותאם ארגונומית'],
  ARRAY['construction_contractors', 'rope_access', 'energy', 'municipalities'],
  ARRAY['בטיחות מקסימלית לעובדים בגובה', 'עמידה בתקנים אירופיים', 'נוחות לאורך משמרת שלמה'],
  ARRAY['המחיר גבוה', 'יש לנו פתרון זול יותר'],
  true
),
(
  'מסכת גז 3M 7500',
  '3M 7500 Half Face Respirator',
  '11111111-1111-1111-1111-111111111106',
  '22222222-2222-2222-2222-222222222201',
  'מסכת חצי פנים לסינון גזים ואדים, סדרה 7500 המוכרת של 3M',
  ARRAY['פנים קטנות לנוחות מקסימלית', 'חיבור עם מסנני 6000', 'תאימות EN 140', 'רצועה לא החלקה'],
  ARRAY['industrial_factories', 'construction_contractors', 'safety_managers'],
  ARRAY['המותג המוביל בעולם', 'נוחות עם אוויר קל לנשימה', 'מגן מפני מגוון רחב של גזים'],
  ARRAY['יקר ממסכות חד פעמיות', 'צריך לשמור על ניקיון'],
  true
),
(
  'גלאי גז נייד Honeywell',
  'Honeywell BW Clip Gas Detector',
  '11111111-1111-1111-1111-111111111104',
  '22222222-2222-2222-2222-222222222202',
  'גלאי גז נייד לגז בודד, סדרת BW Clip - ניתן זריקה לאחר 2 שנים',
  ARRAY['פעיל 2 שנים ללא תחזוקה', 'גלאי חד פעמי חסכוני', 'אזעקה קולית ורטט', 'עמידות IP66/68'],
  ARRAY['construction_contractors', 'industrial_factories', 'energy', 'rescue'],
  ARRAY['ללא תחזוקה לשנתיים', 'עלות בעלות נמוכה', 'אמין ומוכח בשטח'],
  ARRAY['חד פעמי זה בזבוז', 'מה עם כיול?'],
  true
),
(
  'נעל בטיחות PUMA Safety',
  'PUMA Safety Cascades Low',
  '11111111-1111-1111-1111-111111111105',
  '22222222-2222-2222-2222-222222222207',
  'נעל בטיחות S3 SRC עם פלטה מפלדה ומדרס אנטי-סטטי',
  ARRAY['ראש פלדה', 'פלטת פלדה בסוליה', 'תקן S3 SRC', 'אנטי-סטטי ESD', 'עמידה בשמן'],
  ARRAY['construction_contractors', 'industrial_factories', 'logistics', 'maintenance'],
  ARRAY['PUMA - הסגנון עם הבטיחות', 'מרגיש כמו נעל ספורט', 'מתאים לשמירה כל היום'],
  ARRAY['יקר', 'PUMA זה מותג ספורט'],
  true
),
(
  'כפפות ניטריל Portwest',
  'Portwest Nitrile Gloves',
  '11111111-1111-1111-1111-111111111109',
  '22222222-2222-2222-2222-222222222214',
  'כפפות ניטריל חד פעמיות בלתי-אלרגניות, מתאימות לשימוש תעשייתי ורפואי',
  ARRAY['ניטריל - ללא לטקס', 'עמידות לנפט ושמנים', 'מגע מדויק', 'מבחן AQL 1.5'],
  ARRAY['industrial_factories', 'maintenance', 'safety_managers'],
  ARRAY['פתרון לכל עבודות הגנת הידיים', 'עבור רגישים ללטקס', 'ניתן לרכוש בכמויות גדולות'],
  ARRAY['יקר מלטקס', 'מה ההבדל מניטריל רגיל?'],
  true
),
(
  'קסדת עבודה Pacific Helmets',
  'Pacific Helmets F6 Industrial',
  '11111111-1111-1111-1111-111111111107',
  '22222222-2222-2222-2222-222222222211',
  'קסדת עבודה תעשייתית Class E, UV מייצב, מתאים לעבודות בניה, תשתיות ותעשייה',
  ARRAY['Class E - 20,000V', 'עמידות לחות גבוהה', 'יציבות UV', 'עיגון לתצוגה ולמגן פנים', 'גוונים שונים'],
  ARRAY['construction_contractors', 'energy', 'municipalities', 'electric_corp'],
  ARRAY['הגנת ראש מהמובילות בשוק', 'עמידה בתנאי חוץ', 'מוכרת לחברת החשמל'],
  ARRAY['יש כבר קסדות', 'מה עדיף על קסדה פשוטה?'],
  true
)
ON CONFLICT DO NOTHING;

-- =====================
-- SEED: SAMPLE CAMPAIGN
-- =====================
INSERT INTO campaigns (name, description, target_audience, goal, channels, status, notes)
VALUES (
  'קמפיין קיץ - עבודה בגובה',
  'קמפיין שיווקי לציוד עבודה בגובה לקראת עונת הבניה',
  'קבלני בניה ומנהלי בטיחות',
  'יצירת 20 לידים חמים לציוד עבודה בגובה',
  ARRAY['whatsapp', 'email', 'linkedin']::campaign_channel[],
  'draft',
  'להתחיל בחודש הבא - לאחר אישור תקציב'
) ON CONFLICT DO NOTHING;
