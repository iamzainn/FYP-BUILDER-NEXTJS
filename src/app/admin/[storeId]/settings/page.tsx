import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { getStore } from "@/actions/store";
import StoreNameForm from "@/components/admin/settings/StoreNameForm";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DeleteStoreButton from "@/components/admin/settings/DeleteStoreButton";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { storeId } = await params;
  console.log("storeId", storeId);
  let store;
  try {
    store = await getStore(storeId);
    console.log("store", store);
  } catch (error) {
    console.error("Error fetching store data:", error);
    // Redirect to dashboard if store is not found
    redirect("/dashboard");
  }

  if (!store) {
    redirect("/dashboard");
  }

  // Base production URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_PRODUCTION_DOMAIN ;
  
  // Format the store URL as a subdomain of the production URL
  const storeUrl = `https://${store.subdomain}.${baseUrl}`;

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Store Settings" 
        description="Manage your store settings"
      />

      <Separator />
      
      <div className="grid gap-6">
        {/* Store Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Store Details</CardTitle>
            <CardDescription>
              View and update your store information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Store Name Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Store Name</h3>
              <StoreNameForm 
                storeId={storeId} 
                initialName={store.storeName}
              />
              <p className="text-sm text-muted-foreground">
                Changing your store name will also update your store&apos;s URL.
              </p>
            </div>
            
            <Separator />
            
            {/* Store URL (read-only) */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Store URL</h3>
              <div className="rounded-md border px-4 py-3 bg-muted/50">
                <p className="text-sm font-mono break-all">
                  {storeUrl}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                This is your store&apos;s public URL. Customers will access your store through this subdomain.
                The subdomain is automatically generated from your store name, removing special characters and spaces.
              </p>
            </div>
            
            <Separator />
            
            {/* Store ID (read-only) */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Store ID</h3>
              <div className="rounded-md border px-4 py-3 bg-muted/50">
                <p className="text-sm font-mono break-all">
                  {store.storeId}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your unique store identifier.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone Card */}
        <Card className="border-destructive/20">
          <CardHeader className="text-destructive">
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Deleting your store will permanently remove all associated data including products, 
                categories, customers, and orders. This action cannot be undone.
              </AlertDescription>
            </Alert>
            
            <DeleteStoreButton storeId={storeId} />
          </CardContent>
        </Card>
      </div>
    </div>
    
  );
} 