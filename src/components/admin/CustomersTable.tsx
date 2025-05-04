"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Search, Eye, User, ShoppingBag } from "lucide-react";

interface Order {
  id: number;
}

interface Customer {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  orders: Order[];
}

interface CustomersTableProps {
  customers: Customer[];
  totalPages: number;
  currentPage: number;
  storeId: string;
}

export default function CustomersTable({ 
  customers, 
  totalPages, 
  currentPage, 
  storeId 
}: CustomersTableProps) {
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
    router.push(`/admin/${storeId}/customers?${params.toString()}`);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          placeholder="Search customers by name, email, or phone..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Button type="submit" variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-muted/30 rounded-full p-3 mb-2">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No customers found</h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      {searchParams.get("query") 
                        ? `No customers match "${searchParams.get("query")}". Try a different search term.` 
                        : "Customers will appear here when they make purchases from your store."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Link 
                        href={`/admin/${storeId}/customers/${customer.id}`}
                        className="font-medium hover:underline"
                      >
                        {customer.firstName && customer.lastName 
                          ? `${customer.firstName} ${customer.lastName}`
                          : "Unnamed Customer"}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${customer.email}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {customer.email}
                  </a>
                </TableCell>
                <TableCell>
                  {customer.phone || "—"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Link href={`/admin/${storeId}/orders?customerId=${customer.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <span>{customer.orders.length}</span>
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-1">
                    <Link href={`/admin/${storeId}/customers/${customer.id}`}>
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
                <PaginationPrevious 
                  href={`/admin/${storeId}/customers?page=${currentPage - 1}${
                    searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""
                  }`}
                />
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
                      href={`/admin/${storeId}/customers?page=${page}${
                        searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""
                      }`}
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
                <PaginationNext 
                  href={`/admin/${storeId}/customers?page=${currentPage + 1}${
                    searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""
                  }`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 