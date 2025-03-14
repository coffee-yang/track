import { shopify } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shop = searchParams.get('shop');

    if (!shop) {
      return NextResponse.json(
        { error: 'Missing shop parameter' },
        { status: 400 }
      );
    }

    // 获取商店访问令牌
    const accessToken = await shopify.config.sessionStorage.loadSession(shop);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Shop not authenticated' },
        { status: 401 }
      );
    }

    // 创建客户端
    const client = new shopify.clients.Rest({
      session: accessToken,
    });

    // 获取客户列表
    const response = await client.get({
      path: 'customers',
      query: {
        limit: 50,
      },
    });

    return NextResponse.json({ customers: response.body.customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch customers: ${errorMessage}` },
      { status: 500 }
    );
  }
} 