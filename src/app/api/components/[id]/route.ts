import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ComponentContent {
  items?: any[];
  styles?: Record<string, any>;
  columns?: any[];
  socialLinks?: any[];
  [key: string]: any;
}

// GET a specific page component by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // In Next.js 14/15, we must await params directly before destructuring
    const params = await context.params;
    const { id } = params;
    
    console.log('GET request received for component ID:', id);
    
    // Parse the ID to an integer
    const componentId = parseInt(id);
    
    if (isNaN(componentId)) {
      return NextResponse.json({ message: "Invalid component ID" }, { status: 400 });
    }
    
    // Fetch the component
    const component = await prisma.pageComponent.findUnique({
      where: { id: componentId },
    });
    
    if (!component) {
      return NextResponse.json({ message: "Component not found" }, { status: 404 });
    }
    
    // Format the response based on component type
    const { componentType, content } = component;
    let formattedContent;
    
    // Convert content to ComponentContent type
    const jsonContent = content as ComponentContent || {};
    
    // Format the content based on component type
    if (componentType === 'FOOTER') {
      formattedContent = {
        componentId: component.id,
        componentType: componentType.toLowerCase(),
        columns: jsonContent.columns || [],
        socialLinks: jsonContent.socialLinks || [],
        styles: jsonContent.styles || {}
      };
    } else {
      // Generic format for other components
      formattedContent = {
        componentId: component.id,
        componentType: componentType.toLowerCase(),
        content: jsonContent
      };
    }

    return NextResponse.json(formattedContent);
    
  } catch (error: any) {
    console.error('Error fetching component:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

// Update a component directly by ID (no auth required - as requested)
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // In Next.js 14/15, we must await params directly before destructuring
    const params = await context.params;
    const { id } = params;
    
    console.log('PATCH request received for component ID:', id);
    
    // Parse the ID to an integer
    const componentId = parseInt(id);
    
    if (isNaN(componentId)) {
      console.error('Invalid component ID:', id);
      return NextResponse.json({ message: "Invalid component ID" }, { status: 400 });
    }
    
    // Fetch the component to check if it exists
    const component = await prisma.pageComponent.findUnique({
      where: { id: componentId }
    });
    
    if (!component) {
      console.error('Component not found with ID:', componentId);
      return NextResponse.json({ message: "Component not found" }, { status: 404 });
    }
    
    console.log('Component found:', {
      id: component.id,
      type: component.componentType,
      pageId: component.pageId
    });
    
    // Parse the request body
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 });
    }
    
    const { content } = body;
    
    if (!content) {
      console.error('Missing content in request body');
      return NextResponse.json({ message: "Invalid request. Expected content object." }, { status: 400 });
    }
    
    // DEBUG: Log the content update being received
    console.log('Content update received:', JSON.stringify(content, null, 2));
    
    // Update the component
    try {
      const updatedComponent = await prisma.pageComponent.update({
        where: { id: componentId },
        data: { content }
      });
      
      console.log(`Updated component ID: ${updatedComponent.id} successfully`);
      
      // Format the response
      let formattedContent;
      const jsonContent = content as ComponentContent;
      
      if (component.componentType === 'FOOTER') {
        formattedContent = {
          componentId: updatedComponent.id,
          componentType: component.componentType.toLowerCase(),
          columns: jsonContent.columns || [],
          socialLinks: jsonContent.socialLinks || [],
          styles: jsonContent.styles || {}
        };
      } else {
        // Generic format for other components
        formattedContent = {
          componentId: updatedComponent.id,
          componentType: component.componentType.toLowerCase(),
          content: jsonContent
        };
      }
      
      return NextResponse.json({
        message: "Component updated successfully",
        component: formattedContent
      });
    } catch (dbError) {
      console.error('Database error during component update:', dbError);
      return NextResponse.json({ 
        message: "Database error during update",
        error: dbError instanceof Error ? dbError.message : 'Unknown database error' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error updating component:', error);
    return NextResponse.json({ 
      message: error.message || 'Server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 