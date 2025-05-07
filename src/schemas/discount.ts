import { z } from "zod";

// Define the discount form schema
export const discountFormSchema = z.object({
  couponCode: z.string().min(1, "Coupon code is required").max(50, "Code too long"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0"),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
  usageLimit: z.coerce.number().int().positive().nullable().optional(),
  perCustomerServing: z.boolean(),
  maxUsesPerCustomer: z.coerce.number().int().positive().nullable().optional(),
  applicableProducts: z.array(z.number()),
  isProductBased: z.boolean(),
});

// Export the inferred type
export type DiscountFormValues = z.infer<typeof discountFormSchema>; 