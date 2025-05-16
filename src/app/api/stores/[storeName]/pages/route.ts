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
  context: { params: { storeName: string } }
) {
  try {
    // In Next.js 14/15, we must await params directly before destructuring
    const params = await context.params;
    const { storeName } = params;
    
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('slug');
    const pageType = searchParams.get('type');
    
    // Find the store by name or subdomain
    const store = await prisma.userStore.findFirst({
      where: {
        OR: [
          { storeName },
          { subdomain: storeName }
        ],
        userId: dbUser.id
      }
    });
    
    if (!store) {
      return NextResponse.json({ message: "Store not found or you don't have access to it" }, { status: 404 });
    }
    
    // Build the query for pages
    const whereClause: any = {
      storeId: store.id
    };
    
    // Add additional filters if provided
    if (pageSlug) {
      whereClause.slug = pageSlug;
    }
    
    if (pageType) {
      whereClause.pageType = pageType;
    }
    
    // Fetch the pages with components
    const pages = await prisma.page.findMany({
      where: whereClause,
      include: {
        components: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { pageOrder: 'asc' }
    });
    
    // Process pages to include structured components
    const processedPages = pages.map(page => {
      const processedComponents = page.components.reduce((acc, component) => {
        const { componentType, content } = component;
        const jsonContent = content as ComponentContent;
        
        // Use componentType as the key (lowercase)
        const key = componentType.toLowerCase();
        
        // Different component types require different structures
        switch (componentType) {
          case 'NAVBAR':
            acc[key] = {  
              componentId: component.id,
              items: jsonContent?.items || [],
              styles: jsonContent?.styles || {}
            };
            break;
          case 'HERO':
            acc[key] = {
              componentId: component.id,
              items: jsonContent?.items || [],
              styles: jsonContent?.styles || {}
            };
            break;
          case 'COLLECTION':
            acc[key] = {
              componentId: component.id,
              items: jsonContent?.items || [],
              styles: jsonContent?.styles || {}
            };
            break;
          case 'PRODUCT':
            acc[key] = {
             componentId: component.id,
              items: jsonContent?.items || [],
              styles: jsonContent?.styles || {}
            };
            break;
          case 'FOOTER':
            acc[key] = {
              componentId: component.id,
              columns: jsonContent?.columns || [],
              socialLinks: jsonContent?.socialLinks || [],
              styles: jsonContent?.styles || {}
            };
            break;
          default:
            acc[key] = jsonContent || {};
        }
        
        return acc;
      }, {} as Record<string, any>);
      
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        isPublished: page.isPublished,
        pageOrder: page.pageOrder,
        components: processedComponents
      };
    });
    
    return NextResponse.json(processedPages);
    
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
} 