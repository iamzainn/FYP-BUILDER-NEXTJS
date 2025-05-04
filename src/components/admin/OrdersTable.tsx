"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, ShoppingCart } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Customer {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date | null;
  customer: Customer;
  orderItems: OrderItem[];
  
}

interface OrdersTableProps {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  storeId: string;
  statusFilter: string;
  customerId?: string;
}

export default function OrdersTable({ 
  orders, 
  totalPages, 
  currentPage, 
  storeId,
  statusFilter,
  customerId
}: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("query", search);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    router.push(`/admin/${storeId}/orders?${params.toString()}`);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.set("page", "1");
    router.push(`/admin/${storeId}/orders?${params.toString()}`);
  };
  
  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "outline" | "secondary" | "destructive"; className: string }> = {
      PENDING: {
        variant: "outline",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      PROCESSING: {
        variant: "default",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      SHIPPED: {
        variant: "secondary",
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      },
      DELIVERED: {
        variant: "default",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      CANCELLED: {
        variant: "destructive",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };
    
    return statusMap[status] || { variant: "outline", className: "" };
  };
  
  // Function to format date
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  // Function to create pagination URL with all current params
  const createPaginationUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/admin/${storeId}/orders?${params.toString()}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Input
            placeholder="Search by order # or customer..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex-1 min-w-[200px]">
          <Select
            value={statusFilter}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-muted/30 rounded-full p-3 mb-2">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      {searchParams.get("query") 
                        ? `No orders match "${searchParams.get("query")}". Try a different search term.` 
                        : searchParams.get("status")
                        ? `No orders with ${searchParams.get("status")?.toLowerCase()} status found.`
                        : customerId
                        ? "This customer has no orders yet."
                        : "Orders will appear here when customers make purchases."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link 
                    href={`/admin/${storeId}/orders/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    #{order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/admin/${storeId}/customers/${order.customer.id}`}
                    className="hover:underline"
                  >
                    {order.customer.firstName && order.customer.lastName 
                      ? `${order.customer.firstName} ${order.customer.lastName}`
                      : order.customer.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${parseFloat(order.total.toString()).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={getStatusBadge(order.status).variant}
                    className={getStatusBadge(order.status).className}
                  >
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-1">
                    <Link href={`/admin/${storeId}/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={createPaginationUrl(currentPage - 1)} />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // Only show 5 pages around the current page for better UX
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={createPaginationUrl(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              
              // Add ellipsis for skipped pages
              if (
                (page === currentPage - 3 && currentPage > 4) ||
                (page === currentPage + 3 && currentPage < totalPages - 3)
              ) {
                return <PaginationItem key={page}>...</PaginationItem>;
              }
              
              return null;
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={createPaginationUrl(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 