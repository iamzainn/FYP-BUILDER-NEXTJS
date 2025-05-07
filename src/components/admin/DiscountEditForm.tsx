"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2, Zap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import * as z from "zod";
import { discountFormSchema } from "@/schemas/discount";
import { updateDiscount } from "@/actions/discount";
import { useRouter } from "next/navigation";

// Explicitly define the type from our schema
type FormValues = z.infer<typeof discountFormSchema>;

// Define the discount data structure
interface DiscountData {
  id: number;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number | null;
  perCustomerServing: boolean;
  maxUsesPerCustomer: number | null;
  applicableProducts: number[];
}

interface DiscountEditFormProps {
  storeId: string;
  discount: DiscountData;
  products: { id: number; name: string }[];
}

export default function DiscountEditForm({ storeId, discount, products }: DiscountEditFormProps) {
  const [pending, setPending] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>(discount.applicableProducts || []);
  const router = useRouter();
  
  // Use explicit typing for form
  const form = useForm<FormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      couponCode: discount.couponCode,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      startDate: new Date(discount.startDate),
      endDate: new Date(discount.endDate),
      isActive: discount.isActive,
      usageLimit: discount.usageLimit,
      perCustomerServing: discount.perCustomerServing,
      maxUsesPerCustomer: discount.maxUsesPerCustomer,
      applicableProducts: discount.applicableProducts,
      isProductBased: discount.applicableProducts.length > 0,
    }
  });
  
  const isProductBased = form.watch("isProductBased");
  const perCustomerServing = form.watch("perCustomerServing");
  const discountType = form.watch("discountType");
  
  // Update applicableProducts when selectedProducts change
  useEffect(() => {
    if (isProductBased) {
      form.setValue("applicableProducts", selectedProducts);
    } else {
      form.setValue("applicableProducts", []);
    }
  }, [selectedProducts, isProductBased, form]);
  
  // Generate random coupon code
  const generateRandomCoupon = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    form.setValue("couponCode", result);
  };
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setPending(true);
    
    try {
      // Convert form data to FormData for server action
      const formData = new FormData();
      formData.append("storeId", storeId);
      formData.append("discountId", discount.id.toString());
      formData.append("couponCode", data.couponCode);
      formData.append("discountType", data.discountType);
      formData.append("discountValue", data.discountValue.toString());
      formData.append("startDate", data.startDate.toISOString());
      formData.append("endDate", data.endDate.toISOString());
      formData.append("isActive", data.isActive.toString());
      
      if (data.usageLimit !== null) {
        formData.append("usageLimit", data.usageLimit!.toString());
      }
      
      formData.append("perCustomerServing", data.perCustomerServing.toString());
      
      if (data.maxUsesPerCustomer !== null) {
        formData.append("maxUsesPerCustomer", data.maxUsesPerCustomer!.toString());
      }
      
      formData.append("applicableProducts", JSON.stringify(data.applicableProducts));
      
      // Call server action
      await updateDiscount(formData);
      
      toast.success("Discount updated successfully!");
      router.push(`/admin/${storeId}/discounts`);
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error("Failed to update discount");
    } finally {
      setPending(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Discount details */}
          <div className="space-y-6">
            {/* Hidden field for storeId to use with server action later */}
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="discountId" value={discount.id.toString()} />
            
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code <span className="text-red-500">*</span></FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input placeholder="Enter coupon code" {...field} />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={generateRandomCoupon}
                      title="Generate random coupon code"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Unique code customers will use (max 50 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Discount Type <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="PERCENTAGE" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Percentage (%)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="FIXED_AMOUNT" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fixed Amount ($)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {discountType === "PERCENTAGE" ? "Discount Percentage" : "Discount Amount"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0} 
                      step={discountType === "PERCENTAGE" ? 1 : 0.01}
                      placeholder={discountType === "PERCENTAGE" ? "10" : "5.00"}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {discountType === "PERCENTAGE" 
                      ? "Enter percentage off (e.g., 10 for 10% off)" 
                      : "Enter fixed discount amount (e.g., 5.00 for $5 off)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date <span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this discount
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Right column - Usage limitations and product selection */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="No limit"
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : parseInt(value, 10));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of times this discount can be used (leave empty for unlimited)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="perCustomerServing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Per-Customer Limit</FormLabel>
                    <FormDescription>
                      Limit discount usage per customer
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {perCustomerServing && (
              <FormField
                control={form.control}
                name="maxUsesPerCustomer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses Per Customer</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="1" 
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of times a customer can use this discount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="isProductBased"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Product-Specific Discount</FormLabel>
                    <FormDescription>
                      Apply discount to specific products only
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isProductBased && products.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <FormLabel className="mb-2 block">Select Products</FormLabel>
                  <ScrollArea className="h-72 rounded-md border">
                    <div className="p-4 space-y-2">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`product-${product.id}`} 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedProducts(prev => [...prev, product.id]);
                              } else {
                                setSelectedProducts(prev => prev.filter(id => id !== product.id));
                              }
                            }}
                          />
                          <label 
                            htmlFor={`product-${product.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {product.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {selectedProducts.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedProducts.length} products selected
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/${storeId}/discounts`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Discount
          </Button>
        </div>
      </form>
    </Form>
  );
} 