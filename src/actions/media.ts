'use server'

import { mediaFormSchema } from "@/schemas/media";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteUploadthingImage } from "./uploadthing";
import { MediaType } from "@prisma/client";


export async function createMedia(formData: FormData) {
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
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const fileKey = formData.get("fileKey") as string;
  const mediaType = formData.get("mediaType") as string;
  const allFilesJson = formData.get("allFiles") as string;
  
  try {
    // Validate main media item with Zod
    const validatedData = mediaFormSchema.parse({
      title,
      description,
      url,
      fileKey,
      mediaType
    });
    
    // Create the primary media record in database
    const media = await prisma.media.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        url: validatedData.url,
        fileKey: validatedData.fileKey,
        mediaType: validatedData.mediaType as MediaType,
        storeId: store.id,
      }
    });
    
    // If there are additional files, add them as well
    if (allFilesJson) {
      try {
        const allFiles = JSON.parse(allFilesJson) as { url: string; fileKey: string }[];
        
        // Skip the first file as it's already been created as the primary media
        const additionalFiles = allFiles.slice(1);
        
        if (additionalFiles.length > 0) {
          // Create additional media records
          await Promise.all(additionalFiles.map(file => 
            prisma.media.create({
              data: {
                title: `${validatedData.title} (${file.fileKey.slice(-8)})`, // Add unique suffix
                description: validatedData.description,
                url: file.url,
                fileKey: file.fileKey,
                mediaType: validatedData.mediaType as MediaType,
                storeId: store.id,
              }
            })
          ));
        }
      } catch (error) {
        console.error("Error creating additional media files:", error);
        // Continue with the primary file creation even if additional files fail
      }
    }
    
    revalidatePath(`/admin/${storeId}/media`);
    
    // Return success
    return {
      success: true,
      mediaId: media.id
    };
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function updateMedia(formData: FormData) {
  const { userId: clerkId } = await auth();
  const storeId = formData.get("storeId") as string;
  const mediaId = parseInt(formData.get("mediaId") as string, 10);
  
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
  
  // Verify media belongs to this store
  const existingMedia = await prisma.media.findFirst({
    where: {
      id: mediaId,
      storeId: store.id
    }
  });
  
  if (!existingMedia) {
    throw new Error("Media not found or you don't have permission to edit it");
  }
  
  // Extract values from formData
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const fileKey = formData.get("fileKey") as string;
  const mediaType = formData.get("mediaType") as string;
  
  try {
    // Validate with Zod
    const validatedData = mediaFormSchema.parse({
      title,
      description,
      url,
      fileKey,
      mediaType
    });
    
    // Update media in database
    const media = await prisma.media.update({
      where: {
        id: mediaId
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        url: validatedData.url,
        fileKey: validatedData.fileKey,
        mediaType: validatedData.mediaType,
      }
    });
    
    revalidatePath(`/admin/${storeId}/media`);
    
    // Return success
    return {
      success: true,
      mediaId: media.id
    };
  } catch (error) {
    console.error("Failed to update media:", error);
    throw error;
  }
}

export async function deleteMedia(storeId: string, mediaId: number) {
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
  
  // Verify media belongs to this store
  const existingMedia = await prisma.media.findFirst({
    where: {
      id: mediaId,
      storeId: store.id
    }
  });
  
  if (!existingMedia) {
    throw new Error("Media not found or you don't have permission to delete it");
  }
  
  try {
    // Delete from database
    await prisma.media.delete({
      where: {
        id: mediaId
      }
    });
    
    // Delete from UploadThing
    if (existingMedia.fileKey) {
      await deleteUploadthingImage(existingMedia.fileKey).catch(err => {
        // Log but don't fail if image deletion fails
        console.error(`Failed to delete file from storage: ${err}`);
      });
    }
    
    revalidatePath(`/admin/${storeId}/media`);
    
    return {
      success: true,
      message: "Media deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete media"
    };
  }
}

export async function deleteMediaFile(storeId: string, mediaId: number, fileKey: string) {
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
  
  // Verify media belongs to this store
  const existingMedia = await prisma.media.findFirst({
    where: {
      id: mediaId,
      storeId: store.id
    }
  });
  
  if (!existingMedia) {
    throw new Error("Media not found or you don't have permission to modify it");
  }
  
  try {
    // Delete from UploadThing
    if (fileKey) {
      await deleteUploadthingImage(fileKey).catch(err => {
        // Log but don't fail if image deletion fails
        console.error(`Failed to delete file from storage: ${err}`);
      });
    }
    
    // Instead of deleting the media record, update it with a placeholder or null URL
    await prisma.media.update({
      where: {
        id: mediaId
      },
      data: {
        url: "",
        fileKey: ""
      }
    });
    
    revalidatePath(`/admin/${storeId}/media`);
    
    return {
      success: true,
      message: "Media file deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete media file:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete media file"
    };
  }
}

export async function getMedia(
  storeId: string,
  page = 1,
  pageSize = 12,
  searchQuery?: string,
  mediaType?: string
) {
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
  
  const skip = (page - 1) * pageSize;
  
  // Build the where clause with proper type casting for mediaType
  const where: {
    storeId: number;
    mediaType?: MediaType;
    OR?: { title: { contains: string } }[] | { description: { contains: string } }[];
  } = {
    storeId: store.id,
    ...(searchQuery ? {
      OR: [
        { title: { contains: searchQuery } },
        
      ],
    } : {}),
  };
  
  // Only add mediaType filter if it's a valid enum value
  if (mediaType && ["IMAGE", "VIDEO", "DOCUMENT", "AUDIO"].includes(mediaType)) {
    where.mediaType = mediaType as MediaType;
  }
  
  // Get media
  const media = await prisma.media.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
  });
  
  // Get total count for pagination
  const totalCount = await prisma.media.count({ where });
  
  return {
    media,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
} 