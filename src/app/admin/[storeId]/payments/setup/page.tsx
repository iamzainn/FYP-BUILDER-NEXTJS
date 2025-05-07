import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import PaymentGatewayForm from "@/components/admin/PaymentGatewayForm";
import { getPaymentGateway } from "@/actions/payment";

interface SetupPaymentPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function SetupPaymentPage({ params }: SetupPaymentPageProps) {
  "use server";
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Check if payment gateway already exists
  const existingGateway = await getPaymentGateway(storeId);
  
  // If there's already a payment gateway configured, redirect to edit page
  if (existingGateway) {
    redirect(`/admin/${storeId}/payments/edit`);
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Set Up Payment Gateway</h1>
        <p className="text-muted-foreground mt-2">
          Configure Square as your payment processor
        </p>
      </div>
      
      <PaymentGatewayForm storeId={storeId} />
    </div>
  );
} 