import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import PaymentGatewayForm from "@/components/admin/PaymentGatewayForm";
import { getPaymentGateway } from "@/actions/payment";

interface EditPaymentPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  "use server";
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Get existing payment gateway
  const existingGateway = await getPaymentGateway(storeId);
  
  // If there's no payment gateway configured, redirect to setup page
  if (!existingGateway) {
    redirect(`/admin/${storeId}/payments/setup`);
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Payment Gateway</h1>
        <p className="text-muted-foreground mt-2">
          Update your Square payment processor configuration
        </p>
      </div>
      
      <PaymentGatewayForm storeId={storeId} existingGateway={existingGateway} />
    </div>
  );
} 