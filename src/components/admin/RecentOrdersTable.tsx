"use client";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ShoppingBag } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
  };
}

export interface Order {

  id: number;
  orderNumber: string;
  
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date | string | null;
  customer: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    storeId: number;
    address: string | null;
    phone: string | null;
  };
  store: {
    storeId: string;
  };
  orderItems: OrderItem[];
  paymentMethod: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-52 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-muted/30 rounded-full p-3 mb-2">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Orders will appear here when customers make purchases.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link 
                  href={`/admin/${order.store.storeId}/orders/${order.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  #{order.orderNumber}
                </Link>
              </TableCell>
              <TableCell>{order.customer.firstName} {order.customer.lastName}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {order.createdAt ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface OrderStatusBadgeProps {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };
  
  return (
    <Badge className={`${statusStyles[status]} border`} variant="outline">
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
