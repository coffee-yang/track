import { shopify } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { shop, code, state } = Object.fromEntries(searchParams.entries());

    console.log('Auth callback received:', {
      shop,
      code: code ? '***' : undefined,
      state: state ? '***' : undefined,
      headers: Object.fromEntries(request.headers.entries()),
    });

    if (!shop || !code || !state) {
      const missingParams = [];
      if (!shop) missingParams.push('shop');
      if (!code) missingParams.push('code');
      if (!state) missingParams.push('state');

      console.error(`Missing required parameters: ${missingParams.join(', ')}`);
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      );
    }

    // 验证商店域名格式
    if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      console.error('Invalid shop domain:', shop);
      return NextResponse.json(
        { error: 'Invalid shop domain' },
        { status: 400 }
      );
    }

    console.log('Processing callback for shop:', shop);

    const rawRequest = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    };

    console.log('Raw request:', rawRequest);

    const callbackResponse = await shopify.auth.callback({
      rawRequest,
    });

    console.log('Auth callback response:', {
      success: !!callbackResponse.session,
      shop: callbackResponse.session?.shop,
      scope: callbackResponse.session?.scope,
      accessToken: callbackResponse.session?.accessToken ? '***' : undefined,
    });

    if (!callbackResponse.session) {
      throw new Error('No session data received from Shopify');
    }
    
    // 重定向到应用主页
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('shop', shop);
    console.log('Redirecting to:', redirectUrl.toString());

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Authentication callback failed: ${errorMessage}` },
      { status: 500 }
    );
  }
} 