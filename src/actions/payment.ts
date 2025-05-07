"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserDbId } from "@/lib/fn";

// Schema for validating payment gateway form data
const paymentGatewaySchema = z.object({
  provider: z.string().default("SQUARE"),
  accessToken: z.string().min(1, "Access token is required"),
  applicationId: z.string().min(1, "Application ID is required"),
  locationId: z.string().min(1, "Location ID is required"),
  environment: z.enum(["sandbox", "production"]).default("sandbox"),
  isActive: z.boolean().default(true),
});

/**
 * Get payment gateway for a store
 */
export async function getPaymentGateway(storeId: string) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  try {
    // Verify user has access to this store
    const store = await prisma.userStore.findFirst({
      where: {
        storeId,
        user: {
          clerkId: clerkId!
        }
      },
      select: { id: true }
    });
    
    if (!store) {
      throw new Error("Store not found");
    }
    
    // Get payment gateway for this store
    const paymentGateway = await prisma.paymentGateway.findFirst({
      where: {
        storeId: store.id,
      }
    });
    
    return paymentGateway;
  } catch (error) {
    console.error("Error getting payment gateway:", error);
    throw error;
  }
}

/**
 * Save Square payment gateway configuration
 */
export async function savePaymentGateway(formData: FormData) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  try {
    const storeId = formData.get("storeId") as string;
    
    // Get DB storeId
    const store = await prisma.userStore.findFirst({
      where: {
        storeId,
        user: {
          clerkId: clerkId!
        }
      },
      select: { id: true }
    });
    
    if (!store) {
      throw new Error("Store not found");
    }
    
    // Parse form data
    const provider = formData.get("provider") as string || "SQUARE";
    const accessToken = formData.get("accessToken") as string;
    const applicationId = formData.get("applicationId") as string;
    const locationId = formData.get("locationId") as string;
    const environment = formData.get("environment") as "sandbox" | "production" || "sandbox";
    const isActive = formData.get("isActive") === "true";
    
    // Validate the data
    paymentGatewaySchema.parse({
      provider,
      accessToken,
      applicationId,
      locationId,
      environment,
      isActive
    });
    
    // Check if a payment gateway already exists for this store
    const existingGateway = await prisma.paymentGateway.findFirst({
      where: {
        storeId: store.id,
        provider
      }
    });
    
    if (existingGateway) {
      // Update existing gateway
      await prisma.paymentGateway.update({
        where: {
          id: existingGateway.id
        },
        data: {
          accessToken,
          applicationId,
          locationId,
          environment,
          isActive
        }
      });
    } else {
      // Create new gateway
      await prisma.paymentGateway.create({
        data: {
          provider,
          accessToken,
          applicationId,
          locationId,
          environment,
          isActive,
          store: {
            connect: {
              id: store.id
            }
          }
        }
      });
    }
    
    revalidatePath(`/admin/${storeId}/payments`);
    
    return { success: true };
  } catch (error) {
    console.error("Error saving payment gateway:", error);
    throw error;
  }
}

/**
 * Toggle payment gateway active status
 */
export async function togglePaymentGatewayStatus(id: number, isActive: boolean) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  try {
    const paymentGateway = await prisma.paymentGateway.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            storeId: true,
            user: {
              select: {
                clerkId: true
              }
            }
          }
        }
      }
    });
    
    if (!paymentGateway) {
      throw new Error("Payment gateway not found");
    }
    
    // Check if user has access to this store
    if (paymentGateway.store.user.clerkId !== clerkId) {
      throw new Error("Unauthorized");
    }
    
    // Update active status
    await prisma.paymentGateway.update({
      where: { id },
      data: { isActive }
    });
    
    revalidatePath(`/admin/${paymentGateway.store.storeId}/payments`);
    
    return { success: true };
  } catch (error) {
    console.error("Error toggling payment gateway status:", error);
    throw error;
  }
}

/**
 * Delete payment gateway
 */
export async function deletePaymentGateway(id: number) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  try {
    const paymentGateway = await prisma.paymentGateway.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            storeId: true,
            user: {
              select: {
                clerkId: true
              }
            }
          }
        }
      }
    });
    
    if (!paymentGateway) {
      throw new Error("Payment gateway not found");
    }
    
    // Check if user has access to this store
    if (paymentGateway.store.user.clerkId !== clerkId) {
      throw new Error("Unauthorized");
    }
    
    // Delete payment gateway
    await prisma.paymentGateway.delete({
      where: { id }
    });
    
    revalidatePath(`/admin/${paymentGateway.store.storeId}/payments`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting payment gateway:", error);
    throw error;
  }
} 