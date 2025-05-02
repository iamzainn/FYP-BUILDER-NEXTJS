import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk using currentUser
    const user = await currentUser();
    
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Find the user in the database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id
      }
    });
    
    if (!dbUser) {
      return NextResponse.json({ message: "User not found in database" }, { status: 404 });
    }
    
    // Use the database user ID
    const userID = dbUser.id;
    
    // Parse the request body
    const body = await request.json();
    console.log('Request to create website from user:', userID, 'with data:', body);
    
    // Extract data from request body - handle both name and storeName formats
    const name = body.name || body.storeName;
    
    // Extract storeConfig for later saving if needed
    const storeConfig = body.storeConfig;
    
    // Validate input
    if (!name) {
      return NextResponse.json({ message: 'Please provide a store name' }, { status: 400 });
    }
    
    // Check if store name already exists for this user using Prisma
    const existingStore = await prisma.userStore.findFirst({
      where: {
        userId: userID,
        storeName: name
      }
    });
    
    if (existingStore) {
      return NextResponse.json({ message: 'You already have a store with this name' }, { status: 400 });
    }
    
    // Generate a unique store ID
    const storeId = uuidv4();
    
    // Create new store with Prisma
    const newStore = await prisma.userStore.create({
      data: {
        userId: userID,
        storeName: name,
        storeId: storeId,
        store_config: storeConfig || undefined
      }
    });
    
    console.log('Successfully created store:', newStore);
    
    return NextResponse.json({
      message: 'Store created successfully',
      store: newStore
    }, { status: 201 });
    
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Create store error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
} 