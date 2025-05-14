import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import MediaEditForm from "@/components/admin/MediaEditForm";

interface MediaEditPageProps {
  params: Promise<{ storeId: string; mediaId: string }>;
}

export default async function MediaEditPage({ params }: MediaEditPageProps) {
  'use server';
  
  // Await the params to avoid Next.js warning
  const { storeId, mediaId } = await params;
  const mediaIdInt = parseInt(mediaId, 10);
  
  // Check authorization
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
    notFound();
  }
  
  // Get media
  const media = await prisma.media.findFirst({
    where: {
      id: mediaIdInt,
      storeId: store.id
    }
  });
  
  if (!media) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Media</h1>
        <p className="text-muted-foreground">
          Update media information or replace the file
        </p>
      </div>
      
      <MediaEditForm 
        storeId={storeId}
        media={media}
      />
    </div>
  );
} 