import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    
    if (!shop) {
      return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
    }

    // 验证商店域名格式
    if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
    }

    // 开始 OAuth 流程
    const authUrl = await shopify.auth.begin({
      shop,
      callbackPath: '/api/auth/callback',
      isOnline: true, // 使用在线访问模式
      rawRequest: request
    });

    console.log('Starting OAuth flow for shop:', shop);
    console.log('Redirecting to:', authUrl);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 