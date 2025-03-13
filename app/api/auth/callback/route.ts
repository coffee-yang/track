import { NextResponse } from 'next/server';
import { shopify, storeShopAccessToken } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: request,
    });

    if (!callback.session.accessToken || !callback.session.shop) {
      throw new Error('Missing session data');
    }

    // 存储访问令牌
    await storeShopAccessToken(callback.session.shop, callback.session.accessToken);

    // 重定向到应用主页
    const shop = callback.session.shop;
    return NextResponse.redirect(new URL(`/?shop=${shop}`, request.url));
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 