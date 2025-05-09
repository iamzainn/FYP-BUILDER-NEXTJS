/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type NotificationItem = {
  id: number;
  title: string;
  content: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  data?: string;
};

interface NotificationsTableProps {
  data: NotificationItem[];
  loading: boolean;
  onReadClick: (id: number) => void;
}

export function NotificationsTable({ data, loading, onReadClick }: NotificationsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<NotificationItem>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "content",
      header: "Message",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        let variant;
        
        switch (type) {
          case "ORDER_PLACED":
            variant = "default";
            break;
          case "PAYMENT_RECEIVED":
            variant = "success";
            break;
          case "LOW_STOCK":
            variant = "warning";
            break;
          case "SYSTEM_ALERT":
            variant = "destructive";
            break;
          case "PRODUCT_CREATED":
            variant = "secondary";
            break;
          default:
            variant = "outline";
        }
        
        return <Badge variant={variant as any}>{type}</Badge>;
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        let variant;
        
        switch (priority) {
          case "HIGH":
            variant = "destructive";
            break;
          case "MEDIUM":
            variant = "warning";
            break;
          case "LOW":
            variant = "secondary";
            break;
          default:
            variant = "outline";
        }
        
        return <Badge variant={variant as any}>{priority}</Badge>;
      },
    },
    {
      accessorKey: "isRead",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.getValue("isRead") as boolean;
        return (
          <Badge variant={isRead ? "outline" : "default"}>
            {isRead ? "Read" : "Unread"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReadClick(notification.id)}
            disabled={notification.isRead}
          >
            {notification.isRead ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading notifications...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.original.isRead ? "read" : "unread"}
                  className={!row.original.isRead ? "bg-muted/20 font-medium" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No notifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} notification(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
