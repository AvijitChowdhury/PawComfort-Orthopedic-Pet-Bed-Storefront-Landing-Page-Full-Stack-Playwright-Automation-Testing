import { z } from "zod";

export const orderSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone_number: z.string().trim().min(7, "Enter a valid phone number").max(30),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  shipping_address: z.string().trim().min(10, "Please enter your full shipping address").max(500),
  bed_size: z.string().min(1, "Choose a size"),
  color: z.string().min(1, "Choose a color"),
  quantity: z.coerce.number().int().min(1).max(20),
  payment_method: z.enum(["Cash on Delivery", "Bank Transfer"]),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderSchema>;
