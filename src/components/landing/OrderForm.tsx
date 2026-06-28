import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orderSchema, type OrderInput } from "@/lib/order-schema";
import { supabase } from "@/integrations/supabase/client";
import type { Color, Product, Settings, Size } from "@/lib/landing-queries";

export function OrderForm({
  product, sizes, colors, settings,
}: { product: Product; sizes: Size[]; colors: Color[]; settings: Settings | null }) {
  const [submitted, setSubmitted] = useState(false);
  const unitPrice = product.discount_price ?? product.price;
  const shippingFee = settings?.shipping_fee ?? 0;

  const form = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      full_name: "", phone_number: "", email: "", shipping_address: "",
      bed_size: sizes[0]?.size_name ?? "",
      color: colors[0]?.color_name ?? "",
      quantity: 1,
      payment_method: "Cash on Delivery",
      notes: "",
    },
  });

  const qty = form.watch("quantity") || 1;
  const total = unitPrice * Number(qty) + shippingFee;

  async function onSubmit(values: OrderInput) {
    const payload = {
      full_name: values.full_name,
      phone_number: values.phone_number,
      email: values.email || null,
      shipping_address: values.shipping_address,
      bed_size: values.bed_size,
      color: values.color,
      quantity: Number(values.quantity),
      payment_method: values.payment_method,
      notes: values.notes || null,
      total_price: unitPrice * Number(values.quantity) + shippingFee,
    };
    const { error } = await supabase.from("orders").insert(payload);
    if (error) {
      toast.error("We couldn't place your order. Please try again.");
      console.error(error);
      return;
    }
    setSubmitted(true);
    toast.success("Order placed! We'll be in touch shortly.");
    form.reset();
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-card p-10 text-center shadow-md"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/40 text-primary">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold">Thank you!</h3>
        <p className="mt-2 text-muted-foreground">
          Your order is in. We'll confirm by phone within a few hours and ship it out today.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-sm font-semibold hover:bg-secondary"
        >
          Place another order
        </button>
      </motion.div>
    );
  }

  const errs = form.formState.errors;
  const labelCls = "block text-sm font-medium text-foreground";
  const inputCls = "mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
  const errCls = "mt-1 text-xs text-destructive";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card p-6 shadow-md sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="full_name">Full name</label>
          <input id="full_name" className={inputCls} {...form.register("full_name")} />
          {errs.full_name && <p className={errCls}>{errs.full_name.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="phone_number">Phone</label>
          <input id="phone_number" className={inputCls} {...form.register("phone_number")} />
          {errs.phone_number && <p className={errCls}>{errs.phone_number.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="email">Email <span className="text-muted-foreground">(optional)</span></label>
          <input id="email" type="email" className={inputCls} {...form.register("email")} />
          {errs.email && <p className={errCls}>{errs.email.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="shipping_address">Shipping address</label>
          <textarea id="shipping_address" rows={3} className={inputCls} {...form.register("shipping_address")} />
          {errs.shipping_address && <p className={errCls}>{errs.shipping_address.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="bed_size">Bed size</label>
          <select id="bed_size" className={inputCls} {...form.register("bed_size")}>
            {sizes.map((s) => (
              <option key={s.id} value={s.size_name}>
                {s.size_name}{s.recommended_weight ? ` — ${s.recommended_weight}` : ""}
              </option>
            ))}
          </select>
          {errs.bed_size && <p className={errCls}>{errs.bed_size.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="color">Color</label>
          <select id="color" className={inputCls} {...form.register("color")}>
            {colors.map((c) => (
              <option key={c.id} value={c.color_name}>{c.color_name}</option>
            ))}
          </select>
          {errs.color && <p className={errCls}>{errs.color.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={20}
            className={inputCls}
            {...form.register("quantity", { valueAsNumber: true })}
          />
          {errs.quantity && <p className={errCls}>{errs.quantity.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="payment_method">Payment method</label>
          <select id="payment_method" className={inputCls} {...form.register("payment_method")}>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="notes">Order notes <span className="text-muted-foreground">(optional)</span></label>
          <textarea id="notes" rows={2} className={inputCls} {...form.register("notes")} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-secondary/60 px-5 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Order total</p>
          <p className="font-display text-2xl font-semibold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {shippingFee === 0 ? "Free shipping included" : `Shipping: $${shippingFee.toFixed(2)}`}
        </p>
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-70"
      >
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Place order
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By placing your order you agree to be contacted to confirm shipping.
      </p>
    </form>
  );
}
