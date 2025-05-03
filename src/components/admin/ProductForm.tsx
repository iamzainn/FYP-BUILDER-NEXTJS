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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/utils/uploadthing";
import { createProduct, deleteProductImage } from "@/actions/product";
import { productFormSchema, type ProductFormValues } from "@/schemas/product";

interface ProductFormProps {
  storeId: string;
  categories: { id: number; name: string }[];
}

// Interface for Next.js redirect error
interface NextRedirectError extends Error {
  digest: string;
}

// Define the state type that will be returned from the server action
type ProductActionState = {
  message: string;
  success: boolean;
  redirect?: string;
};

// Modified server action wrapper for useActionState compatibility
const createProductAction = async (state: ProductActionState | null, formData: FormData) => {
  try {
    const storeId = formData.get("storeId") as string;
    await createProduct(formData);
    return { 
      message: "Product created successfully", 
      success: true,
      redirect: `/admin/${storeId}/products`
    };
  } catch (error) {
    // Check if this is a redirect error from Next.js
    if (error instanceof Error && 'digest' in error && (error as NextRedirectError).digest.includes('NEXT_REDIRECT')) {
      // This is a redirect, not a real error - extract redirect URL
      const parts = (error as NextRedirectError).digest.split(';');
      const redirectUrl = parts[2];
      return { 
        message: "Product created successfully", 
        success: true,
        redirect: redirectUrl
      };
    }
    
    return { 
      message: error instanceof Error ? error.message : "Failed to create product", 
      success: false 
    };
  }
};

export default function ProductForm({ storeId, categories }: ProductFormProps) {
  
  const [uploadedImages, setUploadedImages] = useState<{ url: string; id?: number }[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [state, formAction, pending] = useActionState(createProductAction, { message: '', success: false });
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stockLevel: 0,
      isActive: true,
      categoryId: undefined,
      images: []
    }
  });
  
  // Use state to track form validity
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Watch form values to update hidden inputs
  const { name, description, price, stockLevel, isActive, categoryId } = form.watch();
  
  // Update form validity whenever values change
  useEffect(() => {
    setIsFormValid(uploadedImages.length > 0 && name.trim() !== '');
  }, [uploadedImages, name]);
  
  // Generate form state for hidden fields
  const formState = {
    name,
    description: description || "",
    price: typeof price === 'number' ? price.toString() : "0",
    stockLevel: typeof stockLevel === 'number' ? stockLevel.toString() : "0",
    isActive: isActive ? "true" : "false",
    categoryId: categoryId !== undefined ? categoryId.toString() : "",
    images: JSON.stringify(uploadedImages)
  };
  
  const removeImage = async (index: number) => {
    const image = uploadedImages[index];
    
    // If this is a new upload without an ID, just remove it from state
    if (!image.id) {
      const fileKey = image.url.split('/').pop();
      if (fileKey) {
        // Even for images not yet saved to DB, we should delete from UploadThing
        setIsDeleting(index);
        try {
          // Import the deleteUploadthingImage function dynamically
          const { deleteUploadthingImage } = await import("@/actions/uploadthing");
          await deleteUploadthingImage(fileKey);
        } catch (error) {
          console.error("Error deleting new upload:", error);
        } finally {
          setIsDeleting(null);
        }
      }
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      return;
    }
    
    // Otherwise, delete from database and storage
    setIsDeleting(index);
    
    try {
      const result = await deleteProductImage(storeId, image.id, image.url);
      
      if (result.success) {
        // Only remove from UI after successful deletion
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        toast.success("Image deleted successfully");
      } else {
        console.error("Delete image error:", result.error);
        toast.error(result.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("An error occurred while deleting the image");
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Add import for useRouter at the top of the file
  const router = useRouter();
  
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
    <Form {...form} >
      <form action={formAction} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Product details */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} name="name" />
                  </FormControl>
                  <FormDescription>
                    Name should be concise and clear (max 255 characters)
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
                      placeholder="Enter product description" 
                      className="resize-none min-h-[120px]" 
                      {...field}
                      name="description" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Hidden inputs to store form state */}
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="images" value={formState.images} />
            <input type="hidden" name="isActive" value={formState.isActive} />
            <input type="hidden" name="categoryId" value={formState.categoryId} />
            <input type="hidden" name="price" value={formState.price} />
            <input type="hidden" name="stockLevel" value={formState.stockLevel} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          className="pl-7" 
                          placeholder="0.00"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : 0);
                          }}
                          name="price"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value, 10) : 0);
                        }}
                        name="stockLevel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value, 10))} 
                    value={field.value?.toString() || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Make this product visible to customers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Right column - Product images */}
          <div className="space-y-6">
            <div>
              <FormLabel className="block mb-2">
                Product Images <span className="text-red-500">*</span>
              </FormLabel>
              <FormDescription className="mb-4">
                Upload at least one image. Max file size 1MB.
              </FormDescription>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {uploadedImages.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image 
                        width={400}
                        height={400}
                        src={image.url} 
                        alt={`Product image ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => removeImage(index)}
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
                
                {uploadedImages.length < 3 && (
                  <Card className={cn(
                    "border-dashed aspect-square flex items-center justify-center",
                    uploadedImages.length === 0 && "col-span-2"
                  )}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <UploadButton
                        endpoint="productImageUploader"
                        appearance={{
                          button: "bg-primary hover:bg-primary/90 text-primary-foreground",
                          container: "w-full flex flex-col",
                          allowedContent: "text-xs text-muted-foreground"
                        }}
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            // Get the URL from the response - prefer fileUrl (our custom property)
                            const imageUrl = (res[0] as { fileUrl?: string }).fileUrl || res[0].url;
                            
                            // Add the image to our state
                            setUploadedImages(prev => [...prev, { url: imageUrl }]);
                            toast.success("Image uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error("Upload error:", error);
                          toast.error("Failed to upload image. Please try again.");
                        }}
                        onUploadBegin={() => {
                          
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {uploadedImages.length === 0 && (
                <FormMessage>At least one product image is required</FormMessage>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={pending || !isFormValid || uploadedImages.length === 0}
            className="inline-flex items-center justify-center p-2 px-4 text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-md disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            {pending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Creating...</span>
              </div>
            ) : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
