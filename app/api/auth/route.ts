import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    
    console.log('Auth request received:', {
      url: request.url,
      shop,
      headers: Object.fromEntries(request.headers.entries()),
    });
    
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
      isOnline: false,
      rawRequest: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        statusCode: 200,
        statusMessage: 'OK',
        socket: {
          encrypted: url.protocol === 'https:',
        },
      } as unknown
    });

    console.log('Starting OAuth flow:', {
      shop,
      authUrl,
      callbackPath: '/api/auth/callback',
      isOnline: false,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Authentication failed: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 