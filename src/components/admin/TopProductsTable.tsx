"use client";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  totalOrdered: number;
  category?: Category | null;
  store: {
    storeId: string;
  };
}

interface TopProductsTableProps {
  products: Product[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Sold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-52 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-muted/30 rounded-full p-3 mb-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No products sold yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Products with sales will appear here as your bestsellers.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Link 
                  href={`/admin/${product.store.storeId}/products/${product.id}`}
                  className="font-medium hover:underline"
                >
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
              <TableCell className="text-right">{product.totalOrdered}x</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
