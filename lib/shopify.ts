import { shopifyApi, LATEST_API_VERSION, LogSeverity } from '@shopify/shopify-api';

// 初始化 Shopify API
export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: (process.env.SHOPIFY_APP_SCOPES || '').split(','),
  hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'localhost:3000',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: { level: LogSeverity.Info },
});

// 存储访问令牌的简单对象
const tokenStore: { [key: string]: string } = {};

// 获取商店访问令牌
export async function getShopAccessToken(shop: string): Promise<string | null> {
  return tokenStore[shop] || null;
}

// 存储商店访问令牌
export async function storeShopAccessToken(shop: string, accessToken: string): Promise<void> {
  tokenStore[shop] = accessToken;
} 