'use server'

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


import prisma from "@/lib/prisma";
import { getUserDbId, generateSubdomain } from "@/lib/fn";
import { storeFormSchema } from "@/schemas/store";

export type { StoreFormValues } from "@/schemas/store";

// Get store by storeId
export async function getStore(storeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }
    
    const user = await getUserDbId(userId);
    
    if (!user.id) {
      throw new Error("Unauthorized");
    }
    
    // Verify user has access to this store
    const store = await prisma.userStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
      select: {
        id: true,
        storeId: true,
        userId: true,
        storeName: true,
        subdomain: true,
        
        createdAt: true,
        updatedAt: true,
        
    
      },
    });
    
    if (!store) {
      throw new Error("Store not found or access denied");
    }
    
    return store;
  } catch (error) {
    console.error("Failed to get store:", error);
    throw new Error("Failed to fetch store");
  }
}

// Update store name
export async function updateStoreName(
  storeId: string,
  formData: FormData
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    
    const user = await getUserDbId(userId);
    
    if (!user.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    const name = formData.get("name") as string;
    
    // Validate form data
    const validatedFields = storeFormSchema.safeParse({ name });
    
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: "Invalid store name" 
      };
    }
    
    // Verify user has access to this store
    const userStore = await prisma.userStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
    });
    
    if (!userStore) {
      return { success: false, error: "Store not found or access denied" };
    }
    
    // Generate subdomain using the utility function
    const subdomain = generateSubdomain(name);
    
    // Check if another store already has this subdomain (excluding current store)
    const existingStore = await prisma.userStore.findFirst({
      where: {
        subdomain: subdomain,
        storeId: {
          not: storeId,
        },
      },
    });
    
    if (existingStore) {
      return { success: false, error: "A store with this name or subdomain already exists" };
    }
    
    // Update the store
    const updatedStore = await prisma.userStore.update({
      where: {
        id: userStore.id,
      },
      data: {
        storeName: name,
        subdomain: subdomain,
      },
    });
    
    revalidatePath(`/admin/${storeId}/settings`);
    
    return { 
      success: true, 
      store: updatedStore
    };
  } catch (error) {
    console.error("Failed to update store:", error);
    return { success: false, error: "Failed to update store" };
  }
}

// Delete store
export async function deleteStore(storeId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    
    const user = await getUserDbId(userId);
    
    if (!user.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Verify user has access to this store
    const userStore = await prisma.userStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
    });
    
    if (!userStore) {
      return { success: false, error: "Store not found or access denied" };
    }
    
    // Delete the store (cascades to all related data)
    await prisma.userStore.delete({
      where: {
        id: userStore.id,
      },
    });
    
    // Redirect to dashboard after deletion
    return { success: true };
    
    // This will only execute if redirect fails
    
  } catch (error) {
    console.error("Failed to delete store:", error);
    return { success: false, error: "Failed to delete store" };
  }
} 