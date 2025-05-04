import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Category name cannot exceed 255 characters"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>; 