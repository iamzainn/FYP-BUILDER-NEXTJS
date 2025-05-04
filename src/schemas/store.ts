import { z } from "zod";

// Schema for store name validation
export const storeFormSchema = z.object({
  name: z.string().min(3, {
    message: "Store name must be at least 3 characters.",
  }).max(50, {
    message: "Store name must be at most 50 characters.",
  }),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>; 