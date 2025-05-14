"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { UploadButton } from "@/utils/uploadthing";
import { updateMedia, deleteMedia, deleteMediaFile } from "@/actions/media";
import { mediaFormSchema, type MediaFormValues } from "@/schemas/media";

interface Media {
  id: number;
  title: string;
  description: string | null;
  url: string;
  fileKey: string;
  mediaType: string;
}

interface MediaEditFormProps {
  storeId: string;
  media: Media;
}

// Interface for Next.js redirect error
interface NextRedirectError extends Error {
  digest: string;
}

// Define the state type that will be returned from the server action
type MediaActionState = {
  message: string;
  success: boolean;
  redirect?: string;
};

// Interface for uploaded media files
interface UploadedMedia {
  id?: number;
  url: string;
  fileKey: string;
}

// Modified server action wrapper for useActionState compatibility
const updateMediaAction = async (state: MediaActionState | null, formData: FormData) => {
  try {
    const storeId = formData.get("storeId") as string;
    await updateMedia(formData);
    return { 
      message: "Media updated successfully", 
      success: true,
      redirect: `/admin/${storeId}/media`
    };
  } catch (error) {
    // Check if this is a redirect error from Next.js
    if (error instanceof Error && 'digest' in error && (error as NextRedirectError).digest.includes('NEXT_REDIRECT')) {
      // This is a redirect, not a real error - extract redirect URL
      const parts = (error as NextRedirectError).digest.split(';');
      const redirectUrl = parts[2];
      return { 
        message: "Media updated successfully", 
        success: true,
        redirect: redirectUrl
      };
    }
    
    return { 
      message: error instanceof Error ? error.message : "Failed to update media", 
      success: false 
    };
  }
};

export default function MediaEditForm({ storeId, media }: MediaEditFormProps) {
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([
    { id: media.id, url: media.url, fileKey: media.fileKey }
  ]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [state, formAction, pending] = useActionState(updateMediaAction, { message: '', success: false });
  
  // Ensure mediaType is one of the valid enum values, default to IMAGE if not
  const getValidMediaType = (type: string): "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" => {
    return ["IMAGE", "VIDEO", "DOCUMENT", "AUDIO"].includes(type) 
      ? type as "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" 
      : "IMAGE";
  };
  
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: media.title,
      description: media.description || "",
      url: media.url,
      fileKey: media.fileKey,
      mediaType: getValidMediaType(media.mediaType)
    }
  });
  
  // Use state to track form validity
  const [isFormValid, setIsFormValid] = useState(true); // Default to true for edit form
  
  // Watch form values
  const { title, description, mediaType } = form.watch();
  
  // Update form validity whenever values change
  useEffect(() => {
    setIsFormValid(uploadedFiles.length > 0 && title.trim() !== '');
  }, [uploadedFiles, title]);
  
  // Generate form state for hidden fields
  const formState = {
    title,
    description: description || "",
    url: uploadedFiles[0]?.url || "",
    fileKey: uploadedFiles[0]?.fileKey || "",
    mediaType,
    allFiles: JSON.stringify(uploadedFiles)
  };
  
  const router = useRouter();
  
  const removeFile = async (index: number) => {
    const file = uploadedFiles[index];
    
    // Set loading state
    setIsDeleting(index);
    
    try {
      // If it has an ID, it needs to be deleted from the database
      if (file.id) {
        // For primary file (index 0), use deleteMediaFile instead of deleteMedia
        if (index === 0) {
          const result = await deleteMediaFile(storeId, file.id, file.fileKey);
          
          if (!result.success) {
            throw new Error(result.message || "Failed to delete media file");
          }
        } else {
          const result = await deleteMedia(storeId, file.id);
          
          if (!result.success) {
            throw new Error(result.message || "Failed to delete media");
          }
        }
      }
      
      // In all cases, delete from UploadThing if we have a fileKey
      if (file.fileKey && index !== 0) { // Skip for primary file since deleteMediaFile already does this
        const { deleteUploadthingImage } = await import("@/actions/uploadthing");
        await deleteUploadthingImage(file.fileKey);
      }
      
      // Remove from UI state
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      toast.success("File removed successfully");
      
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Display success/error message and handle redirect
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        // If the action returned a redirect URL, navigate to it
        if (state.redirect) {
          router.push(state.redirect);
        }
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);
  
  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Media details */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter media title" {...field} name="title" />
                  </FormControl>
                  <FormDescription>
                    A descriptive title for your media (max 255 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter media description" 
                      className="resize-none min-h-[120px]" 
                      {...field}
                      name="description" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select media type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem disabled value="VIDEO">Video</SelectItem>
                      <SelectItem disabled value="DOCUMENT">Document</SelectItem>
                      <SelectItem disabled value="AUDIO">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Hidden inputs */}
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="mediaId" value={media.id.toString()} />
            <input type="hidden" name="url" value={formState.url} />
            <input type="hidden" name="fileKey" value={formState.fileKey} />
            <input type="hidden" name="mediaType" value={formState.mediaType} />
            <input type="hidden" name="allFiles" value={formState.allFiles} />
          </div>
          
          {/* Right column - Media files grid */}
          <div className="space-y-6">
            <div>
              <FormLabel className="block mb-2">
                Media Files <span className="text-red-500">*</span>
              </FormLabel>
              <FormDescription className="mb-4">
                The first file is the primary one. You can add up to 3 files.
              </FormDescription>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {uploadedFiles.map((file, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-square">
                      {mediaType === "IMAGE" && (
                        <Image 
                          width={400}
                          height={400}
                          src={file.url} 
                          alt={`Media file ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      )}
                      {mediaType !== "IMAGE" && (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-muted-foreground">
                            {mediaType.charAt(0) + mediaType.slice(1).toLowerCase()} File
                          </span>
                        </div>
                      )}
                      
                      {/* Show delete button for all files */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => removeFile(index)}
                        disabled={isDeleting === index}
                      >
                        {isDeleting === index ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                
                {uploadedFiles.length < 3 && (
                  <Card className={cn(
                    "border-dashed aspect-square flex items-center justify-center",
                    uploadedFiles.length === 0 && "col-span-2"
                  )}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <UploadButton
                        endpoint="mediaLibraryUploader"
                        appearance={{
                          button: "bg-primary hover:bg-primary/90 text-primary-foreground",
                          container: "w-full flex flex-col",
                          allowedContent: "text-xs text-muted-foreground"
                        }}
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            // Process all uploaded files
                            const newFiles = res.map(file => {
                              // Get the URL and fileKey from the response
                              const imageUrl = (file as { fileUrl?: string }).fileUrl || file.url;
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const fileKey = (file as { fileKey?: string }).fileKey || (file as any).key;
                              return { url: imageUrl, fileKey };
                            });
                            
                            // Add the new files to our state, respecting the 3 file limit
                            setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 3));
                            toast.success("File(s) uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error("Upload error:", error);
                          toast.error("Failed to upload file. Please try again.");
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {uploadedFiles.length === 0 && (
                <FormMessage>At least one media file is required</FormMessage>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={pending || !isFormValid || uploadedFiles.length === 0}
            className="inline-flex items-center justify-center p-2 px-4 text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-md disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            {pending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Updating...</span>
              </div>
            ) : "Update Media"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 