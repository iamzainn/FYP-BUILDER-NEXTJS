import prisma from "./prisma";

export async function getUserDbId(clerkUserId: string) {
  const userId = await prisma.user.findUnique({
    where: {
      clerkId: clerkUserId,
    },
    select: {
      id: true,
    },
  }) as { id: number };
  return userId;
}


export async function getUserStore(userId: number) {
    const userStore = await prisma.userStore.findMany({
      where: {
        userId: userId
      }
    });
    return userStore;
  }



  export function generateSubdomain(storeName: string): string {
    // Convert to lowercase
    let subdomain = storeName.toLowerCase();
    
    // Remove special characters and spaces
    subdomain = subdomain.replace(/[^a-z0-9]/g, '');
    
    // Ensure it's not empty (fallback to a default if needed)
    if (!subdomain) {
      subdomain = 'store' + Math.floor(Math.random() * 10000);
    }
    
    return subdomain;
  }