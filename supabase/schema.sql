-- =========================================================
-- DELALA MEET (ደላላ MEET) BROKER NETWORK SYSTEM - SUPABASE SCHEMA
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_title_en VARCHAR(255) DEFAULT 'Delala Meet - Broker Network System',
  portal_title_am VARCHAR(255) DEFAULT 'ደላላ Meet - የደላሎች መረብ ሥርዓት',
  logo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
  hero_bg_url TEXT DEFAULT 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all new columns exist on pre-existing system_settings tables
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS office_address TEXT DEFAULT 'Bole Road, Near Friendship Building, Addis Ababa, Ethiopia';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS office_google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=8.9806,38.7578';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS portal_phone VARCHAR(50) DEFAULT '+251 911 000000';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS portal_email VARCHAR(255) DEFAULT 'info@delalameet.et';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 Delala Meet (ደላላ Meet) Portal. All rights reserved.';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS signup_fee_amount NUMERIC DEFAULT 500;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS bank_account_info TEXT DEFAULT 'Commercial Bank of Ethiopia (CBE): 1000123456789 (Delala Meet PLC) / Telebirr: +251 911 000000';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS about_title_en VARCHAR(255) DEFAULT 'About Delala Meet Portal';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS about_title_am VARCHAR(255) DEFAULT 'ስለ ደላላ Meet ፖርታል';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS about_text_en TEXT DEFAULT 'Delala Meet is Ethiopia''s leading digital network connecting brokers, merchants, direct sellers, companies, hotel & cafeteria services, and buyers across land, livestock, furniture, housing, rental shops, barber shops, household equipment, and hospitality.';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS about_text_am TEXT DEFAULT 'ደላላ Meet ኢትዮጵያ ውስጥ ደላሎችን፣ ነጋዴዎችን፣ የቀጥታ ሻጮችን፣ ኩባንያዎችን፣ የሆቴልና ካፌ አገልግሎት ሰጪዎችን እና ገዢዎችን በመሬት፣ በከብቶች፣ በእቃዎች፣ በቤቶች፣ በሚከራዩ ሱቆች፣ በፀጉር ቤቶች፣ በቤት መገልገያዎች እና በሆቴል አገልግሎቶች የሚያገናኝ መሪ ዲጂታል ፖርታል ነው።';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS about_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS telegram_url TEXT DEFAULT 'https://t.me/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT 'https://instagram.com/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT 'https://facebook.com/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS whatsapp_url TEXT DEFAULT 'https://wa.me/251911000000';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT 'https://youtube.com/c/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT 'https://linkedin.com/company/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS discord_url TEXT DEFAULT 'https://discord.gg/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT 'https://x.com/delalameet';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT 'https://tiktok.com/@delalameet';

-- Insert default system settings row if empty
INSERT INTO public.system_settings (
  id, portal_title_en, portal_title_am, logo_url, hero_bg_url,
  office_address, office_google_maps_url, portal_phone, portal_email, copyright_text,
  signup_fee_amount, bank_account_info,
  about_title_en, about_title_am, about_text_en, about_text_am, about_image_url,
  telegram_url, instagram_url, facebook_url, whatsapp_url, youtube_url, linkedin_url, discord_url, twitter_url, tiktok_url
)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  'Delala Meet - Ethiopian Broker Network',
  'ደላላ Meet - የኢትዮጵያ የደላሎች መረብ',
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80',
  'Bole Road, Near Friendship Building, Addis Ababa, Ethiopia',
  'https://maps.google.com/?q=8.9806,38.7578',
  '+251 911 000000',
  'info@delalameet.et',
  '© 2026 Delala Meet (ደላላ Meet) Portal. All rights reserved.',
  500,
  'Commercial Bank of Ethiopia (CBE): 1000123456789 (Delala Meet PLC) / Telebirr: +251 911 000000',
  'About Delala Meet Portal',
  'ስለ ደላላ Meet ፖርታል',
  'Delala Meet is Ethiopia''s leading digital network connecting brokers, merchants, direct sellers, companies, hotel & cafeteria services, and buyers across land, livestock, furniture, housing, rental shops, barber shops, household equipment, and hospitality.',
  'ደላላ Meet ኢትዮጵያ ውስጥ ደላሎችን፣ ነጋዴዎችን፣ የቀጥታ ሻጮችን፣ ኩባንያዎችን፣ የሆቴልና ካፌ አገልግሎት ሰጪዎችን እና ገዢዎችን በመሬት፣ በከብቶች፣ በእቃዎች፣ በቤቶች፣ በሚከራዩ ሱቆች፣ በፀጉር ቤቶች፣ በቤት መገልገያዎች እና በሆቴል አገልግሎቶች የሚያገናኝ መሪ ዲጂታል ፖርታል ነው።',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  'https://t.me/delalameet',
  'https://instagram.com/delalameet',
  'https://facebook.com/delalameet',
  'https://wa.me/251911000000',
  'https://youtube.com/c/delalameet',
  'https://linkedin.com/company/delalameet',
  'https://discord.gg/delalameet',
  'https://x.com/delalameet',
  'https://tiktok.com/@delalameet'
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);


-- 2. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  default_pin VARCHAR(50) NOT NULL,
  custom_password TEXT,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'Broker',
  profile_pic_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('Main Registrar Admin', 'Broker', 'Merchant', 'Direct Seller', 'Company', 'Hotel & Cafeteria', 'Casual User'));


-- 3. SIGNUP REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.signup_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  requested_role VARCHAR(50) NOT NULL DEFAULT 'Broker',
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  generated_username VARCHAR(50),
  generated_pin VARCHAR(10),
  payment_slip_url TEXT,
  payment_slip_file_name TEXT,
  payment_fee_amount NUMERIC DEFAULT 500,
  payment_status VARCHAR(20) DEFAULT 'Pending Payment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.signup_requests DROP CONSTRAINT IF EXISTS signup_requests_requested_role_check;
ALTER TABLE public.signup_requests ADD CONSTRAINT signup_requests_requested_role_check CHECK (requested_role IN ('Broker', 'Merchant', 'Direct Seller', 'Company', 'Hotel & Cafeteria', 'Casual User'));

ALTER TABLE public.signup_requests ADD COLUMN IF NOT EXISTS payment_slip_url TEXT;
ALTER TABLE public.signup_requests ADD COLUMN IF NOT EXISTS payment_slip_file_name TEXT;
ALTER TABLE public.signup_requests ADD COLUMN IF NOT EXISTS payment_fee_amount NUMERIC DEFAULT 500;
ALTER TABLE public.signup_requests ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'Pending Payment';


-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) DEFAULT 'Original' CHECK (condition IN ('Original', 'Used', 'New', 'Refurbished')),
  original_price NUMERIC(12,2) NOT NULL,
  discounted_price NUMERIC(12,2),
  discount_percent NUMERIC(5,2) DEFAULT 0,
  land_sqm NUMERIC(10,2),
  address TEXT NOT NULL,
  google_maps_url TEXT,
  posted_by_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  telegram_link TEXT,
  whatsapp_link TEXT,
  image_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Expired')),
  expiry_date DATE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) DEFAULT 0;


-- 5. RATINGS & REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.ratings_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'New' CHECK (status IN ('New', 'Seen', 'Unseen', 'Old')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 7. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);


-- 8. PASSWORD RESET REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reset', 'Dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- AUTO EXPIRE TRIGGER
CREATE OR REPLACE FUNCTION check_product_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date < CURRENT_DATE AND NEW.status = 'Active' THEN
    NEW.status := 'Expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_product_expiry ON public.products;
CREATE TRIGGER trigger_check_product_expiry
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION check_product_expiry();

-- RLS POLICIES
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Settings" ON public.system_settings;
CREATE POLICY "Public Read Settings" ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Update Settings" ON public.system_settings;
CREATE POLICY "Admin Update Settings" ON public.system_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "All Access Profiles" ON public.profiles;
CREATE POLICY "All Access Profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Signup Requests" ON public.signup_requests;
CREATE POLICY "Public Read Signup Requests" ON public.signup_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Signup Requests" ON public.signup_requests;
CREATE POLICY "Public Insert Signup Requests" ON public.signup_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "All Access Signup Requests" ON public.signup_requests;
CREATE POLICY "All Access Signup Requests" ON public.signup_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "All Access Products" ON public.products;
CREATE POLICY "All Access Products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Ratings" ON public.ratings_reviews;
CREATE POLICY "Public Read Ratings" ON public.ratings_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "All Access Ratings" ON public.ratings_reviews;
CREATE POLICY "All Access Ratings" ON public.ratings_reviews FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Read Contact Messages" ON public.contact_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "All Access Contact Messages" ON public.contact_messages;
CREATE POLICY "All Access Contact Messages" ON public.contact_messages FOR ALL USING (true);

DROP POLICY IF EXISTS "All Access Bookmarks" ON public.bookmarks;
CREATE POLICY "All Access Bookmarks" ON public.bookmarks FOR ALL USING (true);

DROP POLICY IF EXISTS "All Access Reset Requests" ON public.password_reset_requests;
CREATE POLICY "All Access Reset Requests" ON public.password_reset_requests FOR ALL USING (true);

-- 9. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Insert Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public Update Avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "Public Delete Avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');
