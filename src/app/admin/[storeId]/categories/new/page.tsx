import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import CategoryForm from "@/components/admin/CategoryForm";

interface NewCategoryPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function NewCategoryPage({ params }: NewCategoryPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading 
          title="Add New Category"
          description="Create a new category for your store"
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
        <CategoryForm storeId={storeId} />
      </div>
    </div>
  );
} 