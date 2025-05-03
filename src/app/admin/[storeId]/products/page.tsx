import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";

interface ProductsPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

async function getProducts(
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
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
      ],
    } : {}),
  };
  
  // Get products
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
  });
  
  // Get total count for pagination
  const totalCount = await prisma.product.count({ where });
  
  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  const sp = await searchParams;
  
  const page = sp?.page ? parseInt(sp?.page) : 1;
  const { products, totalCount, totalPages } = await getProducts(
    storeId,
    page,
    10,
    sp?.query
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your store products ({totalCount} total)
          </p>
        </div>
        <Link href={`/admin/${storeId}/products/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      
      <ProductsTable 
        products={products} 
        totalPages={totalPages} 
        currentPage={page} 
        storeId={storeId}
      />
    </div>
  );
}
