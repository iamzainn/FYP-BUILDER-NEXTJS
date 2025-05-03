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