import { z } from "zod";

// Define schema with required fields
export const paymentGatewaySchema = z.object({
  provider: z.string(),
  accessToken: z.string().min(1, "Access token is required"),
  applicationId: z.string().min(1, "Application ID is required"), 
  locationId: z.string().min(1, "Location ID is required"),
  environment: z.enum(["sandbox", "production"]),
  isActive: z.boolean(),
});

// Export the form values type that matches the schema exactly
export type PaymentGatewayFormValues = {
  provider: string;
  accessToken: string;
  applicationId: string;
  locationId: string;
  environment: "sandbox" | "production";
  isActive: boolean;
}; 