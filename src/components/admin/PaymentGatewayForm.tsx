"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { PaymentGatewayFormValues, paymentGatewaySchema } from "@/schemas/payment";
import { savePaymentGateway } from "@/actions/payment";

interface PaymentGatewayFormProps {
  storeId: string;
  existingGateway?: {
    id: number;
    provider: string;
    accessToken: string;
    applicationId?: string | null;
    locationId?: string | null;
    environment: string;
    isActive: boolean;
  } | null;
}

export default function PaymentGatewayForm({ storeId, existingGateway }: PaymentGatewayFormProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  
  // Configure form with explicit type
  const form = useForm<PaymentGatewayFormValues>({
    resolver: zodResolver(paymentGatewaySchema),
    defaultValues: {
      provider: "SQUARE",
      accessToken: existingGateway?.accessToken || "",
      applicationId: existingGateway?.applicationId || "",
      locationId: existingGateway?.locationId || "",
      environment: (existingGateway?.environment as "sandbox" | "production") || "sandbox",
      isActive: existingGateway?.isActive ?? true,
    },
  });
  
  const onSubmit = async (data: PaymentGatewayFormValues) => {
    setPending(true);
    
    try {
      const formData = new FormData();
      formData.append("storeId", storeId);
      formData.append("provider", data.provider);
      formData.append("accessToken", data.accessToken);
      formData.append("applicationId", data.applicationId);
      formData.append("locationId", data.locationId);
      formData.append("environment", data.environment);
      formData.append("isActive", data.isActive.toString());
      
      await savePaymentGateway(formData);
      
      toast.success("Payment gateway settings saved successfully");
      router.push(`/admin/${storeId}/payments`);
    } catch (error) {
      console.error("Error saving payment gateway:", error);
      toast.error("Failed to save payment gateway settings");
    } finally {
      setPending(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Hidden field for storeId */}
        <input type="hidden" name="storeId" value={storeId} />
        
        <Card>
          <CardHeader>
            <CardTitle>Square Payment Gateway</CardTitle>
            <CardDescription>
              Configure Square as your payment processor. You&apos;ll need credentials from your 
              Square Developer account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                For your store to process payments, you need to set up your Square account and get the 
                required credentials. Visit the{" "}
                <Link 
                  href="https://developer.squareup.com/apps" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Square Developer Dashboard <ExternalLink className="h-3 w-3 inline" />
                </Link>{" "}
                to create or manage your application.
              </AlertDescription>
            </Alert>
            
            <Separator />
            
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Environment</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sandbox" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Sandbox (Testing)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="production" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Production (Live)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Use sandbox for testing and development. Switch to production when your store is ready to accept real payments.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Token <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="sq0atp-..." 
                      type="password"
                    />
                  </FormControl>
                  <FormDescription>
                    Your Square API access token. Find this in the Square Developer Dashboard under Credentials.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="applicationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application ID <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="sq0idp-..." 
                    />
                  </FormControl>
                  <FormDescription>
                    Your Square application ID. Find this in the Square Developer Dashboard under Application ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location ID <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="L..." 
                    />
                  </FormControl>
                  <FormDescription>
                    Your Square location ID where payments will be processed. Find this in the Square Developer Dashboard under Locations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Square Payments</FormLabel>
                    <FormDescription>
                      When enabled, your store will use Square to process payments.
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
            
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push(`/admin/${storeId}/payments`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingGateway ? "Update Configuration" : "Save Configuration"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
} 