import prisma from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";

interface OrdersPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ 
    page?: string; 
    query?: string; 
    status?: string;
    customerId?: string;
  }>;
}

async function getOrders(
  storeId: string,
  page = 1,
  pageSize = 10,
  searchQuery?: string,
  statusFilter?: string,
  customerId?: string
) {
  const skip = (page - 1) * pageSize;
  
  // Build the where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    store: { storeId },
  };
  
  // Add search query if provided
  if (searchQuery) {
    where.OR = [
      { orderNumber: { contains: searchQuery } },
      { customer: { 
        OR: [
          { email: { contains: searchQuery } },
          { firstName: { contains: searchQuery } },
          { lastName: { contains: searchQuery } },
        ] 
      }},
    ];
  }
  
  // Add status filter if provided
  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }
  
  // Add customer filter if provided
  if (customerId) {
    where.customerId = parseInt(customerId);
  }
  
  // Get orders
  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
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
  const totalCount = await prisma.order.count({ where });
  
  return {
    orders,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  const sp = await searchParams;
  
  const page = sp?.page ? parseInt(sp.page) : 1;
  const { orders, totalCount, totalPages } = await getOrders(
    storeId,
    page,
    10,
    sp?.query,
    sp?.status,
    sp?.customerId
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage your store orders ({totalCount} total)
          </p>
        </div>
      </div>
      
      <OrdersTable 
        orders={orders} 
        totalPages={totalPages} 
        currentPage={page} 
        storeId={storeId}
        statusFilter={sp?.status || "all"}
        customerId={sp?.customerId}
      />
    </div>
  );
} 