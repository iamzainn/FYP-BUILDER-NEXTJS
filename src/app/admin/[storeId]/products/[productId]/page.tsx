import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductEditForm from "@/components/admin/ProductEditForm";


interface ProductEditPageProps {
  params: Promise<{ storeId: string; productId: string }>;
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId, productId } = await params;
  const productIdInt = parseInt(productId, 10);
  
  // Check authorization
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    // We need to handle auth in the page itself
    throw new Error("Unauthorized");
  }
  
  // Get the store from storeId string
  const store = await prisma.userStore.findFirst({
    where: { 
      storeId,
      user: {
        clerkId
      }
    },
    select: { id: true }
  });
  
  if (!store) {
    notFound();
  }
  
  // Get product
  const product = await prisma.product.findFirst({
    where: {
      id: productIdInt,
      storeId: store.id
    },
    include: {
      images: true,
      category: true
    }
  });
  
  if (!product) {
    notFound();
  }
  
  // Get categories for the select input
  const categories = await prisma.category.findMany({
    where: {
      storeId: store.id
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: "asc"
    }
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update your product information and images
        </p>
      </div>
      
      <ProductEditForm 
        storeId={storeId} 
        categories={categories}
        product={product}
      />
    </div>
  );
} 