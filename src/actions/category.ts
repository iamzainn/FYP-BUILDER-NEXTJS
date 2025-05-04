"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { categoryFormSchema } from "@/schemas/category";
import { getUserDbId } from "@/lib/fn";

type CreateCategoryResponse = {
  success: boolean;
  error?: string;
  category?: { id: number; name: string };
};

type DeleteCategoryResponse = {
  success: boolean;
  error?: string;
};

export async function getCategories(storeId: string) {
  try {
    const { userId } = await auth();
    const user = await getUserDbId(userId!);
    
    if (!user.id) {
      throw new Error("Unauthorized");
    }
    
    
    
    // Verify user has access to this store
    const userStore = await prisma.userStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
    });
    
    if (!userStore) {
      throw new Error("Store not found or access denied");
    }
    
    const categories = await prisma.category.findMany({
      where: {
        storeId: userStore.id,
      },
      orderBy: {
        name: "asc",
      },
    });
    
    return categories;
  } catch (error) {
    console.error("Failed to get categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoryById(storeId: string, categoryId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }
    
    const user = await getUserDbId(userId);
    
    if (!user.id) {
      throw new Error("Unauthorized");
    }
    
   
    const categoryIdNumber = parseInt(categoryId);
    
    // Verify user has access to this store
    const userStore = await prisma.userStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
    });
    
    if (!userStore) {
      throw new Error("Store not found or access denied");
    }
    
    const category = await prisma.category.findFirst({
      where: {
        id: categoryIdNumber,
        storeId: userStore.id,
      },
    });
    
    if (!category) {
      throw new Error("Category not found");
    }
    
    return category;
  } catch (error) {
    console.error("Failed to get category:", error);
    throw new Error("Failed to fetch category");
  }
}

export async function createCategory(formData: FormData): Promise<CreateCategoryResponse> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    
    const user = await getUserDbId(userId);
    
    if (!user.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    const storeId = formData.get("storeId") as string;
    const name = formData.get("name") as string;
    
    
    
    // Validate form data
    const validatedFields = categoryFormSchema.safeParse({ name });
    
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: "Invalid category data" 
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
    
    // Check if category with same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        storeId: userStore.id,
        name: {
          equals: name,
        },
      },
    });
    
    if (existingCategory) {
      return { success: false, error: "A category with this name already exists" };
    }
    
    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        storeId: userStore.id,
      },
    });
    
    revalidatePath(`/admin/${storeId}/categories`);
    redirect(`/admin/${storeId}/categories`);
    
    return { 
      success: true, 
      category: {
        id: category.id,
        name: category.name
      }
    };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  storeId: string, 
  categoryId: string, 
  formData: FormData
): Promise<CreateCategoryResponse> {
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
    
    
    const categoryIdNumber = parseInt(categoryId);
    
    // Validate form data
    const validatedFields = categoryFormSchema.safeParse({ name });
    
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: "Invalid category data" 
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
    
    // Check if category with same name already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: {
        storeId: userStore.id,
        name: {
          equals: name,
        },
        id: {
          not: categoryIdNumber,
        },
      },
    });
    
    if (existingCategory) {
      return { success: false, error: "A category with this name already exists" };
    }
    
    // Update the category
    const category = await prisma.category.update({
      where: {
        id: categoryIdNumber,
      },
      data: {
        name,
      },
    });
    
    revalidatePath(`/admin/${storeId}/categories`);
    redirect(`/admin/${storeId}/categories`);
    
    return { 
      success: true, 
      category: {
        id: category.id,
        name: category.name
      }
    };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(storeId: string, categoryId: string): Promise<DeleteCategoryResponse> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    
    const user = await getUserDbId(userId);
    
    if (!user.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    
    const categoryIdNumber = parseInt(categoryId);
    
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
    
    // Check if category exists
    const category = await prisma.category.findFirst({
      where: {
        id: categoryIdNumber,
        storeId: userStore.id,
      },
    });
    
    if (!category) {
      return { success: false, error: "Category not found" };
    }
    
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: {
        categoryId: categoryIdNumber,
      },
    });
    
    if (productsCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete category with ${productsCount} products. Please reassign or delete the products first.` 
      };
    }
    
    // Delete the category
    await prisma.category.delete({
      where: {
        id: categoryIdNumber,
      },
    });
    
    revalidatePath(`/admin/${storeId}/categories`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function getCategoriesCount(storeId: string): Promise<number> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return 0;
    }

    const user = await getUserDbId(userId);
    
    if (!user.id) {
      return 0;
    }
    
    
    console.log(storeId + " from getCategoriesCount");
    
    
    const userStore = await prisma.userStore.findFirst({
      where: {
        storeId: storeId,
        userId: user.id,
      },
    });
    
    if (!userStore) {
      return 0;
    }

  
    
      const count = await prisma.category.count({
        where: {
          storeId: userStore.id,
        },
      });
      console.log(count + " from getCategoriesCount");
    
    return count;
  } catch (error) {
    console.error("Failed to get categories count:", error);
    return 0;
  }
} 