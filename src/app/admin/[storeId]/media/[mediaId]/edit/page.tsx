import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import MediaEditForm from "@/components/admin/MediaEditForm";

interface EditMediaPageProps {
  params: { storeId: string; mediaId: string };
}

export default async function EditMediaPage({ params }: EditMediaPageProps) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    redirect("/sign-in");
  }
  
  // Get the user store
  const store = await prisma.userStore.findFirst({
    where: {
      storeId: params.storeId,
      user: {
        clerkId
      }
    }
  });
  
  if (!store) {
    redirect("/");
  }
  
  // Get the media item
  const media = await prisma.media.findFirst({
    where: {
      id: parseInt(params.mediaId),
      storeId: store.id
    }
  });
  
  if (!media) {
    redirect(`/admin/${params.storeId}/media`);
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Media</h1>
        <p className="text-muted-foreground">
          Update media details and files
        </p>
      </div>
      
      <Separator />
      
      <MediaEditForm 
        storeId={params.storeId} 
        media={media} 
      />
    </div>
  );
} 