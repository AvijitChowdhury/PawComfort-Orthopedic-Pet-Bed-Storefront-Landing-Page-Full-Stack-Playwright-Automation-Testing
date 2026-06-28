import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  Anchor, Bed, Droplets, PawPrint, ShieldCheck, Star, Truck, WashingMachine, Wind,
  Check, X,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import heroBed from "@/assets/hero-bed.jpg";
import bedTop from "@/assets/bed-top.jpg";
import bedSide from "@/assets/bed-side.jpg";
import bedCat from "@/assets/bed-cat.jpg";
import type { Color, Faq, Feature, Product, Size, Testimonial } from "@/lib/landing-queries";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/70">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-base text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// =================== HERO ===================
export function Hero({ product }: { product: Product }) {
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
  const off = hasDiscount ? Math.round((1 - (product.discount_price as number) / product.price) * 100) : 0;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            Loved by 12,000+ pet parents
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {product.name.replace("™", "")}
            <span className="align-super text-2xl">™</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-7 flex flex-wrap items-end gap-4">
            <span className="font-display text-4xl font-semibold text-foreground">
              {formatPrice(hasDiscount ? (product.discount_price as number) : product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                  Save {off}%
                </span>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#order"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:shadow-lg"
            >
              Order Now
            </a>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-base font-semibold text-foreground transition hover:bg-secondary"
            >
              See features
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free shipping</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 30-day comfort guarantee</span>
            <span className="inline-flex items-center gap-2"><PawPrint className="h-4 w-4 text-primary" /> For all breeds</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/30 blur-3xl" />
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
            <img
              src={heroBed}
              width={1600}
              height={1200}
              alt="Golden retriever sleeping peacefully on a PawComfort orthopedic memory foam bed in a sunlit living room"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =================== GALLERY ===================
const galleryImages = [
  { src: heroBed, alt: "Dog asleep on PawComfort bed in living room" },
  { src: bedTop, alt: "Top view of orthopedic pet bed in beige" },
  { src: bedSide, alt: "Side view of orthopedic pet bed showing memory foam thickness" },
  { src: bedCat, alt: "Cat curled up sleeping on PawComfort bed" },
];

export function Gallery() {
  const [active, setActive] = useState(0);
  return (
    <section id="gallery" className="border-t border-border/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Gallery" title="A bed they'll actually use" />
        <motion.div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto]" {...fadeUp}>
          <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={galleryImages[active].src}
                alt={galleryImages[active].alt}
                width={1600}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =================== FEATURES ===================
function getIcon(name: string | null) {
  if (!name) return PawPrint;
  // @ts-expect-error lucide dynamic
  const Comp = Icons[name];
  return Comp ?? PawPrint;
}
const fallbackIcons = [Bed, Droplets, WashingMachine, Anchor, Wind, PawPrint];

export function Features({ features }: { features: Feature[] }) {
  return (
    <section id="features" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Built for restorative sleep"
          title="Six reasons pets choose PawComfort"
          sub="Every detail is engineered to support joints, repel mess, and last for years."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = getIcon(f.icon_name) ?? fallbackIcons[i % fallbackIcons.length];
            return (
              <motion.div
                key={f.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/30 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{f.title}</h3>
                {f.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =================== SIZES ===================
export function Sizes({ sizes }: { sizes: Size[] }) {
  return (
    <section id="sizes" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Available sizes" title="A perfect fit for every pet" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sizes.map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Size</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{s.size_name}</h3>
              {s.dimensions && <p className="mt-4 text-sm text-foreground">{s.dimensions}</p>}
              {s.recommended_weight && (
                <p className="mt-1 text-sm text-muted-foreground">{s.recommended_weight}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== COLORS ===================
export function Colors({ colors }: { colors: Color[] }) {
  return (
    <section id="colors" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Available colors" title="Four warm shades for any home" />
        <motion.div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-8" {...fadeUp}>
          {colors.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-3">
              <span
                className="h-20 w-20 rounded-full border-4 border-card shadow-md ring-1 ring-border"
                style={{ backgroundColor: c.hex_code ?? "#cccccc" }}
                aria-label={c.color_name}
              />
              <span className="text-sm font-medium text-foreground">{c.color_name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =================== COMPARE ===================
const compareRows = [
  { label: "Orthopedic memory foam", paw: true, std: false },
  { label: "Waterproof inner liner", paw: true, std: false },
  { label: "Removable washable cover", paw: true, std: false },
  { label: "Non-slip bottom", paw: true, std: false },
  { label: "Cools as your pet sleeps", paw: true, std: false },
  { label: "Holds shape after months of use", paw: true, std: false },
];

export function Compare() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Why PawComfort" title="The difference is night and day" />
        <motion.div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-sm" {...fadeUp}>
          <div className="grid grid-cols-3 border-b border-border bg-secondary/50 px-6 py-4 text-sm font-semibold">
            <span className="text-muted-foreground">Feature</span>
            <span className="text-center text-primary">PawComfort™</span>
            <span className="text-center text-muted-foreground">Standard bed</span>
          </div>
          {compareRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${i % 2 === 1 ? "bg-secondary/20" : ""}`}
            >
              <span className="text-foreground">{row.label}</span>
              <span className="flex justify-center">
                <Check className="h-5 w-5 text-primary" />
              </span>
              <span className="flex justify-center text-muted-foreground">
                {row.std ? <Check className="h-5 w-5" /> : <X className="h-5 w-5 opacity-60" />}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =================== REVIEWS ===================
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export function Reviews({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section id="reviews" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Reviews" title="Pet parents say it best" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm"
            >
              <Stars rating={t.rating} />
              {t.review_text && (
                <blockquote className="mt-4 font-display text-lg leading-relaxed text-foreground">
                  "{t.review_text}"
                </blockquote>
              )}
              <figcaption className="mt-5 flex items-center gap-3 text-sm">
                {t.photo_url ? (
                  <img src={t.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/40 text-primary">
                    <PawPrint className="h-5 w-5" />
                  </span>
                )}
                <span>
                  <span className="font-semibold text-foreground">{t.customer_name}</span>
                  {t.pet_name && <span className="text-muted-foreground"> · {t.pet_name}</span>}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== FAQ ===================
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="FAQ" title="Everything you might wonder" />
        <motion.div className="mt-10" {...fadeUp}>
          <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card px-2 shadow-sm">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-border/60 px-4">
                <AccordionTrigger className="text-left font-display text-lg">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

// =================== PRICING ===================
export function Pricing({ product }: { product: Product }) {
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
  const off = hasDiscount ? Math.round((1 - (product.discount_price as number) / product.price) * 100) : 0;
  const savings = hasDiscount ? product.price - (product.discount_price as number) : 0;
  return (
    <section id="pricing" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Limited-time offer" title="Today's price" />
        <motion.div
          {...fadeUp}
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-border bg-card p-10 text-center shadow-md"
        >
          {hasDiscount && (
            <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {off}% off
            </span>
          )}
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">PawComfort™ Orthopedic Bed</p>
          <div className="mt-5 flex flex-wrap items-end justify-center gap-3">
            <span className="font-display text-5xl font-semibold text-foreground sm:text-6xl">
              {formatPrice(hasDiscount ? (product.discount_price as number) : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-2xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          {hasDiscount && (
            <p className="mt-3 text-sm text-muted-foreground">You save {formatPrice(savings)} today.</p>
          )}
          <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
            <span className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary/70 px-4 py-2 text-foreground">
              <Truck className="h-4 w-4 text-primary" /> Free shipping
            </span>
            <span className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary/70 px-4 py-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> 30-day returns
            </span>
            <span className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary/70 px-4 py-2 text-foreground">
              <PawPrint className="h-4 w-4 text-primary" /> Loved by 12k+ pets
            </span>
          </div>
          <a
            href="#order"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
          >
            Claim this price
          </a>
        </motion.div>
      </div>
    </section>
  );
}
