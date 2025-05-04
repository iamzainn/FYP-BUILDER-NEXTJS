import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  MapPin, 
  ShoppingCart, 
  User
} from "lucide-react";
import { format } from "date-fns";

interface OrderDetailPageProps {
  params: Promise<{ storeId: string; orderId: string }>;
}

async function getOrderWithDetails(storeId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: parseInt(orderId),
      store: { storeId },
    },
    include: {
      customer: true,
      orderItems: {
        include: {
          product: {
            include: {
              images: {
                take: 1,
              },
            },
          },
        },
      },
      coupon: true,
    },
  });
  
  return order;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { storeId, orderId } = await params;
  
  const order = await getOrderWithDetails(storeId, orderId);
  
  if (!order) {
    notFound();
  }
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; bgColor: string }> = {
      PENDING: { color: "text-yellow-800", bgColor: "bg-yellow-100" },
      PROCESSING: { color: "text-blue-800", bgColor: "bg-blue-100" },
      SHIPPED: { color: "text-purple-800", bgColor: "bg-purple-100" },
      DELIVERED: { color: "text-green-800", bgColor: "bg-green-100" },
      CANCELLED: { color: "text-red-800", bgColor: "bg-red-100" },
    };
    
    return statusMap[status] || { color: "", bgColor: "" };
  };
  
  // Get payment status badge styling
  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; bgColor: string }> = {
      PENDING: { color: "text-yellow-800", bgColor: "bg-yellow-100" },
      PAID: { color: "text-green-800", bgColor: "bg-green-100" },
      FAILED: { color: "text-red-800", bgColor: "bg-red-100" },
      REFUNDED: { color: "text-blue-800", bgColor: "bg-blue-100" },
    };
    
    return statusMap[status] || { color: "", bgColor: "" };
  };
  
  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    return method.split("_").map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };
  
  // Calculate subtotal (before discount)
  const subtotal = order.orderItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/${storeId}/orders`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to orders
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={order.createdAt?.toISOString() || ""}>
              {format(new Date(order.createdAt!), "MMMM d, yyyy 'at' h:mm a")}
            </time>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Badge 
            className={`text-sm px-3 py-1 ${getStatusBadge(order.status).bgColor} ${getStatusBadge(order.status).color}`}
          >
            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
          </Badge>
          
          <Badge 
            className={`text-sm px-3 py-1 ${getPaymentStatusBadge(order.paymentStatus).bgColor} ${getPaymentStatusBadge(order.paymentStatus).color}`}
          >
            {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Order Items</span>
              </CardTitle>
              <CardDescription>
                {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""} in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted">
                              {item.product.images && item.product.images[0] ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>
                            <div>
                              <Link 
                                href={`/admin/${storeId}/products/${item.product.id}`}
                                className="font-medium hover:underline"
                              >
                                {item.product.name}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${parseFloat(item.price.toString()).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Discount
                      {order.coupon && (
                        <span className="ml-1 text-sm">
                          (Code: {order.coupon.code})
                        </span>
                      )}
                    </span>
                    <span className="text-red-600">-${order.discountAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg pt-1">
                  <span>Total</span>
                  <span>${parseFloat(order.total.toString()).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Order and Customer Information */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Customer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Link
                    href={`/admin/${storeId}/customers/${order.customer.id}`}
                    className="font-medium hover:underline"
                  >
                    {order.customer.firstName && order.customer.lastName 
                      ? `${order.customer.firstName} ${order.customer.lastName}`
                      : "Unnamed Customer"}
                  </Link>
                </div>
                
                <div>
                  <a href={`mailto:${order.customer.email}`} className="text-muted-foreground hover:text-foreground">
                    {order.customer.email}
                  </a>
                </div>
                
                {order.customer.phone && (
                  <div>
                    <a href={`tel:${order.customer.phone}`} className="text-muted-foreground hover:text-foreground">
                      {order.customer.phone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.address ? (
                <div className="whitespace-pre-line">
                  {order.address}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No shipping address provided
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Payment Method</div>
                <div>{formatPaymentMethod(order.paymentMethod)}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Payment Status</div>
                <Badge 
                  className={`${getPaymentStatusBadge(order.paymentStatus).bgColor} ${getPaymentStatusBadge(order.paymentStatus).color}`}
                >
                  {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 