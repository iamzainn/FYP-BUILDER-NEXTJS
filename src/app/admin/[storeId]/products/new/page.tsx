import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface NewProductPageProps {
  params: Promise<{ storeId: string }>;
}

async function getCategories(storeId: string) {
  const store = await prisma.userStore.findFirst({
    where: { storeId },
    select: { id: true }
  });

  if (!store) return [];

  return prisma.category.findMany({
    where: { storeId: store.id },
    select: { id: true, name: true }
  });
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }
  
  // Make sure the user has access to this store
  const store = await prisma.userStore.findFirst({
    where: { 
      storeId,
      user: {
        clerkId
      }
    }
  });
  
  if (!store) {
    redirect("/dashboard");
  }
  
  const categories = await getCategories(storeId);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your store</p>
      </div>
      
      <ProductForm storeId={storeId} categories={categories} />
    </div>
  );
}
