import { shopify } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { shop, code, state } = Object.fromEntries(searchParams.entries());

    console.log('Auth callback received:', { shop, code, state });

    if (!shop || !code || !state) {
      console.error('Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
    });

    console.log('Auth callback successful:', callbackResponse);
    
    // 重定向到应用主页
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json(
      { error: 'Authentication callback failed' },
      { status: 500 }
    );
  }
} 