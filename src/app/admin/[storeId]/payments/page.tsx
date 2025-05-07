import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { getPaymentGateway } from "@/actions/payment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideAlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PaymentsPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  "use server";
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Get existing payment gateway for this store
  const paymentGateway = await getPaymentGateway(storeId);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure how your store processes payments
        </p>
      </div>
      
      <Tabs defaultValue="square" className="space-y-4">
        <TabsList>
          <TabsTrigger value="square">Square</TabsTrigger>
          <TabsTrigger value="other" disabled>More Coming Soon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="square" className="space-y-4">
          {paymentGateway ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Square Payment Gateway</CardTitle>
                  <Badge variant={paymentGateway.isActive ? "default" : "secondary"}>
                    {paymentGateway.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  Configured {paymentGateway.environment === "sandbox" ? "in sandbox mode" : "for production"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Application ID</h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {paymentGateway.applicationId || "Not configured"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Location ID</h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {paymentGateway.locationId || "Not configured"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Access Token</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ••••••••••••••••••••••
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Link href={`/admin/${storeId}/payments/edit`}>
                      <Button>
                        Edit Configuration
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Square Payment Gateway</CardTitle>
                <CardDescription>
                  Configure Square as your payment processor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <LucideAlertCircle className="h-4 w-4" />
                  <AlertTitle>Payment gateway not configured</AlertTitle>
                  <AlertDescription>
                    You need to set up your Square payment gateway to accept payments in your store.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end">
                  <Link href={`/admin/${storeId}/payments/setup`}>
                    <Button>
                      Configure Square <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>About Square Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Square is a popular payment processor that allows you to accept credit card payments 
                and other digital payment methods.
              </p>
              
              <Alert>
                <AlertTitle>Testing with Sandbox</AlertTitle>
                <AlertDescription>
                  When testing in sandbox mode, use the following test card: 
                  <code className="bg-muted px-1 py-0.5 rounded ml-1">4111 1111 1111 1111</code> with any future 
                  expiration date, CVV code, and postal code.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Link href="https://developer.squareup.com/docs" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Square Documentation
                </Link>
                <Link href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Square Developer Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 