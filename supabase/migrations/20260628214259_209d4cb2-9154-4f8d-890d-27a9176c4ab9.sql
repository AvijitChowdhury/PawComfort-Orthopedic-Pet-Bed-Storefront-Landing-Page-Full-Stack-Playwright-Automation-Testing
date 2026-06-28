
CREATE POLICY "Admins write product-images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins write testimonials" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'testimonials' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'testimonials' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins write branding" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'branding' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'branding' AND public.has_role(auth.uid(), 'admin'));
