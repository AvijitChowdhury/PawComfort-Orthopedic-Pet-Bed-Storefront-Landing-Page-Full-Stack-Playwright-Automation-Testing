import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { landingQueryOptions } from "@/lib/landing-queries";
import { SiteHeader, SiteFooter } from "@/components/landing/SiteChrome";
import {
  Hero, Gallery, Features, Sizes, Colors, Compare, Reviews, FaqSection, Pricing,
} from "@/components/landing/sections";
import { OrderForm } from "@/components/landing/OrderForm";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(landingQueryOptions),
  component: LandingPage,
  pendingComponent: PageSkeleton,
  head: () => ({
    meta: [
      { title: "PawComfort™ Orthopedic Pet Bed — Memory Foam Comfort for Every Pet" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "PawComfort™ Orthopedic Pet Bed",
          description:
            "Premium orthopedic memory foam pet bed with washable cover, waterproof liner and non-slip base.",
          brand: { "@type": "Brand", name: "PawComfort" },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "1287",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: "59",
            availability: "https://schema.org/InStock",
          },
        }),
      },
    ],
  }),
});

function PageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="h-16 border-b border-border/60 bg-card" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-full bg-muted" />
            <div className="h-12 w-full rounded-full bg-muted" />
            <div className="h-6 w-2/3 rounded-full bg-muted" />
            <div className="h-12 w-40 rounded-full bg-muted" />
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  const storeName = data.settings?.store_name ?? "PawComfort";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader storeName={storeName} />
      <main>
        <Hero product={data.product} />
        <Gallery />
        <Features features={data.features} />
        <Sizes sizes={data.sizes} />
        <Colors colors={data.colors} />
        <Compare />
        <Reviews testimonials={data.testimonials} />
        <FaqSection faqs={data.faqs} />
        <Pricing product={data.product} />

        <section id="order" className="bg-secondary/40 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/70">
                Order yours
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Give your pet the rest they deserve
              </h2>
              <p className="mt-4 text-muted-foreground">
                Free shipping, 30-day comfort guarantee. We'll confirm by phone before dispatch.
              </p>
            </div>
            <div className="mt-10">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-card" />}>
                <OrderForm
                  product={data.product}
                  sizes={data.sizes}
                  colors={data.colors}
                  settings={data.settings}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={data.settings} />
    </div>
  );
}
