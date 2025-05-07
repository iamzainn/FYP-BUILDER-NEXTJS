"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Edit, PlusCircle, Search, Trash } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
  } from "@/components/ui/pagination";
import { CustomerUsageList } from "./CustomerUsageList";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

  
  import { Input } from "../ui/input";
import { deleteDiscount } from "@/actions/discount";

interface Discount {
  id: number;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number | null;
  usageCount: number;
  perCustomerServing: boolean;
  maxUsesPerCustomer: number | null;
  
}

interface DiscountsTableProps {
  discounts: Discount[];
  totalPages: number;
  currentPage: number;
  storeId: string;
}

export default function DiscountsTable({
  discounts,
  totalPages,
  currentPage,
  storeId,
}: DiscountsTableProps) {
  const [expandedDiscountId, setExpandedDiscountId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
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
    router.push(`/admin/${storeId}/products?${params.toString()}`);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleExpandClick = (discountId: number) => {
    if (expandedDiscountId === discountId) {
      setExpandedDiscountId(null);
    } else {
      setExpandedDiscountId(discountId);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      setLoading(true);
      await deleteDiscount(id);
      toast.success("Discount deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete discount");
    } finally {
      setLoading(false);
    }
  };

  if (discounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 bg-background p-10 text-center border rounded-md">
        <p className="text-lg font-medium">No discounts found</p>
        <p className="text-muted-foreground">Create your first discount to get started.</p>
        <Link href={`/admin/${storeId}/discounts/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          placeholder="Search products..."
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
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <React.Fragment key={discount.id}>
                <TableRow>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleExpandClick(discount.id)}
                    >
                      {expandedDiscountId === discount.id ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{discount.couponCode}</TableCell>
                  <TableCell>
                    {discount.discountType === "PERCENTAGE" 
                      ? `${discount.discountValue}%` 
                      : `$${discount.discountValue.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {format(new Date(discount.startDate), "MMM d, yyyy")} - 
                    {format(new Date(discount.endDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {discount.usageCount} / {discount.usageLimit ?? "∞"}
                    {discount.perCustomerServing && 
                      <div className="text-xs text-muted-foreground">
                        Max {discount.maxUsesPerCustomer} per customer
                      </div>
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={discount.isActive ? "default" : "secondary"}>
                      {discount.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/${storeId}/discounts/${discount.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteDiscount(discount.id)}
                        disabled={loading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedDiscountId === discount.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/20 p-4">
                      <CustomerUsageList discountId={discount.id} storeId={storeId} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={`/admin/${storeId}/discounts?page=${Math.max(1, currentPage - 1)}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}`}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href={`/admin/${storeId}/discounts?page=${index + 1}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}`}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href={`/admin/${storeId}/products?page=${Math.min(totalPages, currentPage + 1)}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}`}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
