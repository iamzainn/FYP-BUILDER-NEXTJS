import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DiscountsTable from "@/components/admin/DiscountsTable";

interface DiscountsPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

async function getDiscounts(
  storeId: string,
  page = 1,
  pageSize = 10,
  searchQuery?: string
) {
  const skip = (page - 1) * pageSize;
  
  // Build the where clause
  const where = {
    store: { storeId },
    ...(searchQuery ? {
      OR: [
        { couponCode: { contains: searchQuery } },
      ],
    } : {}),
  };
  
  // Get discounts
  const discounts = await prisma.discount.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
  });
  
  // Get total count for pagination
  const totalCount = await prisma.discount.count({ where });
  
  return {
    discounts,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function DiscountsPage({ params, searchParams }: DiscountsPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  console.log(storeId + " from page discounts");

  const sp = await searchParams;
  
  const page = sp?.page ? parseInt(sp?.page) : 1;
  const { discounts, totalCount, totalPages } = await getDiscounts(
    storeId,
    page,
    10,
    sp?.query
  );

  console.log(discounts);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Discounts</h1>
          <p className="text-muted-foreground">
            Manage your store discounts ({totalCount} total)
          </p>
        </div>
        <Link href={`/admin/${storeId}/discounts/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </Link>
      </div>
      
      <DiscountsTable 
        discounts={discounts} 
        totalPages={totalPages} 
        currentPage={page} 
        storeId={storeId}
      />
    </div>
  );
}