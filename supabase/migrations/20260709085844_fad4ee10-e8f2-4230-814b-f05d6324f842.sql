
-- 1. Lock down has_role SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 2. Server-side enforcement of order total_price
CREATE OR REPLACE FUNCTION public.enforce_order_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit NUMERIC(10,2);
  v_ship NUMERIC(10,2);
  v_size_ok BOOLEAN;
  v_color_ok BOOLEAN;
  v_product_id UUID;
BEGIN
  -- Pick the (single) active product deterministically
  SELECT id,
         COALESCE(discount_price, price)
    INTO v_product_id, v_unit
  FROM public.products
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_product_id IS NULL THEN
    RAISE EXCEPTION 'No product configured';
  END IF;

  -- Validate selected size + color belong to that product
  SELECT EXISTS (SELECT 1 FROM public.product_sizes
                  WHERE product_id = v_product_id AND size_name = NEW.bed_size)
    INTO v_size_ok;
  SELECT EXISTS (SELECT 1 FROM public.product_colors
                  WHERE product_id = v_product_id AND color_name = NEW.color)
    INTO v_color_ok;

  IF NOT v_size_ok THEN
    RAISE EXCEPTION 'Invalid bed size: %', NEW.bed_size;
  END IF;
  IF NOT v_color_ok THEN
    RAISE EXCEPTION 'Invalid color: %', NEW.color;
  END IF;

  IF NEW.quantity IS NULL OR NEW.quantity < 1 OR NEW.quantity > 20 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  SELECT COALESCE(shipping_fee, 0) INTO v_ship
  FROM public.settings
  ORDER BY updated_at DESC
  LIMIT 1;
  v_ship := COALESCE(v_ship, 0);

  -- Force server-computed total; ignore whatever the client sent
  NEW.total_price := (v_unit * NEW.quantity) + v_ship;

  -- Force safe defaults on insert
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'Pending';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_enforce_integrity ON public.orders;
CREATE TRIGGER trg_orders_enforce_integrity
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_integrity();

-- 3. Tighten INSERT policy on orders (replace WITH CHECK (true))
DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
CREATE POLICY "Anyone can place orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(full_name)) BETWEEN 2 AND 100
  AND char_length(btrim(phone_number)) BETWEEN 7 AND 30
  AND char_length(btrim(shipping_address)) BETWEEN 10 AND 500
  AND char_length(btrim(bed_size)) > 0
  AND char_length(btrim(color)) > 0
  AND payment_method IN ('Cash on Delivery', 'Bank Transfer')
  AND quantity BETWEEN 1 AND 20
  AND (email IS NULL OR char_length(email) <= 255)
  AND (notes IS NULL OR char_length(notes) <= 500)
);

-- 4. Testimonials: validation trigger + tightened insert policy
CREATE OR REPLACE FUNCTION public.enforce_testimonial_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Force unapproved on public insert
  NEW.is_approved := false;

  IF NEW.rating IS NULL OR NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  IF char_length(btrim(NEW.customer_name)) < 2
     OR char_length(NEW.customer_name) > 100 THEN
    RAISE EXCEPTION 'Invalid customer name';
  END IF;

  IF NEW.pet_name IS NOT NULL AND char_length(NEW.pet_name) > 100 THEN
    RAISE EXCEPTION 'Pet name too long';
  END IF;

  IF NEW.review_text IS NOT NULL AND char_length(NEW.review_text) > 2000 THEN
    RAISE EXCEPTION 'Review text too long';
  END IF;

  IF NEW.photo_url IS NOT NULL AND char_length(NEW.photo_url) > 500 THEN
    RAISE EXCEPTION 'Photo URL too long';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_testimonials_enforce_integrity ON public.testimonials;
CREATE TRIGGER trg_testimonials_enforce_integrity
BEFORE INSERT ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.enforce_testimonial_integrity();

DROP POLICY IF EXISTS "Public submit testimonials" ON public.testimonials;
CREATE POLICY "Public submit testimonials"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (
  is_approved = false
  AND char_length(btrim(customer_name)) BETWEEN 2 AND 100
  AND rating BETWEEN 1 AND 5
  AND (review_text IS NULL OR char_length(review_text) <= 2000)
  AND (pet_name IS NULL OR char_length(pet_name) <= 100)
  AND (photo_url IS NULL OR char_length(photo_url) <= 500)
);
