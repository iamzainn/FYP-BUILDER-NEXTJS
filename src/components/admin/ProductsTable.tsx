"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import { Search, Pencil, PackageOpen, PlusCircle } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

interface ProductImage {
  id: number;
  url: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stockLevel: number;
  isActive: boolean;
  category?: Category | null;
  images?: ProductImage[];
}

interface ProductsTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  storeId: string;
}

export default function ProductsTable({ 
  products, 
  totalPages, 
  currentPage, 
  storeId 
}: ProductsTableProps) {
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
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-muted/30 rounded-full p-3 mb-2">
                      <PackageOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      {searchParams.get("query") 
                        ? `No products match "${searchParams.get("query")}". Try a different search term.` 
                        : "Add your first product to start selling in your store."}
                    </p>
                    {!searchParams.get("query") && (
                      <Button asChild className="mt-4">
                        <Link href={`/admin/${storeId}/products/new`}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add your first product
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images && product.images[0] ? (
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No img</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/admin/${storeId}/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {product.category?.name || "Uncategorized"}
                </TableCell>
                <TableCell className="text-right">
                  ${parseFloat(product.price.toString()).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {product.stockLevel}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={product.isActive ? "default" : "outline"}
                    className={product.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-1">
                    <Link href={`/admin/${storeId}/products/${product.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteProductButton 
                      productId={product.id} 
                      productName={product.name} 
                      storeId={storeId} 
                    />
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
            <PaginationItem>
              <PaginationPrevious 
                href={`/admin/${storeId}/products?page=${Math.max(1, currentPage - 1)}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}`}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href={`/admin/${storeId}/products?page=${index + 1}${searchParams.get("query") ? `&query=${searchParams.get("query")}` : ""}`}
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
