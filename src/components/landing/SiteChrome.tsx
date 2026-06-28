import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import type { Settings } from "@/lib/landing-queries";

export function SiteHeader({ storeName }: { storeName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">{storeName}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#sizes" className="hover:text-foreground">Sizes</a>
          <a href="#reviews" className="hover:text-foreground">Reviews</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a
          href="#order"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          Order Now
        </a>
      </div>
    </header>
  );
}

export function SiteFooter({ settings }: { settings: Settings | null }) {
  if (!settings) return null;
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">{settings.store_name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Premium orthopedic comfort for every pet, every breed, every night.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {settings.contact_number && <li>{settings.contact_number}</li>}
            {settings.support_email && (
              <li>
                <a className="hover:underline" href={`mailto:${settings.support_email}`}>{settings.support_email}</a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Policies</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {settings.shipping_policy && <li><span className="font-medium">Shipping:</span> {settings.shipping_policy}</li>}
            {settings.return_policy && <li><span className="font-medium">Returns:</span> {settings.return_policy}</li>}
            {settings.privacy_policy && <li><span className="font-medium">Privacy:</span> {settings.privacy_policy}</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Follow</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {settings.facebook_url && <li><a href={settings.facebook_url} className="hover:underline">Facebook</a></li>}
            {settings.instagram_url && <li><a href={settings.instagram_url} className="hover:underline">Instagram</a></li>}
            {settings.twitter_url && <li><a href={settings.twitter_url} className="hover:underline">Twitter</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.store_name}. All rights reserved.
      </div>
    </footer>
  );
}
