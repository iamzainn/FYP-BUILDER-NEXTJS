import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, CreditCard, DollarSign } from "lucide-react";
import RecentOrdersTable, { Order } from "@/components/admin/RecentOrdersTable";
import TopProductsTable from "@/components/admin/TopProductsTable";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

async function getStoreOverview(storeId: string) {
  const totalProducts = await prisma.product.count({
    where: { store: { storeId } }
  });
  
  const totalCustomers = await prisma.storeCustomer.count({
    where: { store: { storeId } }
  });
  
  const totalOrders = await prisma.order.count({
    where: { store: { storeId } }
  });
  
  // Calculate store revenue
  const revenue = await prisma.order.aggregate({
    where: { 
      store: { storeId },
      paymentStatus: "PAID"
    },
    _sum: {
      total: true
    }
  });
  
  return {
    totalProducts,
    totalCustomers,
    totalOrders,
    revenue: revenue._sum.total || 0
  };
}

async function getRecentOrders(storeId: string) {
  const store = await prisma.userStore.findFirst({
    where: { storeId },
    select: { id: true }
  });

  if (!store) return [];

  return await prisma.order.findMany({
    where: { storeId: store.id },
    include: {
      customer: true,
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  }).then(orders => {
    // Transform orders to match the expected interface
    return orders.map(order => ({
      ...order,
      createdAt: order.createdAt,
      store: {
        storeId
      }
    }));
  });
}

async function getTopProducts(storeId: string) {
  const store = await prisma.userStore.findFirst({
    where: { storeId },
    select: { id: true }
  });

  if (!store) return [];

  // Get products with their order items and sort them
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: {
      orderItems: true,
      category: true
    },
  });
  
  // Calculate totals and sort by popularity
  const productsWithSales = products.map(product => {
    const totalOrdered = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Transform product to match expected interface
    return {
      ...product,
      totalOrdered,
      store: {
        storeId
      }
    };
  });
  
  return productsWithSales.sort((a, b) => b.totalOrdered - a.totalOrdered).slice(0, 5);
}

export default async function AdminDashboardPage({ params }: DashboardPageProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  
  // Get the required data
  const overview = await getStoreOverview(storeId);
  const recentOrders = await getRecentOrders(storeId);
  const topProducts = await getTopProducts(storeId);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(overview.revenue.toString()).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsTable products={topProducts} />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable orders={recentOrders as Order[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
