"use server";
import { getUserDbId } from "@/lib/fn";
import prisma from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createDiscount(formData: FormData) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  try {
    const storeId = formData.get("storeId") as string;
    console.log("storeId", storeId);
    
    // Parse form data
    const couponCode = formData.get("couponCode") as string;
    const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED_AMOUNT";
    const discountValue = parseFloat(formData.get("discountValue") as string);
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const isActive = formData.get("isActive") === "true";
    const usageLimit = formData.get("usageLimit") ? parseInt(formData.get("usageLimit") as string) : null;
    const perCustomerServing = formData.get("perCustomerServing") === "true";
    const maxUsesPerCustomer = formData.get("maxUsesPerCustomer") 
      ? parseInt(formData.get("maxUsesPerCustomer") as string) 
      : null;
    
    // Parse applicable products from JSON string
    let productIds: number[] = [];
    const applicableProductsStr = formData.get("applicableProducts") as string;
    if (applicableProductsStr) {
      try {
        productIds = JSON.parse(applicableProductsStr);
      } catch (e) {
        console.error("Error parsing applicableProducts:", e);
      }
    }



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

    if (!store) {
      throw new Error("Store not found");
    }
    
    
    
    


    

    await prisma.discount.create({
      data: {
        couponCode,
        discountType,
        discountValue,
        startDate,
        endDate, 
        isActive,
        usageLimit,
        perCustomerServing,
        maxUsesPerCustomer,
        store: {
          connect: {
            id: store.id
          }
        },
        // Create relationship records for each product
        products: productIds.length > 0 ? {
          create: productIds.map(productId => ({
            product: {
              connect: { id: productId }
            }
          }))
        } : undefined
      }
    });
    
    revalidatePath(`/admin/${storeId}/discounts`);
    
  } catch (error) {
    console.error("Error creating discount:", error);
    throw error;
  }
}

export async function updateDiscount(formData: FormData) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  try {
    const storeId = formData.get("storeId") as string;
    const discountId = parseInt(formData.get("discountId") as string);
    
    // Parse form data
    const couponCode = formData.get("couponCode") as string;
    const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED_AMOUNT";
    const discountValue = parseFloat(formData.get("discountValue") as string);
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const isActive = formData.get("isActive") === "true";
    const usageLimit = formData.get("usageLimit") ? parseInt(formData.get("usageLimit") as string) : null;
    const perCustomerServing = formData.get("perCustomerServing") === "true";
    const maxUsesPerCustomer = formData.get("maxUsesPerCustomer") 
      ? parseInt(formData.get("maxUsesPerCustomer") as string) 
      : null;
    
    // Parse applicable products from JSON string
    let productIds: number[] = [];
    const applicableProductsStr = formData.get("applicableProducts") as string;
    if (applicableProductsStr) {
      try {
        productIds = JSON.parse(applicableProductsStr);
      } catch (e) {
        console.error("Error parsing applicableProducts:", e);
      }
    }

    // Verify the user has access to the store
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
    
    // Verify the discount exists and belongs to this store
    const discount = await prisma.discount.findFirst({
      where: {
        id: discountId,
        storeId: store.id
      }
    });
    
    if (!discount) {
      throw new Error("Discount not found");
    }
    
    // Transaction to update discount and associated products
    await prisma.$transaction(async (tx) => {
      // First update the discount
      await tx.discount.update({
        where: { id: discountId },
        data: {
          couponCode,
          discountType,
          discountValue,
          startDate,
          endDate, 
          isActive,
          usageLimit,
          perCustomerServing,
          maxUsesPerCustomer,
        }
      });
      
      // Delete existing product associations
      await tx.discountProduct.deleteMany({
        where: { discountId }
      });
      
      // Create new product associations if needed
      if (productIds.length > 0) {
        await tx.discountProduct.createMany({
          data: productIds.map(productId => ({
            discountId,
            productId
          }))
        });
      }
    });
    
    revalidatePath(`/admin/${storeId}/discounts`);
    
  } catch (error) {
    console.error("Error updating discount:", error);
    throw error;
  }
}

export async function getDiscountCustomerUsage(discountId: number) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const usage = await prisma.discountCustomerUsage.findMany({
      where: {
        discountId
      },
      include: {
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        usageCount: 'desc'
      }
    });
    
    return usage;
  } catch (error) {
    console.error("Error fetching discount customer usage:", error);
    throw error;
  }
}

export async function getDiscount(discountId: number) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const discount = await prisma.discount.findUnique({
      where: { id: discountId },
      include: {
        products: {
          include: {
            product: {
              select: { id: true }
            }
          }
        }
      }
    });
    
    if (!discount) {
      throw new Error("Discount not found");
    }
    
    // Transform the data to match the expected format
    return {
      ...discount,
      // Extract just the product IDs for the form
      applicableProducts: discount.products.map(p => p.product.id)
    };
  } catch (error) {
    console.error("Error fetching discount:", error);
    throw error;
  }
}

export async function deleteDiscount(id: number) {
  const { userId: clerkId } = await auth();
  const user = await getUserDbId(clerkId!);
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.discount.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting discount:", error);
    throw error;
  }
}
