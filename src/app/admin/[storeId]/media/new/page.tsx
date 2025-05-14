import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import MediaForm from "@/components/admin/MediaForm";

interface NewMediaPageProps {
  params: { storeId: string };
}

export default async function NewMediaPage({ params }: NewMediaPageProps) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    redirect("/sign-in");
  }
  
  // Get the user store ID
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Media</h1>
        <p className="text-muted-foreground">
          Upload and manage files in your media library
        </p>
      </div>
      
      <Separator />
      
      <MediaForm storeId={params.storeId} />
    </div>
  );
} 