import { shopify } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shop = searchParams.get('shop');

    if (!shop) {
      console.error('Missing shop parameter');
      return NextResponse.json(
        { error: 'Missing shop parameter' },
        { status: 400 }
      );
    }

    console.log('Initiating auth for shop:', shop);
    const authPath = await shopify.auth.begin({
      shop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
      },
    });

    console.log('Redirecting to:', authPath);
    return NextResponse.redirect(new URL(authPath, request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 