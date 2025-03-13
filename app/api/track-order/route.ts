import { NextResponse } from 'next/server';
import { getShopAccessToken } from '@/lib/shopify';

export async function POST(req: Request) {
  try {
    const { orderNumber, email, shop } = await req.json();

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop domain is required' },
        { status: 400 }
      );
    }

    const accessToken = await getShopAccessToken(shop);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Shop not found or not authenticated' },
        { status: 401 }
      );
    }

    // 使用 Shopify Admin REST API
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/orders/${orderNumber}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    const { order } = await response.json();

    // 验证邮箱
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match order' },
        { status: 400 }
      );
    }

    // 获取跟踪号
    const trackingNumber = order.fulfillments?.[0]?.tracking_number;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'No tracking number found for this order' },
        { status: 404 }
      );
    }

    return NextResponse.json({ trackingNumber });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}