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
import { createMedia } from "@/actions/media";
import { mediaFormSchema, type MediaFormValues } from "@/schemas/media";

interface MediaFormProps {
  storeId: string;
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
  url: string;
  fileKey: string;
}

// Modified server action wrapper for useActionState compatibility
const createMediaAction = async (state: MediaActionState | null, formData: FormData) => {
  try {
    const storeId = formData.get("storeId") as string;
    await createMedia(formData);
    return { 
      message: "Media created successfully", 
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
        message: "Media created successfully", 
        success: true,
        redirect: redirectUrl
      };
    }
    
    return { 
      message: error instanceof Error ? error.message : "Failed to create media", 
      success: false 
    };
  }
};

export default function MediaForm({ storeId }: MediaFormProps) {
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [state, formAction, pending] = useActionState(createMediaAction, { message: '', success: false });
  
  // Use state to track form validity
  const [isFormValid, setIsFormValid] = useState(false);
  
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      fileKey: "",
      mediaType: "IMAGE"
    }
  });
  
  // Watch form values
  const { title, mediaType } = form.watch();
  
  // Update form validity whenever values change
  useEffect(() => {
    setIsFormValid(uploadedFiles.length > 0 && title.trim() !== '');
  }, [uploadedFiles, title]);
  
  // Update form fields when files are uploaded - use the first file for form values
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const primaryFile = uploadedFiles[0];
      form.setValue("url", primaryFile.url);
      form.setValue("fileKey", primaryFile.fileKey);
    } else {
      form.setValue("url", "");
      form.setValue("fileKey", "");
    }
  }, [uploadedFiles, form]);
  
  const router = useRouter();
  
  const removeFile = async (index: number) => {
    const file = uploadedFiles[index];
    
    setIsDeleting(index);
    
    try {
      // Import the deleteUploadthingImage function dynamically
      const { deleteUploadthingImage } = await import("@/actions/uploadthing");
      await deleteUploadthingImage(file.fileKey);
      
      // Remove the file from state
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      toast.success("File removed");
    } catch (error) {
      console.error("Error deleting file:", error);
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
  
  // Generate JSON string of all uploaded files
  const allFilesJson = JSON.stringify(uploadedFiles);
  
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
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="DOCUMENT">Document</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Hidden inputs */}
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="url" value={uploadedFiles[0]?.url || ""} />
            <input type="hidden" name="fileKey" value={uploadedFiles[0]?.fileKey || ""} />
            <input type="hidden" name="mediaType" value={mediaType} />
            <input type="hidden" name="allFiles" value={allFilesJson} />
          </div>
          
          {/* Right column - File upload */}
          <div className="space-y-6">
            <div>
              <FormLabel className="block mb-2">
                Media Files <span className="text-red-500">*</span>
              </FormLabel>
              <FormDescription className="mb-4">
                Upload up to three media files. Max file size 4MB.
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
                              // Get the URL and fileKey from the response - prefer fileUrl (our custom property)
                              const imageUrl = (file as { fileUrl?: string }).fileUrl || file.url;
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const fileKey = (file as { fileKey?: string }).fileKey || (file as any).key;
                              return { url: imageUrl, fileKey };
                            });
                            
                            // Add all new files to our state
                            setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 3));
                            toast.success("Files uploaded successfully!");
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
                <span>Creating...</span>
              </div>
            ) : "Add Media"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 