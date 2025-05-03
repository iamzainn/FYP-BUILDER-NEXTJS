import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ storeId: string }>;
}

async function getStoreById(storeId: string) {
  const store = await prisma.userStore.findFirst({
    where: {
      storeId: storeId,
    },
  });
  return store;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  'use server';
  
  // Await the params to avoid Next.js 15 warning
  const { storeId } = await params;
  
  const { userId: clerkUserId } = await auth();
  
  if (!clerkUserId) {
    redirect("/sign-in");
  }
  
  const store = await getStoreById(storeId);
  
  if (!store) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar storeId={storeId} storeName={store.storeName} />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 md:px-8 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
