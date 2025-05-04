"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
interface Category {
  id: number;
  name: string;
}

interface CategoriesListProps {
  categories: Category[];
  storeId: string;
}

export function CategoriesList({ categories, storeId }: CategoriesListProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const router = useRouter();
  
  const onDelete = async () => {
    if (!categoryToDelete) return;
    
    setLoading(true);
    
    try {
      const result = await deleteCategory(storeId, categoryToDelete.id.toString());
      
      if (result.success) {
        toast.success("Category deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
      setCategoryToDelete(null);
    }
  };
  
  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                Category ID: {category.id}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <Link href={`/admin/${storeId}/categories/${category.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      setCategoryToDelete(category);
                      setOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
} 