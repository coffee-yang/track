import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    console.log('Auth callback received:', {
      url: request.url,
      shop,
      code,
      state,
      headers: Object.fromEntries(request.headers.entries()),
    });

    if (!shop || !code || !state) {
      console.error('Missing required parameters:', { shop, code, state });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 验证商店域名格式
    if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
    }

    // 处理认证回调
    const callbackResponse = await shopify.auth.callback({
      rawRequest: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        statusCode: 200,
        statusMessage: 'OK',
        socket: {
          encrypted: url.protocol === 'https:',
        },
      } as unknown,
      rawResponse: {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {},
      } as unknown,
    });

    console.log('Auth callback result:', {
      success: !!callbackResponse.session,
      shop: callbackResponse.session?.shop,
      scope: callbackResponse.session?.scope,
      expires: callbackResponse.session?.expires,
    });

    if (!callbackResponse.session) {
      console.error('No session data received from Shopify');
      return NextResponse.json({ error: 'Authentication failed: No session data' }, { status: 500 });
    }

    // 重定向到应用首页
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Authentication failed: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 