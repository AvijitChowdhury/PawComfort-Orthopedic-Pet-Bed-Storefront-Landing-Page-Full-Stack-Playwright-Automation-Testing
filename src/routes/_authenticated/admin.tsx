import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, LogOut, Package, MessageSquare, Settings as SettingsIcon, ShoppingBag } from "lucide-react";

type Tab = "orders" | "testimonials" | "products" | "settings";

interface Order {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  shipping_address: string;
  bed_size: string;
  color: string;
  quantity: number;
  payment_method: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface Testimonial {
  id: string;
  customer_name: string;
  pet_name: string | null;
  rating: number;
  review_text: string | null;
  is_approved: boolean;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  description: string | null;
}

interface Settings {
  id: string;
  store_name: string;
  shipping_fee: number | null;
  support_email: string | null;
  contact_number: string | null;
}

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | PawComfort™" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("orders");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      setEmail(userRes.user?.email ?? "");
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data && !error);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-semibold">Access denied</h1>
        <p className="text-muted-foreground">Your account does not have admin permissions.</p>
        <button onClick={signOut} className="rounded-full bg-primary px-5 py-2 text-primary-foreground">
          Sign out
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "testimonials", label: "Reviews", icon: MessageSquare },
    { id: "products", label: "Products", icon: Package },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-primary">PawComfort Admin</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-3" aria-label="Admin sections">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                data-testid={`tab-${t.id}`}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {tab === "orders" && <OrdersPanel />}
        {tab === "testimonials" && <TestimonialsPanel />}
        {tab === "products" && <ProductsPanel />}
        {tab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}

function OrdersPanel() {
  const [rows, setRows] = useState<Order[] | null>(null);
  async function load() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Order[]);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Order marked ${status}`);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order deleted");
    load();
  }

  if (rows === null) return <Loader />;
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Orders ({rows.length})</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium">{o.full_name}</div>
                  <div className="text-xs text-muted-foreground">{o.phone_number}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{o.bed_size} / {o.color}</div>
                  <div className="text-xs text-muted-foreground">Qty: {o.quantity}</div>
                </td>
                <td className="px-4 py-3">${Number(o.total_price).toFixed(2)}</td>
                <td className="px-4 py-3">{o.payment_method}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-secondary px-2 py-1 text-xs">{o.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateStatus(o.id, "Confirmed")} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Confirm</button>
                    <button onClick={() => updateStatus(o.id, "Shipped")} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">Ship</button>
                    <button onClick={() => remove(o.id)} className="rounded-full border border-destructive px-3 py-1 text-xs text-destructive">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TestimonialsPanel() {
  const [rows, setRows] = useState<Testimonial[] | null>(null);
  async function load() {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Testimonial[]);
  }
  useEffect(() => { load(); }, []);
  async function approve(id: string, approved: boolean) {
    const { error } = await supabase.from("testimonials").update({ is_approved: approved }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(approved ? "Approved" : "Unapproved");
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  if (rows === null) return <Loader />;
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Testimonials ({rows.length})</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {rows.length === 0 && <p className="text-muted-foreground">No testimonials submitted.</p>}
        {rows.map((t) => (
          <article key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <header className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{t.customer_name}{t.pet_name ? ` & ${t.pet_name}` : ""}</p>
                <p className="text-xs text-muted-foreground">Rating: {t.rating}/5</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${t.is_approved ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {t.is_approved ? "Approved" : "Pending"}
              </span>
            </header>
            {t.review_text && <p className="mt-3 text-sm text-foreground/80">{t.review_text}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => approve(t.id, !t.is_approved)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                {t.is_approved ? "Unapprove" : "Approve"}
              </button>
              <button onClick={() => remove(t.id)} className="rounded-full border border-destructive px-3 py-1 text-xs text-destructive">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductsPanel() {
  const [rows, setRows] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  async function load() {
    const { data, error } = await supabase.from("products").select("*").order("created_at");
    if (error) toast.error(error.message);
    setRows((data ?? []) as Product[]);
  }
  useEffect(() => { load(); }, []);
  async function save(p: Product) {
    const { error } = await supabase.from("products").update({
      name: p.name, price: p.price, discount_price: p.discount_price, description: p.description,
    }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  }
  if (rows === null) return <Loader />;
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Products ({rows.length})</h2>
      <div className="mt-4 space-y-4">
        {rows.map((p) => {
          const isEdit = editing?.id === p.id;
          const view = isEdit ? editing! : p;
          return (
            <article key={p.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">Name
                  <input disabled={!isEdit} value={view.name} onChange={(e) => setEditing({ ...view, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </label>
                <label className="text-sm">Price
                  <input disabled={!isEdit} type="number" step="0.01" value={view.price} onChange={(e) => setEditing({ ...view, price: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </label>
                <label className="text-sm">Discount Price
                  <input disabled={!isEdit} type="number" step="0.01" value={view.discount_price ?? ""} onChange={(e) => setEditing({ ...view, discount_price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </label>
                <label className="text-sm sm:col-span-2">Description
                  <textarea disabled={!isEdit} rows={2} value={view.description ?? ""} onChange={(e) => setEditing({ ...view, description: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </label>
              </div>
              <div className="mt-3 flex gap-2">
                {!isEdit && <button onClick={() => setEditing(p)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Edit</button>}
                {isEdit && <>
                  <button onClick={() => save(editing!)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Save</button>
                  <button onClick={() => setEditing(null)} className="rounded-full border border-border px-3 py-1 text-xs">Cancel</button>
                </>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPanel() {
  const [row, setRow] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      setRow(data as Settings);
    })();
  }, []);
  async function save() {
    if (!row) return;
    setSaving(true);
    const { error } = await supabase.from("settings").update({
      store_name: row.store_name,
      shipping_fee: row.shipping_fee ?? undefined,
      support_email: row.support_email,
      contact_number: row.contact_number,
    }).eq("id", row.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }
  if (!row) return <Loader />;
  return (
    <section className="max-w-2xl">
      <h2 className="font-display text-xl font-semibold">Store settings</h2>
      <div className="mt-4 space-y-4 rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm">Store name
          <input value={row.store_name ?? ""} onChange={(e) => setRow({ ...row, store_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block text-sm">Support email
          <input value={row.support_email ?? ""} onChange={(e) => setRow({ ...row, support_email: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block text-sm">Contact number
          <input value={row.contact_number ?? ""} onChange={(e) => setRow({ ...row, contact_number: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block text-sm">Shipping fee
          <input type="number" step="0.01" value={row.shipping_fee ?? 0} onChange={(e) => setRow({ ...row, shipping_fee: parseFloat(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </button>
      </div>
    </section>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
