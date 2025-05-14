"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Pencil, FileQuestion, PlusCircle, FileIcon, ImageIcon, FileTextIcon, FileAudioIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { deleteMedia } from "@/actions/media";

interface MediaItem {
  id: number;
  title: string;
  description: string | null;
  url: string;
  mediaType: string;
  createdAt: Date;
}

interface MediaTableProps {
  media: MediaItem[];
  totalPages: number;
  currentPage: number;
  storeId: string;
}

export default function MediaTable({ 
  media, 
  totalPages, 
  currentPage, 
  storeId 
}: MediaTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [mediaType, setMediaType] = useState(searchParams.get("type") || "");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("query", search);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    router.push(`/admin/${storeId}/media?${params.toString()}`);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleTypeChange = (value: string) => {
    setMediaType(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    params.set("page", "1");
    router.push(`/admin/${storeId}/media?${params.toString()}`);
  };
  
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };
  
  const handleDelete = async (mediaId: number) => {
    setDeletingId(mediaId);
    try {
      const result = await deleteMedia(storeId, mediaId);
      
      if (result.success) {
        toast.success(result.message);
        // The component will be rerendered by the server after revalidation
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete media");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };
  
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return <ImageIcon className="h-4 w-4" />;
      case "VIDEO":
        return <FileIcon className="h-4 w-4" />;
      case "DOCUMENT":
        return <FileTextIcon className="h-4 w-4" />;
      case "AUDIO":
        return <FileAudioIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };
  
  const getMediaTypeLabel = (type: string) => {
    switch (type) {
      case "IMAGE":
        return "Image";
      case "VIDEO":
        return "Video";
      case "DOCUMENT":
        return "Document";
      case "AUDIO":
        return "Audio";
      default:
        return type;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search media..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="w-full sm:w-auto">
          <Select value={mediaType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="IMAGE">Images</SelectItem>
              <SelectItem value="VIDEO">Videos</SelectItem>
              <SelectItem value="DOCUMENT">Documents</SelectItem>
              <SelectItem value="AUDIO">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {media.length === 0 ? (
        <div className="bg-background border rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-muted/30 rounded-full p-3 mb-2">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No media found</h3>
            <p className="text-muted-foreground mt-1 max-w-md mx-auto">
              {searchParams.get("query") 
                ? `No media match "${searchParams.get("query")}". Try a different search term.` 
                : `No media found${mediaType && mediaType !== "ALL" ? ` with type ${getMediaTypeLabel(mediaType)}` : ''}.`}
            </p>
            {!searchParams.get("query") && !mediaType && (
              <Button asChild className="mt-4">
                <Link href={`/admin/${storeId}/media/new`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add your first media
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-muted">
                {item.mediaType === "IMAGE" && item.url ? (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    {getMediaTypeIcon(item.mediaType)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/20 hover:bg-white/40"
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                  <Link href={`/admin/${storeId}/media/${item.id}/edit`}>
                    <Button variant="outline" size="icon" className="rounded-full bg-white/20 hover:bg-white/40">
                      <Pencil className="h-4 w-4 text-white" />
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full bg-white/20 hover:bg-red-600/70"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    )}
                  </Button>
                </div>
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/60"
                >
                  {getMediaTypeLabel(item.mediaType)}
                </Badge>
              </div>
              <CardContent className="p-3">
                <Link 
                  href={`/admin/${storeId}/media/${item.id}/edit`}
                  className="font-medium hover:underline text-sm line-clamp-1"
                >
                  {item.title || "Untitled"}
                </Link>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href={`/admin/${storeId}/media?page=${Math.max(1, currentPage - 1)}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}${searchParams.get("type") ? `&type=${searchParams.get("type")}` : ""}`}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    href={`/admin/${storeId}/media?page=${index + 1}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}${searchParams.get("type") ? `&type=${searchParams.get("type")}` : ""}`}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href={`/admin/${storeId}/media?page=${Math.min(totalPages, currentPage + 1)}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}${searchParams.get("type") ? `&type=${searchParams.get("type")}` : ""}`}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 