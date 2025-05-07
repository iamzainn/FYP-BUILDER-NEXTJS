"use client";

import { useEffect, useState } from "react";
import { getDiscountCustomerUsage } from "@/actions/discount";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerUsage {
  id: number;
  customerId: number;
  usageCount: number;
  customer: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface CustomerUsageListProps {
  discountId: number;
  storeId: string;
}

export function CustomerUsageList({ discountId}: CustomerUsageListProps) {
  const [customerUsage, setCustomerUsage] = useState<CustomerUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomerUsage() {
      try {
        const data = await getDiscountCustomerUsage(discountId);
        setCustomerUsage(data);
      } catch (error) {
        console.error("Error loading customer usage data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerUsage();
  }, [discountId]);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Customer Usage</h3>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (customerUsage.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground">No customer usage data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Customer Usage</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Usage Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerUsage.map((usage) => (
            <TableRow key={usage.id}>
              <TableCell>
                {usage.customer.firstName} {usage.customer.lastName}
              </TableCell>
              <TableCell>{usage.customer.email}</TableCell>
              <TableCell>{usage.usageCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 