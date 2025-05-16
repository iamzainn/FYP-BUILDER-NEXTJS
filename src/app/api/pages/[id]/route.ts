/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface ComponentContent {
  items?: any[];
  styles?: Record<string, any>;
  columns?: any[];
  socialLinks?: any[];
  [key: string]: any;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 14/15, we must await params directly before destructuring
    const params = await context.params;
    const { id } = params;
    
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
    
    // Parse the ID to an integer
    const pageId = parseInt(id);
    
    if (isNaN(pageId)) {
      return NextResponse.json({ message: "Invalid page ID" }, { status: 400 });
    }
    
    // Fetch the page with components
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        components: {
          orderBy: { order: 'asc' }
        },
        store: true
      }
    });
    
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }
    
    // Verify the user has access to this page (through store ownership)
    const userStore = await prisma.userStore.findFirst({
      where: {
        id: page.storeId,
        userId: dbUser.id
      }
    });
    
    if (!userStore) {
      return NextResponse.json({ message: "You don't have access to this page" }, { status: 403 });
    }
    
    // Process the components to structure them for the frontend
    const processedComponents = page.components.reduce((acc, component) => {
      const { id, componentType, content } = component;
      const jsonContent = content as ComponentContent;
      
      // Use componentType as the key (lowercase)
      const key = componentType.toLowerCase();
      
      // Different component types require different structures
      switch (componentType) {
        case 'NAVBAR':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'HERO':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'COLLECTION':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'PRODUCT':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'FOOTER':
          acc[key] = {
            componentId: id,
            columns: jsonContent?.columns || [],
            socialLinks: jsonContent?.socialLinks || [],
            styles: jsonContent?.styles || {}
          };
          break;
        default:
          acc[key] = {
            componentId: id,
            ...jsonContent
          };
      }
      
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      id: page.id,
      title: page.title,
      slug: page.slug,
      pageType: page.pageType,
      isPublished: page.isPublished,
      components: processedComponents
    });
    
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 14/15, we must await params directly before destructuring
    const params = await context.params;
    const { id } = params;
    
    console.log('PATCH request received for page ID:', id);
    
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
    
    // Parse the ID to an integer
    const pageId = parseInt(id);
    
    if (isNaN(pageId)) {
      return NextResponse.json({ message: "Invalid page ID" }, { status: 400 });
    }
    
    // Fetch the page to check ownership
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        store: true,
        components: true
      }
    });
    
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }
    
    // Verify the user has access to this page (through store ownership)
    const userStore = await prisma.userStore.findFirst({
      where: {
        id: page.storeId,
        userId: dbUser.id
      }
    });
    
    if (!userStore) {
      return NextResponse.json({ message: "You don't have access to this page" }, { status: 403 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { componentUpdates } = body;
    
    if (!componentUpdates || !Array.isArray(componentUpdates)) {
      return NextResponse.json({ message: "Invalid request. Expected componentUpdates array." }, { status: 400 });
    }
    
    // DEBUG: Log the component updates being received
    console.log('Component updates received:', JSON.stringify(componentUpdates, null, 2));
    
    // Process updates for each component
    const updates = [];
    
    for (const update of componentUpdates) {
      const { componentType, content } = update;
      
      if (!componentType || !content) {
        continue; // Skip invalid entries
      }
      
      // DEBUG: Log each component update
      console.log(`Processing update for component type: ${componentType}`);
      
      // Try to find the existing component
      const existingComponent = page.components.find(
        comp => comp.componentType === componentType.toUpperCase()
      );
      
      if (existingComponent) {
        // Update existing component
        console.log(`Updating existing component ID: ${existingComponent.id}`);
        
        // DEBUG: Log the content being saved for the component
        console.log('Content being saved:', JSON.stringify(content, null, 2));
        
        updates.push(
          prisma.pageComponent.update({
            where: { id: existingComponent.id },
            data: { content }
          })
        );
      } else {
        // Create new component
        // Find the highest order to place the new component at the end
        const maxOrder = page.components.reduce(
          (max, comp) => Math.max(max, comp.order), 
          0
        );
        
        console.log(`Creating new component of type: ${componentType}`);
        
        updates.push(
          prisma.pageComponent.create({
            data: {
              pageId,
              componentType: componentType.toUpperCase(),
              content,
              order: maxOrder + 1
            }
          })
        );
      }
    }
    
    // Execute all updates in a transaction
    console.log(`Executing ${updates.length} database updates`);
    await prisma.$transaction(updates);
    console.log('Database transaction completed successfully');
    
    // Fetch the updated page with components
    const updatedPage = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        components: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!updatedPage) {
      return NextResponse.json({ message: "Failed to retrieve updated page" }, { status: 500 });
    }
    
    // Process the components for the response
    const processedComponents = updatedPage.components.reduce((acc, component) => {
      const { id, componentType, content } = component;
      const jsonContent = content as ComponentContent;
      
      // Use componentType as the key (lowercase)
      const key = componentType.toLowerCase();
      
      // Different component types require different structures
      switch (componentType) {
        case 'NAVBAR':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'HERO':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'COLLECTION':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'PRODUCT':
          acc[key] = {
            componentId: id,
            items: jsonContent?.items || [],
            styles: jsonContent?.styles || {}
          };
          break;
        case 'FOOTER':
          acc[key] = {
            componentId: id,
            columns: jsonContent?.columns || [],
            socialLinks: jsonContent?.socialLinks || [],
            styles: jsonContent?.styles || {}
          };
          break;
        default:
          acc[key] = {
            componentId: id,
            ...jsonContent
          };
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json({
      id: updatedPage.id,
      title: updatedPage.title,
      slug: updatedPage.slug,
      pageType: updatedPage.pageType,
      isPublished: updatedPage.isPublished,
      components: processedComponents
    });
    
  } catch (error: any) {
    console.error('Error updating page components:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
} 