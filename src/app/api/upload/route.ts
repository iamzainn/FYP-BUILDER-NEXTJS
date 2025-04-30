import { NextRequest, NextResponse } from 'next/server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

import { v4 as uuidv4 } from 'uuid';

// Upload media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get the file from the request
    const file = formData.get('file') as File;
    const component = formData.get('component') as string;
    const itemId = formData.get('itemId') as string | undefined;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!component) {
      return NextResponse.json(
        { success: false, message: 'Component type is required' },
        { status: 400 }
      );
    }
    
    // Get the file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const uniqueId = uuidv4();
    const fileName = `${component}_${uniqueId}${fileExtension}`;
    
    // Create the directory path if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }
    
    // Write the file to disk
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Construct the URL for the uploaded file
    const fileUrl = `/uploads/${fileName}`;
    
    // Return the file URL
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName: fileName,
        originalName: file.name,
        component: component,
        itemId: itemId || null
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred during file upload',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}

// Get all media for a website
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const websiteId = searchParams.get('websiteId') || 'default';
  
  try {
    // In a real app, you would query your database for media files
    // For now, we're just returning a placeholder response
    return NextResponse.json({
      success: true,
      data: [
        {
          url: '/uploads/placeholder.jpg',
          fileName: 'placeholder.jpg',
          component: 'logo',
          websiteId: websiteId
        }
      ]
    });
    
  } catch (error) {
    console.error('Error fetching media:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
} 