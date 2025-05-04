"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { updateStoreName } from "@/actions/store";
import { StoreFormValues, storeFormSchema } from "@/schemas/store";

interface StoreNameFormProps {
  storeId: string;
  initialName: string;
}

export default function StoreNameForm({ storeId, initialName: propInitialName }: StoreNameFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Track the current name in component state so we can update it after a successful save
  const [currentName, setCurrentName] = useState(propInitialName);
  
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: propInitialName || "",
    },
  });
  
  const onSubmit = async (values: StoreFormValues) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      
      const response = await updateStoreName(storeId, formData);
      
      if (response.success) {
        toast.success("Store name updated successfully");
        // Update our local state with the new name
        setCurrentName(values.name);
      } else {
        toast.error(response.error || "Failed to update store name");
        // Reset form if there was an error
        form.reset({ name: currentName });
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      // Reset form on error
      form.reset({ name: currentName });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentValue = form.getValues().name;
  const isUnchanged = currentValue === currentName;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isLoading || isUnchanged}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
} 