import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';


// POST /api/website/config - Save website configuration
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("website-builder");
    const config = await request.json();

    // Update or insert website configuration
    const result = await db.collection("website-configs").updateOne(
      { storeId: config.storeId },
      { $set: config },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error saving website configuration:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to save website configuration'
    }, { status: 500 });
  }
}

// GET /api/website/config/[storeId] - Get website configuration
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({
        success: false,
        message: 'Store ID is required'
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("website-builder");
    
    const config = await db.collection("website-configs").findOne({ storeId });

    if (!config) {
      return NextResponse.json({
        success: false,
        message: 'Configuration not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching website configuration:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch website configuration'
    }, { status: 500 });
  }
} 