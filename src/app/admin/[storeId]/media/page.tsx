import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaTable from "@/components/admin/MediaTable";
import { getMedia } from "@/actions/media";

interface MediaPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ page?: string; query?: string; type?: string }>;
}

export default async function MediaPage({ params, searchParams }: MediaPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  const sp = await searchParams;
  
  const page = sp?.page ? parseInt(sp.page) : 1;
  const { media, totalCount, totalPages } = await getMedia(
    storeId,
    page,
    12,
    sp?.query,
    sp?.type
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your media files ({totalCount} total)
          </p>
        </div>
        <Link href={`/admin/${storeId}/media/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Media
          </Button>
        </Link>
      </div>
      
      <MediaTable 
        media={media} 
        totalPages={totalPages} 
        currentPage={page} 
        storeId={storeId}
      />
    </div>
  );
} 