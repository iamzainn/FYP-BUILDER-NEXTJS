import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, ArrowLeft } from "lucide-react";
import { formatDistance } from "date-fns";

interface CustomerDetailPageProps {
  params: Promise<{ storeId: string; customerId: string }>;
}

async function getCustomerWithOrders(storeId: string, customerId: string) {
  const customer = await prisma.storeCustomer.findUnique({
    where: {
      id: parseInt(customerId),
      store: { storeId },
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });
  
  if (!customer) {
    return null;
  }
  
  // Get total spent by this customer
  const totalSpent = await prisma.order.aggregate({
    where: {
      customerId: customer.id,
      store: { storeId },
      NOT: {
        status: "CANCELLED",
      },
    },
    _sum: {
      total: true,
    },
  });
  
  return {
    ...customer,
    totalSpent: totalSpent._sum.total || 0,
  };
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { storeId, customerId } = await params;
  
  const customer = await getCustomerWithOrders(storeId, customerId);
  
  if (!customer) {
    notFound();
  }
  
  // Get status badge color for orders
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    
    return statusMap[status] || "";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-4">
          <Link href={`/admin/${storeId}/customers`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to customers
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User />
              <span>Customer Details</span>
            </CardTitle>
            <CardDescription>
              Customer since {formatDistance(new Date(customer.createdAt!), new Date(), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div>{customer.firstName && customer.lastName 
                ? `${customer.firstName} ${customer.lastName}`
                : "Not provided"}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="hover:underline">
                  {customer.email}
                </a>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {customer.phone ? (
                  <a href={`tel:${customer.phone}`} className="hover:underline">
                    {customer.phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Address</div>
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  {customer.address ? (
                    <div className="whitespace-pre-line">
                      {customer.address}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Customer Overview</CardTitle>
            <CardDescription>
              Summary and recent orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
                <div className="text-2xl font-bold mt-2 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  {customer.orders.length}
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold mt-2">
                  ${customer.totalSpent.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
              
              {customer.orders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  This customer has not placed any orders yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border rounded-md p-4">
                      <div className="space-y-1">
                        <Link
                          href={`/admin/${storeId}/orders/${order.id}`}
                          className="font-medium hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 inline mr-1" />
                          {new Date(order.createdAt!).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusBadge(order.status)}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </Badge>
                        <div className="font-medium">
                          ${parseFloat(order.total.toString()).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {customer.orders.length > 5 && (
                    <Link href={`/admin/${storeId}/orders?customerId=${customer.id}`}>
                      <Button variant="outline" className="w-full">
                        View All Orders
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 