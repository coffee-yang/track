import { NextResponse } from 'next/server';
import { shopify, storeShopAccessToken } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    console.log('Auth callback received:', request.url);
    
    // 获取查询参数
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    console.log('Auth callback params:', { 
      shop, 
      code: code ? '✓ Present' : '✗ Missing', 
      state: state ? '✓ Present' : '✗ Missing' 
    });

    if (!shop || !code || !state) {
      console.error('Missing required parameters:', { shop, code: !!code, state: !!state });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 验证商店域名格式
    if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
    }

    const callback = await shopify.auth.callback({
      rawRequest: request,
    });

    console.log('Auth callback result:', {
      shop: callback.session.shop,
      accessToken: callback.session.accessToken ? '✓ Present' : '✗ Missing',
      scope: callback.session.scope,
      isOnline: callback.session.isOnline,
    });

    if (!callback.session.accessToken || !callback.session.shop) {
      throw new Error('Missing session data');
    }

    // 存储访问令牌
    await storeShopAccessToken(callback.session.shop, callback.session.accessToken);

    // 重定向到应用主页
    const appHome = new URL('/', request.url).toString();
    const redirectUrl = `${appHome}?shop=${callback.session.shop}`;
    console.log('Redirecting to:', redirectUrl);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Authentication failed: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 