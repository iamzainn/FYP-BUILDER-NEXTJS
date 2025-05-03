'use server';

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadthingImage(fileKey: string) {
  try {
    await utapi.deleteFiles(fileKey);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
} 