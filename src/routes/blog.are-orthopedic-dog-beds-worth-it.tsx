import { createFileRoute, Link } from "@tanstack/react-router";

const URL = "https://pawcomfortavijit.lovable.app/blog/are-orthopedic-dog-beds-worth-it";
const TITLE = "Are Orthopedic Dog Beds Worth It? A Vet-Informed Guide";
const DESC = "Are orthopedic dog beds worth the price? A practical guide to memory foam, joint support, and which dogs benefit most — with buyer criteria and red flags.";
const PUBLISHED = "2026-07-09";

export const Route = createFileRoute("/blog/are-orthopedic-dog-beds-worth-it")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "article:published_time", content: PUBLISHED },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          author: { "@type": "Organization", name: "PawComfort" },
          publisher: {
            "@type": "Organization",
            name: "PawComfort",
            logo: { "@type": "ImageObject", url: "https://pawcomfortavijit.lovable.app/favicon.ico" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are orthopedic dog beds actually worth the price?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For senior, large-breed, arthritic, or post-surgical dogs, yes. A quality memory-foam orthopedic bed reduces pressure on joints, improves sleep quality, and slows the progression of stiffness. Healthy young dogs benefit less, but still sleep better on supportive foam than on a flat cushion.",
              },
            },
            {
              "@type": "Question",
              name: "At what age should I switch my dog to an orthopedic bed?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Small breeds: around age 8. Medium breeds: around age 6. Large and giant breeds: from age 4–5, or earlier if hip dysplasia runs in the line. Any dog recovering from surgery or diagnosed with arthritis should switch immediately.",
              },
            },
            {
              "@type": "Question",
              name: "What thickness of memory foam is enough?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "At minimum 4 inches of solid (not shredded) memory foam for medium dogs, and 5–7 inches for large and giant breeds. Below 3 inches the dog bottoms out on the floor and loses the orthopedic benefit.",
              },
            },
            {
              "@type": "Question",
              name: "How long does a good orthopedic dog bed last?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A high-density (≥ 4 lb/ft³) solid memory foam core holds its shape for 5–7 years of daily use. Shredded foam or low-density fills compress within 6–12 months.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>Blog</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Are Orthopedic Dog Beds Worth It?</span>
        </nav>

        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Buyer's Guide</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            Are Orthopedic Dog Beds Worth It? A Vet-Informed Guide
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The honest answer, with the science, the buying criteria, and the red flags that separate real
            orthopedic beds from marketing fluff.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Published {new Date(PUBLISHED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · 6 min read
          </p>
        </header>

        <div className="prose prose-lg mt-10 max-w-none text-foreground/90">
          <h2 className="font-display text-2xl font-semibold text-primary">The short answer</h2>
          <p>
            Yes — for the right dog. If your dog is a senior, a large or giant breed, arthritic, recovering
            from surgery, or already showing morning stiffness, a genuine orthopedic memory-foam bed is one of
            the highest-return purchases you can make for their day-to-day comfort. For a healthy 2-year-old
            Beagle, a good bolstered cushion is usually enough.
          </p>

          <h2 className="font-display text-2xl font-semibold text-primary">What "orthopedic" actually means</h2>
          <p>
            The word isn't regulated. A bed only earns the label if the foam is dense enough to distribute
            weight evenly instead of bunching around joints. Look for two numbers on the spec sheet:
          </p>
          <ul>
            <li><strong>Density</strong> — at least 4 lb/ft³ for the main support layer. Lower densities crush.</li>
            <li><strong>Thickness</strong> — 4″ minimum for medium dogs, 5–7″ for large and giant breeds.</li>
          </ul>
          <p>
            "Shredded memory foam" is not orthopedic. It compresses within months and offers no consistent
            support. If a listing hides the density or lists only total bed height (foam + cover + base), that's
            a red flag.
          </p>

          <h2 className="font-display text-2xl font-semibold text-primary">The benefits, ranked by evidence</h2>
          <ol>
            <li>
              <strong>Joint pressure relief.</strong> Memory foam contours to the body so hips, elbows, and
              shoulders don't take concentrated load against a hard floor. This is the single biggest reason
              vets recommend orthopedic beds for arthritic dogs.
            </li>
            <li>
              <strong>Better sleep, faster recovery.</strong> Dogs on supportive foam cycle into deep sleep
              more quickly. Owners of post-op dogs consistently report shorter recovery times and less
              restlessness at night.
            </li>
            <li>
              <strong>Warmth without overheating.</strong> Quality foam insulates from cold floors — a real
              factor for older dogs whose circulation isn't what it used to be.
            </li>
            <li>
              <strong>Slower progression of stiffness.</strong> Not a cure, but reduced overnight pressure on
              joints translates to easier mornings, which keeps dogs mobile for longer.
            </li>
          </ol>

          <h2 className="font-display text-2xl font-semibold text-primary">When it's <em>not</em> worth it</h2>
          <p>
            A healthy young dog with no joint history won't get dramatic benefit — they'd be equally happy on a
            plush cushion. If your dog is a chewer and destroys covers weekly, invest in the cover before the
            foam. And if the price gap between "orthopedic" and "premium cushion" is small, the orthopedic
            model is almost always worth the difference — but a $30 bed labeled "orthopedic" is virtually never
            the real thing.
          </p>

          <h2 className="font-display text-2xl font-semibold text-primary">What to look for when buying</h2>
          <ul>
            <li>Solid (not shredded) high-density memory foam core</li>
            <li>Waterproof liner between cover and foam</li>
            <li>Removable, machine-washable cover</li>
            <li>Non-slip base — critical for senior dogs</li>
            <li>Size that lets your dog stretch out fully, not curl to fit</li>
            <li>A real return window, so you can verify your dog actually uses it</li>
          </ul>

          <h2 className="font-display text-2xl font-semibold text-primary">FAQ</h2>
          <h3>Are orthopedic dog beds actually worth the price?</h3>
          <p>
            For senior, large-breed, arthritic, or post-surgical dogs, yes. Healthy young dogs benefit less but
            still sleep better on supportive foam than on a flat cushion.
          </p>
          <h3>At what age should I switch my dog to an orthopedic bed?</h3>
          <p>
            Small breeds around 8, medium around 6, large and giant breeds from 4–5. Any dog recovering from
            surgery or diagnosed with arthritis should switch immediately.
          </p>
          <h3>What thickness of memory foam is enough?</h3>
          <p>4″ minimum for medium dogs, 5–7″ for large and giant breeds. Below 3″ your dog bottoms out.</p>
          <h3>How long does a good orthopedic dog bed last?</h3>
          <p>A high-density solid memory foam core holds its shape for 5–7 years of daily use.</p>
        </div>

        <aside className="mt-14 rounded-3xl border border-border bg-card p-8 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Ready when you are</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-primary">
            The PawComfort™ Orthopedic Bed checks every box above
          </h2>
          <p className="mt-3 text-muted-foreground">
            Solid high-density memory foam, waterproof liner, washable cover, non-slip base, and a 30-day
            comfort guarantee.
          </p>
          <Link
            to="/"
            hash="order"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
          >
            See the bed & order →
          </Link>
        </aside>
      </article>
    </main>
  );
}
