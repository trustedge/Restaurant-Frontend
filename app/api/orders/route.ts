import { NextResponse } from 'next/server';
import { getAllOrders } from "@/app/utils/dynamodb";

export const dynamic = 'force-static'

export async function GET() {
  try {
    console.log('api/order/route.ts l8')
    console.log('logging NODE_ENV', process.env.NODE_ENV)
    
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
