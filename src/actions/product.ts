'use server'

import { productFormSchema } from "@/schemas/product";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { deleteUploadthingImage } from "./uploadthing";

export async function createProduct(formData: FormData) {
  const { userId: clerkId } = await auth();
  const storeId = formData.get("storeId") as string;
  
  if (!clerkId) {
    throw new Error("Unauthorized");
  }
  
  // Get the store from storeId string
  const store = await prisma.userStore.findFirst({
    where: { 
      storeId,
      user: {
        clerkId
      }
    },
    select: { id: true }
  });
  
  if (!store) {
    throw new Error("Store not found");
  }
  
  // Extract values from formData
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockLevel = parseInt(formData.get("stockLevel") as string, 10);
  const isActive = formData.get("isActive") === "true";
  const categoryId = formData.get("categoryId") ? 
    parseInt(formData.get("categoryId") as string, 10) : 
    undefined;
  const imagesJson = formData.get("images") as string;
  const images = JSON.parse(imagesJson);
  
  try {
    // Validate with Zod
    const validatedData = productFormSchema.parse({
      name,
      description,
      price,
      stockLevel,
      isActive,
      categoryId,
      images
    });
    
    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stockLevel: validatedData.stockLevel,
        isActive: validatedData.isActive,
        storeId: store.id,
        categoryId: validatedData.categoryId,
        // Create images in a separate step
      }
    });
    
    // Create product images
    if (validatedData.images && validatedData.images.length > 0) {
      await prisma.productImage.createMany({
        data: validatedData.images.map(image => ({
          productId: product.id,
          url: image.url
        }))
      });
    }
    
    revalidatePath(`/admin/${storeId}/products`);
    
    // Return success instead of redirecting
    return {
      success: true,
      productId: product.id
    };
    
    // Remove the redirect call, we'll handle this on the client
    // redirect(`/admin/${storeId}/products`);
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

export async function deleteProductImage(storeId: string, imageId: number, imageUrl: string) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error("Unauthorized");
  }
  
  try {
    // Check if the image belongs to the user's store
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        product: {
          store: {
            storeId,
            user: {
              clerkId
            }
          }
        }
      }
    });
    
    if (!image) {
      throw new Error("Image not found or unauthorized");
    }
    
    // Extract file key from URL
    const fileKey = imageUrl.split('/').pop();
    
    if (!fileKey) {
      throw new Error("Invalid file URL");
    }
    
    // Delete from UploadThing
    const utDeleteResult = await deleteUploadthingImage(fileKey);
    
    if (!utDeleteResult.success) {
      console.error("Failed to delete file from UploadThing:", utDeleteResult.error);
      // Continue with database deletion even if UT deletion fails
    }
    
    // Delete from database
    await prisma.productImage.delete({
      where: { id: imageId }
    });
    
    revalidatePath(`/admin/${storeId}/products`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product image:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete product image"
    };
  }
}

export async function updateProduct(formData: FormData) {
  const { userId: clerkId } = await auth();
  const storeId = formData.get("storeId") as string;
  const productId = parseInt(formData.get("productId") as string, 10);
  
  if (!clerkId) {
    throw new Error("Unauthorized");
  }
  
  // Get the store from storeId string
  const store = await prisma.userStore.findFirst({
    where: { 
      storeId,
      user: {
        clerkId
      }
    },
    select: { id: true }
  });
  
  if (!store) {
    throw new Error("Store not found");
  }
  
  // Verify product belongs to this store
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId: store.id
    },
    include: {
      images: true
    }
  });
  
  if (!existingProduct) {
    throw new Error("Product not found or you don't have permission to edit it");
  }
  
  // Extract values from formData
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockLevel = parseInt(formData.get("stockLevel") as string, 10);
  const isActive = formData.get("isActive") === "true";
  const categoryId = formData.get("categoryId") ? 
    parseInt(formData.get("categoryId") as string, 10) : 
    undefined;
  const imagesJson = formData.get("images") as string;
  const images = JSON.parse(imagesJson);
  
  try {
    // Validate with Zod
    const validatedData = productFormSchema.parse({
      name,
      description,
      price,
      stockLevel,
      isActive,
      categoryId,
      images
    });
    
    // Update product in database
    const product = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stockLevel: validatedData.stockLevel,
        isActive: validatedData.isActive,
        categoryId: validatedData.categoryId,
      }
    });
    
    // Handle images - identify which ones to keep, which to delete, and which to add
    const existingImageIds = existingProduct.images.map(img => img.id);
    const updatedImageIds = images.filter((img: {id?: number}) => img.id).map((img: {id?: number}) => img.id as number);
    
    // Images to delete - exist in the DB but not in the updated list
    const imagesToDelete = existingImageIds.filter(id => !updatedImageIds.includes(id));
    
    // Images to add - don't have an ID (new uploads)
    const imagesToAdd = images.filter((img: {id?: number}) => !img.id);
    
    // Delete removed images
    if (imagesToDelete.length > 0) {
      // First get the URLs so we can delete from storage
      const imagesToDeleteData = await prisma.productImage.findMany({
        where: {
          id: {
            in: imagesToDelete
          }
        }
      });
      
      // Delete from database
      await prisma.productImage.deleteMany({
        where: {
          id: {
            in: imagesToDelete
          }
        }
      });
      
      // Delete from UploadThing
      for (const image of imagesToDeleteData) {
        const fileKey = image.url.split('/').pop();
        if (fileKey) {
          await deleteUploadthingImage(fileKey).catch(err => {
            console.error(`Failed to delete image from storage: ${err}`);
          });
        }
      }
    }
    
    // Add new images
    if (imagesToAdd.length > 0) {
      await prisma.productImage.createMany({
        data: imagesToAdd.map((image: {url: string}) => ({
          productId: product.id,
          url: image.url
        }))
      });
    }
    
    revalidatePath(`/admin/${storeId}/products`);
    
    // Return success instead of redirecting
    return {
      success: true,
      productId: product.id
    };
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
}

export async function deleteProduct(storeId: string, productId: number) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error("Unauthorized");
  }
  
  // Get the store from storeId string
  const store = await prisma.userStore.findFirst({
    where: { 
      storeId,
      user: {
        clerkId
      }
    },
    select: { id: true }
  });
  
  if (!store) {
    throw new Error("Store not found");
  }
  
  // Verify product belongs to this store and get its images
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId: store.id
    },
    include: {
      images: true
    }
  });
  
  if (!existingProduct) {
    throw new Error("Product not found or you don't have permission to delete it");
  }
  
  try {
    // First, collect all image URLs to delete from storage
    const imageUrls = existingProduct.images.map(img => img.url);
    
    // Delete the product (this will cascade delete the images from the database due to onDelete: Cascade)
    await prisma.product.delete({
      where: {
        id: productId
      }
    });
    
    // Now delete the image files from UploadThing
    for (const url of imageUrls) {
      const fileKey = url.split('/').pop();
      if (fileKey) {
        await deleteUploadthingImage(fileKey).catch(err => {
          // Log but don't fail if image deletion fails
          console.error(`Failed to delete image from storage: ${err}`);
        });
      }
    }
    
    revalidatePath(`/admin/${storeId}/products`);
    
    return {
      success: true,
      message: "Product deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete product"
    };
  }
}
