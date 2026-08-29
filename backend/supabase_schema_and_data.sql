-- ==============================================================================
-- 🥬 KAIKAARI (VEGETABLE E-COMMERCE) — COMPLETE SUPABASE SQL SCHEMA & SEED DATA
-- ==============================================================================
-- Instructions for Supabase:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "+ New query", paste this entire script and click "RUN"
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- ─── 2.1 Category Table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "tamilName" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "emoji" TEXT NOT NULL,
  "color" TEXT DEFAULT 'emerald',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 2.2 Product Table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "tamilName" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "unit" TEXT DEFAULT 'kg' NOT NULL, -- 'kg', 'g', 'piece', 'bunch'
  "imageUrl" TEXT,
  "emoji" TEXT DEFAULT '🥬' NOT NULL,
  "description" TEXT,
  "inStock" BOOLEAN DEFAULT true NOT NULL,
  "discount" INTEGER DEFAULT 0,
  "isPopular" BOOLEAN DEFAULT false NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 2.3 Order Table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "customerAddress" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT DEFAULT 'pending' NOT NULL, -- pending, confirmed, preparing, out-for-delivery, delivered, cancelled
  "total" DOUBLE PRECISION NOT NULL,
  "items" TEXT NOT NULL, -- JSON stringified array of items
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 2.4 Store Settings Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "StoreSetting" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT UNIQUE NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StoreSetting" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public read on Category" ON "Category";
DROP POLICY IF EXISTS "Public read on Product" ON "Product";
DROP POLICY IF EXISTS "Public read on StoreSetting" ON "StoreSetting";
DROP POLICY IF EXISTS "Public insert on Order" ON "Order";
DROP POLICY IF EXISTS "Public read on Order" ON "Order";
DROP POLICY IF EXISTS "Admin full access Category" ON "Category";
DROP POLICY IF EXISTS "Admin full access Product" ON "Product";
DROP POLICY IF EXISTS "Admin full access Order" ON "Order";
DROP POLICY IF EXISTS "Admin full access StoreSetting" ON "StoreSetting";

-- Public read access (Customers can browse categories, products, timings)
CREATE POLICY "Public read on Category" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Public read on Product" ON "Product" FOR SELECT USING (true);
CREATE POLICY "Public read on StoreSetting" ON "StoreSetting" FOR SELECT USING (true);

-- Customers can submit orders
CREATE POLICY "Public insert on Order" ON "Order" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read on Order" ON "Order" FOR SELECT USING (true);

-- Full admin access (Insert, Update, Delete for all tables)
CREATE POLICY "Admin full access Category" ON "Category" FOR ALL USING (true);
CREATE POLICY "Admin full access Product" ON "Product" FOR ALL USING (true);
CREATE POLICY "Admin full access Order" ON "Order" FOR ALL USING (true);
CREATE POLICY "Admin full access StoreSetting" ON "StoreSetting" FOR ALL USING (true);

-- ==============================================================================
-- 4. SEED DATA INSERTION
-- ==============================================================================

-- ─── 4.1 Insert Categories ─────────────────────────────────────────────────────
INSERT INTO "Category" ("name", "tamilName", "slug", "emoji", "color")
VALUES
  ('Leafy Greens', 'கீரை வகைகள்', 'leafy-greens', '🥬', 'emerald'),
  ('Root Vegetables', 'கிழங்கு வகைகள்', 'root-vegetables', '🥕', 'orange'),
  ('Gourds', 'சுரை வகைகள்', 'gourds', '🥒', 'lime'),
  ('Daily Essentials', 'தினசரி தேவை', 'daily-essentials', '🧅', 'rose'),
  ('Fruits & Vegetables', 'காய்கறிகள்', 'fruits-vegetables', '🍅', 'yellow')
ON CONFLICT ("slug") DO UPDATE 
SET "name" = EXCLUDED."name", "tamilName" = EXCLUDED."tamilName", "emoji" = EXCLUDED."emoji";

-- ─── 4.2 Insert 25 Real Vegetables with Tamil Names & Unsplash Images ─────────
INSERT INTO "Product" (
  "name", "tamilName", "price", "unit", "emoji", "imageUrl", "description", "inStock", "discount", "isPopular", "categoryId"
)
VALUES
  -- 1. Country Tomato
  (
    'Country Tomato', 'நாட்டு தக்காளி', 35, 'kg', '🍅',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    'Fresh farm-picked country tomatoes with natural tangy flavor. Great for rasam and curries.',
    true, 10, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 2. Small Onion (Shallots)
  (
    'Small Onion (Shallots)', 'சின்ன வெங்காயம்', 80, 'kg', '🧅',
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    'Traditional sambar onions packed with medicinal benefits and rich flavor.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'daily-essentials')
  ),

  -- 3. Big Onion
  (
    'Big Onion', 'பெரிய வெங்காயம்', 45, 'kg', '🧅',
    'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80',
    'Crisp and pungent red onions essential for everyday cooking.',
    true, 5, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'daily-essentials')
  ),

  -- 4. Potato
  (
    'Potato', 'உருளைக்கிழங்கு', 40, 'kg', '🥔',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    'Nutritious mountain potatoes, perfect for frying, curries, and roasting.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'root-vegetables')
  ),

  -- 5. Ooty Carrot
  (
    'Ooty Carrot', 'ஊட்டி கேரட்', 60, 'kg', '🥕',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
    'Crunchy sweet Ooty carrots rich in Vitamin A and fresh antioxidants.',
    true, 15, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'root-vegetables')
  ),

  -- 6. French Beans
  (
    'French Beans', 'பீன்ஸ்', 75, 'kg', '🫛',
    'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=500&auto=format&fit=crop&q=80',
    'Crisp tender beans harvested fresh every morning.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 7. Purple Brinjal
  (
    'Purple Brinjal (Eggplant)', 'கத்தரிக்காய்', 45, 'kg', '🍆',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    'Glossy fresh brinjals ideal for ennai kathirikkai and sambar.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 8. Lady''s Finger (Okra)
  (
    'Lady''s Finger (Okra)', 'வெண்டைக்காய்', 50, 'kg', '🌿',
    'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=500&auto=format&fit=crop&q=80',
    'Tender, snap-fresh okra rich in dietary fiber and nutrients.',
    true, 10, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 9. Green Capsicum
  (
    'Green Capsicum', 'குடைமிளகாய்', 65, 'kg', '🫑',
    'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80',
    'Crisp bell peppers for stir-fries, fried rice, and salads.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 10. Cabbage
  (
    'Cabbage', 'முட்டைக்கோஸ்', 30, 'kg', '🥬',
    'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=500&auto=format&fit=crop&q=80',
    'Dense, tightly packed green cabbage heads freshly picked.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'leafy-greens')
  ),

  -- 11. Fresh Cauliflower
  (
    'Fresh Cauliflower', 'காலிஃபிளவர்', 45, 'piece', '🥦',
    'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80',
    'Whole white florets free from blemishes, perfect for curry or gobi 65.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 12. Drumstick
  (
    'Drumstick', 'முருங்கைக்காய்', 15, 'piece', '🥢',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80',
    'Aromatic and fleshy drumsticks for traditional village-style sambar.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 13. Bitter Gourd
  (
    'Bitter Gourd', 'பாகற்காய்', 55, 'kg', '🥒',
    'https://images.unsplash.com/photo-1628773822503-930a8420311f?w=500&auto=format&fit=crop&q=80',
    'Small dark green bitter gourds loaded with health benefits.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'gourds')
  ),

  -- 14. Bottle Gourd
  (
    'Bottle Gourd', 'சுரைக்காய்', 35, 'kg', '🥒',
    'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80',
    'Hydrating, light gourd great for kootu and digestive health.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'gourds')
  ),

  -- 15. Snake Gourd
  (
    'Snake Gourd', 'புடலங்காய்', 40, 'kg', '🥒',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=80',
    'Fresh light green snake gourd for nourishing south Indian kootu.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'gourds')
  ),

  -- 16. Beetroot
  (
    'Beetroot', 'பீட்ரூட்', 45, 'kg', '🟣',
    'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=500&auto=format&fit=crop&q=80',
    'Vibrant ruby red beetroots rich in iron and natural sweetness.',
    true, 5, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'root-vegetables')
  ),

  -- 17. White Radish
  (
    'White Radish', 'முள்ளங்கி', 35, 'kg', '⚪',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
    'Crisp, spicy white radishes perfect for sambar and parathas.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'root-vegetables')
  ),

  -- 18. Palak (Spinach)
  (
    'Palak (Spinach)', 'பசலைக்கீரை', 25, 'bunch', '🥬',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    'Tender washed green spinach bunches bursting with iron.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'leafy-greens')
  ),

  -- 19. Fresh Coriander
  (
    'Fresh Coriander', 'கொத்தமல்லி', 15, 'bunch', '🌿',
    'https://images.unsplash.com/photo-1589135233689-d56d812328bb?w=500&auto=format&fit=crop&q=80',
    'Fragrant freshly cut coriander leaves for garnishing and chutney.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'leafy-greens')
  ),

  -- 20. Curry Leaves
  (
    'Curry Leaves', 'கறிவேப்பிலை', 10, 'bunch', '🍃',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    'Intensely aromatic fresh curry leaves, a south Indian kitchen must-have.',
    true, 0, false,
    (SELECT "id" FROM "Category" WHERE "slug" = 'leafy-greens')
  ),

  -- 21. Spicy Green Chilli
  (
    'Spicy Green Chilli', 'பச்சை மிளகாய்', 60, 'kg', '🌶️',
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80',
    'Fiery, sharp green chillies to add authentic kick to dishes.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'daily-essentials')
  ),

  -- 22. Fresh Ginger
  (
    'Fresh Ginger', 'இஞ்சி', 120, 'kg', '🫚',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    'Juicy, zesty ginger roots for morning tea and rich curries.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'daily-essentials')
  ),

  -- 23. Country Garlic
  (
    'Country Garlic', 'நாட்டு பூண்டு', 180, 'kg', '🧄',
    'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80',
    'Robust small garlic pods loaded with allicin and strong punchy aroma.',
    true, 5, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'daily-essentials')
  ),

  -- 24. Juicy Yellow Lemon
  (
    'Juicy Yellow Lemon', 'எலுமிச்சை', 5, 'piece', '🍋',
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=80',
    'Plump ripe lemons full of refreshing juice and Vitamin C.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'fruits-vegetables')
  ),

  -- 25. Fresh Pollachi Coconut
  (
    'Fresh Pollachi Coconut', 'பொள்ளாச்சி தேங்காய்', 35, 'piece', '🥥',
    'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=500&auto=format&fit=crop&q=80',
    'Sweet thick flesh Pollachi coconuts full of natural coconut water.',
    true, 0, true,
    (SELECT "id" FROM "Category" WHERE "slug" = 'daily-essentials')
  );

-- ─── 4.3 Insert Default Store Settings ─────────────────────────────────────────
INSERT INTO "StoreSetting" ("key", "value")
VALUES
  (
    'shop_profile',
    '{"shopName":"Kaikaari 🥬","phone":"+91 98765 43210","address":"123 Anna Salai, Chennai, TN 600002"}'
  ),
  (
    'working_hours',
    '{"openHour":"06","openMinute":"00","openPeriod":"AM","closeHour":"09","closeMinute":"00","closePeriod":"PM","workingDays":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}'
  ),
  (
    'delivery_settings',
    '{"deliveryRadius":"10","minOrder":"100","deliveryCharge":"0"}'
  )
ON CONFLICT ("key") DO NOTHING;

-- ==============================================================================
-- ✅ SUCCESS! ALL 4 TABLES, POLICIES, AND 25 PRODUCE ITEMS ARE READY.
-- ==============================================================================
