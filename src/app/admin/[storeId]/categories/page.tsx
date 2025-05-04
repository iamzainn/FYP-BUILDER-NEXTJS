import { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, Plus } from "lucide-react";
import { getCategoriesCount } from "@/actions/category";
import { getCategories } from "@/actions/category";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CategoriesList } from "@/components/admin/CategoriesList";
import { CategoriesLoading } from "./loading";

interface CategoriesPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  console.log(storeId + " from page categories");
  
  // Get categories count for the heading
  const categoriesCount = await getCategoriesCount(storeId);
  console.log(categoriesCount + " from page categories");

  return (
    
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading 
          title={`Categories (${categoriesCount})`}
          description="Manage your store categories"
        />
        <Button asChild size="sm">
          <Link href={`/admin/${storeId}/categories/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>
      
      <Separator />
      
      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesContent storeId={storeId} />  
      </Suspense>
    </div>
  );
}

async function CategoriesContent({ storeId }: { storeId: string }) {
  // Fetch categories
  const categories = await getCategories(storeId);
  
  // Show empty state if no categories
  if (!categories || categories.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No categories found</AlertTitle>
        <AlertDescription>
          You haven&apos;t created any categories yet. Categories help you organize your products.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <CategoriesList categories={categories} storeId={storeId} />;
} 