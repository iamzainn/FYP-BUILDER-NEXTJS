import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
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
    
    // Parse the request body
    const body = await request.json();
    console.log("Creating pages with data:", body);
    
    // Extract data from request body
    const { storeId, pages } = body;
    
    if (!storeId || !pages || !Array.isArray(pages)) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }
    
    // Find the store
    const store = await prisma.userStore.findUnique({
      where: {
        id: storeId,
      },
    });
    
    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }
    
    // Create pages and components
    const createdPages = [];
    
    for (const pageData of pages) {
      const { title, slug, pageType, isPublished = true, pageOrder = 0, components } = pageData;
      
      const page = await prisma.page.create({
        data: {
          title,
          slug,
          pageType,
          isPublished,
          pageOrder,
          storeId: store.id,
          components: {
            create: components.map((component: any, index: number) => ({
              componentType: component.type,
              content: component.content,
              order: component.order || index
            }))
          }
        },
        include: {
          components: true
        }
      });
      
      createdPages.push(page);
    }
    
    return NextResponse.json({
      message: 'Pages created successfully',
      pages: createdPages
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create pages error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
} 