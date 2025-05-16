import prisma from "@/lib/prisma";
import FeedbackTable from "@/components/admin/FeedbackTable";

interface FeedbackPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ 
    page?: string; 
    query?: string; 
    isRead?: string;
    isImportant?: string;
    customerId?: string;
  }>;
}

async function getFeedback(
  storeId: string,
  page = 1,
  pageSize = 10,
  searchQuery?: string,
  isRead?: string,
  isImportant?: string,
  customerId?: string
) {
  const skip = (page - 1) * pageSize;
  
  // Build the where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    store: { storeId },
  };
  
  // Add search query if provided
  if (searchQuery) {
    where.OR = [
      { feedback: { contains: searchQuery } },
      { customer: { 
        OR: [
          { email: { contains: searchQuery } },
          { firstName: { contains: searchQuery } },
          { lastName: { contains: searchQuery } },
        ] 
      }},
    ];
  }
  
  // Add isRead filter if provided
  if (isRead === "true" || isRead === "false") {
    where.isRead = isRead === "true";
  }
  
  // Add isImportant filter if provided
  if (isImportant === "true" || isImportant === "false") {
    where.isImportant = isImportant === "true";
  }
  
  // Add customer filter if provided
  if (customerId) {
    where.customerId = parseInt(customerId);
  }
  
  // Get feedback entries
  const feedback = await prisma.customerFeedback.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
  });
  
  // Get total count for pagination
  const totalCount = await prisma.customerFeedback.count({ where });
  
  return {
    feedback,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export default async function FeedbackPage({ params, searchParams }: FeedbackPageProps) {
  'use server';
  
  // Await the params to avoid Next.js warning
  const { storeId } = await params;
  const sp = await searchParams;
  
  const page = sp?.page ? parseInt(sp.page) : 1;
  const { feedback, totalCount, totalPages } = await getFeedback(
    storeId,
    page,
    10,
    sp?.query,
    sp?.isRead,
    sp?.isImportant,
    sp?.customerId
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Feedback</h1>
          <p className="text-muted-foreground">
            Review feedback from your customers ({totalCount} total)
          </p>
        </div>
      </div>
      
      <FeedbackTable 
        feedback={feedback} 
        totalPages={totalPages} 
        currentPage={page} 
        storeId={storeId}
        isReadFilter={sp?.isRead || "all"}
        isImportantFilter={sp?.isImportant || "all"}
        customerId={sp?.customerId}
      />
    </div>
  );
} 