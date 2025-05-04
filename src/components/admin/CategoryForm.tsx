"use client";

import { useState, } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategory, updateCategory } from "@/actions/category";
import { categoryFormSchema, type CategoryFormValues } from "@/schemas/category";

interface CategoryFormProps {
  storeId: string;
  initialData?: {
    id: number;
    name: string;
  };
  isEditing?: boolean;
}

export default function CategoryForm({ storeId, initialData, isEditing = false }: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    }
  });
  
  const onSubmit = async (data: CategoryFormValues) => {
    setIsPending(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("storeId", storeId);
      
      if (isEditing && initialData) {
        await updateCategory(storeId, initialData.id.toString(), formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }
      
      router.push(`/admin/${storeId}/categories`);
      router.refresh();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormDescription>
                Name should be concise and clear (max 255 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/admin/${storeId}/categories`)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              </div>
            ) : isEditing ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 