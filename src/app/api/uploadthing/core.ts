import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { getUserDbId } from "@/lib/fn";

// Initialize UploadThing
const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  productImageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "1024KB",
      maxFileCount: 3,
    },
  })
    .middleware(async ({}) => {
      try {
        // Authenticate user
        const { userId: clerkUserId } = await auth();
        
        if (!clerkUserId) {
          throw new UploadThingError("Unauthorized - No user ID");
        }
        
        const user = await getUserDbId(clerkUserId);
        if (!user) {
          throw new UploadThingError("Unauthorized - User not found in database");
        }
        
        return { userId: user.id };
      } catch (error) {
        console.error("Error in UploadThing middleware:", error);
        throw new UploadThingError("Server error during authorization");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Just return the file URL to the client
        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl, error: "Error processing upload" };
      }
    }),
    
  // Add new imageUploader for navbar images
  imageUploader: f({
    image: {
      maxFileSize: "4MB", 
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      try {
        // For navbar images, we can use a simpler auth check
        const { userId: clerkUserId } = await auth();
        
        if (!clerkUserId) {
          throw new UploadThingError("Unauthorized - Please login to upload images");
        }
        
        // You can use the same database check or simplify for navbar images
        return { userId: clerkUserId };
      } catch (error) {
        console.error("Error in imageUploader middleware:", error);
        // Allow anonymous uploads if needed for testing
        return { userId: "anonymous" };
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Return the file URL to the client
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      } catch (error) {
        console.error("Error in imageUploader onUploadComplete:", error);
        return { uploadedBy: metadata.userId, url: file.ufsUrl, error: "Error processing upload" };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
