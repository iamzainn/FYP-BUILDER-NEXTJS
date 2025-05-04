
import prisma from "@/lib/prisma";

import CustomersTable from "@/components/admin/CustomersTable";

interface CustomersPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

async function getCustomers(
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
        { email: { contains: searchQuery } },
        { firstName: { contains: searchQuery } },
        { lastName: { contains: searchQuery } },
        { phone: { contains: searchQuery } },
      ],
    } : {}),
  };
  
  // Get customers
  const customers = await prisma.storeCustomer.findMany({
    where,
    include: {
      orders: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
  });
  
  // Get total count for pagination
  const totalCount = await prisma.storeCustomer.count({ where });
  
  return {
    customers,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function CustomersPage({ params, searchParams }: CustomersPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  const sp = await searchParams;
  
  const page = sp?.page ? parseInt(sp.page) : 1;
  const { customers, totalCount, totalPages } = await getCustomers(
    storeId,
    page,
    10,
    sp?.query
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your store customers ({totalCount} total)
          </p>
        </div>
      </div>
      
      <CustomersTable 
        customers={customers} 
        totalPages={totalPages} 
        currentPage={page} 
        storeId={storeId}
      />
    </div>
  );
} 