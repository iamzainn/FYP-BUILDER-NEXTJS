import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getCategoryById } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import CategoryForm from "@/components/admin/CategoryForm";

interface CategoryPageProps {
  params: Promise<{ storeId: string; categoryId: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId, categoryId } = await params;
  
  // Fetch category data
  const category = await getCategoryById(storeId, categoryId).catch(() => null);
  
  if (!category) {
    notFound();
  }
  
  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading 
          title={`Edit Category: ${category.name}`}
          description="Update your category details"
        />
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/${storeId}/categories`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
      </div>
      
      <Separator />
      
      <div className="max-w-2xl mx-auto">
        <CategoryForm 
          storeId={storeId} 
          initialData={category} 
          isEditing={true} 
        />
      </div>
    </div>
  );
} 