import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import DiscountForm from "@/components/admin/DiscountForm";

interface NewDiscountPageProps {
  params: Promise<{ storeId: string }>;
}

async function getProducts(storeId: string) {
  const store = await prisma.userStore.findFirst({
    where: { storeId },
    select: { id: true }
  });

  if (!store) return [];

  return prisma.product.findMany({
    where: { storeId: store.id },
    select: { id: true, name: true }
  });
}

export default async function NewDiscountPage({ params }: NewDiscountPageProps) {
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
  
  const products = await getProducts(storeId);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Discount</h1>
        <p className="text-muted-foreground">Add a new discount coupon for your store</p>
      </div>
      
      <DiscountForm storeId={storeId} products={products} />
    </div>
  );
} 