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
import { Search, Eye, Star, BookmarkCheck, MessageSquare } from "lucide-react";

interface Customer {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface Feedback {
  id: number;
  feedback: string;
  rating: number | null;
  isRead: boolean;
  isImportant: boolean;
  createdAt: Date | null;
  customer: Customer;
}

interface FeedbackTableProps {
  feedback: Feedback[];
  totalPages: number;
  currentPage: number;
  storeId: string;
  isReadFilter: string;
  isImportantFilter: string;
  customerId?: string;
}

export default function FeedbackTable({ 
  feedback, 
  totalPages, 
  currentPage, 
  storeId,
  isReadFilter,
  isImportantFilter,
  customerId
}: FeedbackTableProps) {
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
    router.push(`/admin/${storeId}/feedback?${params.toString()}`);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleReadFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("isRead");
    } else {
      params.set("isRead", value);
    }
    params.set("page", "1");
    router.push(`/admin/${storeId}/feedback?${params.toString()}`);
  };
  
  const handleImportantFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("isImportant");
    } else {
      params.set("isImportant", value);
    }
    params.set("page", "1");
    router.push(`/admin/${storeId}/feedback?${params.toString()}`);
  };
  
  // Function to render star rating
  const renderRating = (rating: number | null) => {
    if (!rating) return "Not rated";
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star 
            key={index}
            className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };
  
  // Function to format date
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  // Function to create pagination URL with all current params
  const createPaginationUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/admin/${storeId}/feedback?${params.toString()}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Input
            placeholder="Search feedback..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex space-x-2">
          <div className="min-w-36">
            <Select
              value={isReadFilter}
              onValueChange={handleReadFilterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Read status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Read</SelectItem>
                <SelectItem value="false">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="min-w-36">
            <Select
              value={isImportantFilter}
              onValueChange={handleImportantFilterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Important</SelectItem>
                <SelectItem value="false">Not Important</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-muted/30 rounded-full p-3 mb-2">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No feedback found</h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      {searchParams.get("query") 
                        ? `No feedback matches "${searchParams.get("query")}". Try a different search term.` 
                        : searchParams.get("isRead") || searchParams.get("isImportant")
                        ? "No feedback matches your current filters."
                        : customerId
                        ? "This customer hasn't left any feedback yet."
                        : "Feedback will appear here when customers leave reviews."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {feedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link 
                    href={`/admin/${storeId}/customers/${item.customer.id}`}
                    className="hover:underline"
                  >
                    {item.customer.firstName && item.customer.lastName 
                      ? `${item.customer.firstName} ${item.customer.lastName}`
                      : item.customer.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="max-w-md truncate">
                    {item.feedback}
                  </div>
                </TableCell>
                <TableCell>
                  {renderRating(item.rating)}
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {item.createdAt ? formatDate(item.createdAt) : "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    {!item.isRead ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        New
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-100">
                        Read
                      </Badge>
                    )}
                    
                    {item.isImportant && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Important
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title={item.isRead ? "Mark as unread" : "Mark as read"}
                      // In a real app, this would call a server action to toggle read status
                      onClick={() => {
                        // This would be implemented with a server action
                        alert(`Toggling read status for feedback #${item.id}`);
                      }}
                    >
                      <Eye className={`h-4 w-4 ${!item.isRead ? "text-blue-500" : ""}`} />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title={item.isImportant ? "Remove importance" : "Mark as important"}
                      // In a real app, this would call a server action to toggle importance
                      onClick={() => {
                        // This would be implemented with a server action
                        alert(`Toggling importance for feedback #${item.id}`);
                      }}
                    >
                      <BookmarkCheck className={`h-4 w-4 ${item.isImportant ? "text-yellow-500" : ""}`} />
                    </Button>
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