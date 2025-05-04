"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { deleteStore } from "@/actions/store";

interface DeleteStoreButtonProps {
  storeId: string;
}

export default function DeleteStoreButton({ storeId }: DeleteStoreButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const onDelete = async () => {
    setIsLoading(true);
    
    try {
      // Note: This will redirect to the dashboard if successful
      const response = await deleteStore(storeId);
      
      if (!response.success) {
        toast.error(response.error || "Failed to delete store");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash className="h-4 w-4 mr-2" />
          Delete Store
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your 
            store and all associated data including products, categories, 
            customers, and orders.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Store"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 