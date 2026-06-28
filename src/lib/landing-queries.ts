import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
};
export type Size = { id: string; size_name: string; dimensions: string | null; recommended_weight: string | null };
export type Color = { id: string; color_name: string; hex_code: string | null };
export type Feature = { id: string; title: string; description: string | null; icon_name: string | null };
export type Testimonial = { id: string; customer_name: string; pet_name: string | null; rating: number; review_text: string | null; photo_url: string | null };
export type Faq = { id: string; question: string; answer: string };
export type Settings = {
  store_name: string;
  contact_number: string | null;
  support_email: string | null;
  shipping_fee: number;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  shipping_policy: string | null;
  return_policy: string | null;
  privacy_policy: string | null;
};

export type LandingData = {
  product: Product;
  sizes: Size[];
  colors: Color[];
  features: Feature[];
  testimonials: Testimonial[];
  faqs: Faq[];
  settings: Settings | null;
};

async function fetchLanding(): Promise<LandingData> {
  const { data: product, error: pErr } = await supabase
    .from("products")
    .select("id, name, tagline, description, price, discount_price, stock")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (pErr) throw pErr;
  if (!product) throw new Error("No product configured yet.");

  const [sizes, colors, features, testimonials, faqs, settings] = await Promise.all([
    supabase.from("product_sizes").select("id, size_name, dimensions, recommended_weight").eq("product_id", product.id).order("display_order"),
    supabase.from("product_colors").select("id, color_name, hex_code").eq("product_id", product.id).order("display_order"),
    supabase.from("features").select("id, title, description, icon_name").eq("product_id", product.id).order("display_order"),
    supabase.from("testimonials").select("id, customer_name, pet_name, rating, review_text, photo_url").eq("is_approved", true).order("created_at", { ascending: false }).limit(9),
    supabase.from("faq").select("id, question, answer").order("display_order"),
    supabase.from("settings").select("store_name, contact_number, support_email, shipping_fee, facebook_url, instagram_url, twitter_url, shipping_policy, return_policy, privacy_policy").limit(1).maybeSingle(),
  ]);

  return {
    product: { ...product, price: Number(product.price), discount_price: product.discount_price !== null ? Number(product.discount_price) : null },
    sizes: sizes.data ?? [],
    colors: colors.data ?? [],
    features: features.data ?? [],
    testimonials: testimonials.data ?? [],
    faqs: faqs.data ?? [],
    settings: settings.data
      ? { ...settings.data, shipping_fee: Number(settings.data.shipping_fee) }
      : null,
  };
}

export const landingQueryOptions = queryOptions({
  queryKey: ["landing"],
  queryFn: fetchLanding,
  staleTime: 60_000,
});
