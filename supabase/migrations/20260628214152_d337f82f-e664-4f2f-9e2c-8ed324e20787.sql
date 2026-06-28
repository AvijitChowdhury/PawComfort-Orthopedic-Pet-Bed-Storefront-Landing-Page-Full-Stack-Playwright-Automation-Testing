
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2),
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PRODUCT IMAGES ============
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  is_lifestyle BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage product_images" ON public.product_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PRODUCT SIZES ============
CREATE TABLE public.product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_name TEXT NOT NULL,
  dimensions TEXT,
  recommended_weight TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_sizes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_sizes TO authenticated;
GRANT ALL ON public.product_sizes TO service_role;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_sizes" ON public.product_sizes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage product_sizes" ON public.product_sizes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PRODUCT COLORS ============
CREATE TABLE public.product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  hex_code TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_colors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_colors TO authenticated;
GRANT ALL ON public.product_colors TO service_role;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_colors" ON public.product_colors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage product_colors" ON public.product_colors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ FEATURES ============
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.features TO authenticated;
GRANT ALL ON public.features TO service_role;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read features" ON public.features FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage features" ON public.features FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  pet_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  photo_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY "Public submit testimonials" ON public.testimonials
  FOR INSERT TO anon, authenticated WITH CHECK (is_approved = false);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ FAQ ============
CREATE TABLE public.faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq TO authenticated;
GRANT ALL ON public.faq TO service_role;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faq" ON public.faq FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage faq" ON public.faq FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  shipping_address TEXT NOT NULL,
  bed_size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  payment_method TEXT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Confirmed','Processing','Shipped','Delivered','Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view orders" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SETTINGS ============
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL,
  contact_number TEXT,
  support_email TEXT,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  shipping_policy TEXT,
  return_policy TEXT,
  privacy_policy TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SEED ============
DO $$
DECLARE pid UUID;
BEGIN
  INSERT INTO public.products (name, tagline, description, price, discount_price, stock)
  VALUES (
    'PawComfort™ Orthopedic Pet Bed',
    'Premium memory foam comfort for dogs & cats',
    'Engineered with high-density orthopedic memory foam, a waterproof inner lining, and a removable, machine-washable cover. The non-slip bottom keeps the bed exactly where your pet wants it — pure restorative sleep for joints of every age.',
    129.00, 79.00, 250
  ) RETURNING id INTO pid;

  INSERT INTO public.product_sizes (product_id, size_name, dimensions, recommended_weight, display_order) VALUES
    (pid, 'Small', '24" x 18" x 5"', 'Up to 20 lbs', 1),
    (pid, 'Medium', '32" x 24" x 6"', '20–45 lbs', 2),
    (pid, 'Large', '40" x 30" x 7"', '45–80 lbs', 3),
    (pid, 'Extra Large', '48" x 36" x 8"', '80–120 lbs', 4);

  INSERT INTO public.product_colors (product_id, color_name, hex_code, display_order) VALUES
    (pid, 'Gray', '#7a7a7a', 1),
    (pid, 'Brown', '#6b4a2b', 2),
    (pid, 'Navy Blue', '#1f3a5f', 3),
    (pid, 'Beige', '#d8c3a5', 4);

  INSERT INTO public.features (product_id, title, description, icon_name, display_order) VALUES
    (pid, 'Orthopedic Memory Foam', 'High-density foam contours to relieve joint and hip pressure.', 'Bed', 1),
    (pid, 'Waterproof Inner Lining', 'Protects the foam from accidents, spills, and pet hair.', 'Droplets', 2),
    (pid, 'Removable Washable Cover', 'Zip-off cover is machine washable on a gentle cycle.', 'WashingMachine', 3),
    (pid, 'Anti-Slip Bottom', 'Grippy base keeps the bed planted on every floor.', 'Anchor', 4),
    (pid, 'Breathable Fabric', 'Soft, plush top layer that stays cool through the night.', 'Wind', 5),
    (pid, 'For All Breeds', 'Four sizes to fit puppies, seniors, and gentle giants.', 'PawPrint', 6);

  INSERT INTO public.faq (question, answer, display_order) VALUES
    ('Is the cover machine washable?', 'Yes — the outer cover unzips fully and is safe for a gentle machine wash. Air dry for best longevity.', 1),
    ('Is the foam waterproof?', 'The inner foam is wrapped in a 100% waterproof liner, so accidents stay on the surface and never reach the foam.', 2),
    ('Which size should I choose?', 'Measure your pet from nose to tail and add 6". Most medium dogs (20–45 lbs) are happiest in Medium; large breeds should size up.', 3),
    ('How long does shipping take?', 'Orders ship within 24 hours and arrive in 3–5 business days. Shipping is free on every order.', 4),
    ('What if my pet doesn''t love it?', 'You have 30 days to try it. If it''s not the perfect bed, we''ll refund you in full — no questions asked.', 5);

  INSERT INTO public.testimonials (customer_name, pet_name, rating, review_text, is_approved) VALUES
    ('Sarah M.', 'Biscuit', 5, 'My 11-year-old lab hops onto this bed the second I fluff it. The foam clearly helps his hips — he''s sleeping through the night again.', true),
    ('David R.', 'Luna', 5, 'Cleanest pet bed I''ve ever owned. The cover zips off, washes beautifully, and the waterproof liner is a lifesaver with a puppy.', true),
    ('Priya K.', 'Mochi & Pesto', 5, 'Bought two for our cats. They abandoned every other bed in the house within a day. Worth every penny.', true);

  INSERT INTO public.settings (store_name, contact_number, support_email, shipping_fee, facebook_url, instagram_url, twitter_url, shipping_policy, return_policy, privacy_policy) VALUES
    ('PawComfort', '+1 (800) 555-0142', 'support@pawcomfort.com', 0, 'https://facebook.com/pawcomfort', 'https://instagram.com/pawcomfort', 'https://twitter.com/pawcomfort',
      'Free shipping on every order. Ships within 24 hours; arrives in 3–5 business days.',
      '30-day risk-free trial. If your pet doesn''t love it, we refund you in full.',
      'We only collect the information needed to fulfill your order. We never sell your data.');
END $$;
