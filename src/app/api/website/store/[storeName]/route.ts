import { NextRequest, NextResponse } from 'next/server';
import { DBService } from '@/services/dbService';


// Get website configuration by store name
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeName: string }> }


) {
  try {
    const { storeName } = await params;
    
    if (!storeName) {
      return NextResponse.json(
        { success: false, message: 'Store name is required' },
        { status: 400 }
      );
    }
    
    console.log("Getting website configuration by store name:", storeName);
    
    const websiteConfig = await DBService.getWebsiteConfigByStoreName(storeName);
    
    if (!websiteConfig) {
      return NextResponse.json(
        { success: false, message: 'Website configuration not found for this store' },
        { status: 404 }
      );
    }
    
    // Return the complete website configuration
    return NextResponse.json({ 
      success: true, 
      data: websiteConfig 
    });
  } catch (error) {
    console.error('Error fetching website config by store name:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
} 