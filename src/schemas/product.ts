import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Name too long"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stockLevel: z.coerce.number().int().nonnegative("Stock level can't be negative"),
  isActive: z.boolean(),
  categoryId: z.number().optional(),
  images: z.array(z.object({ 
    url: z.string().url("Invalid image URL")
  })).min(1, "At least one image is required")
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
