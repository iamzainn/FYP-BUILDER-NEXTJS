import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import DiscountEditForm from "@/components/admin/DiscountEditForm";
import { getDiscount } from "@/actions/discount";

interface EditDiscountPageProps {
  params: Promise<{ storeId: string; discountId: string }>;
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

export default async function EditDiscountPage({ params }: EditDiscountPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId, discountId } = await params;
  
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
  
  const discountIdNum = parseInt(discountId);
  if (isNaN(discountIdNum)) {
    redirect(`/admin/${storeId}/discounts`);
  }
  
  try {
    // Get discount data
    const discount = await getDiscount(discountIdNum);
    
    // Get all products for the form
    const products = await getProducts(storeId);
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Discount</h1>
          <p className="text-muted-foreground">Update discount coupon details</p>
        </div>
        
        <DiscountEditForm 
          storeId={storeId} 
          discount={discount} 
          products={products} 
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching discount data:", error);
    redirect(`/admin/${storeId}/discounts`);
  }
} 