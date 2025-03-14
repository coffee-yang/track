import { shopifyApi, LATEST_API_VERSION, LogSeverity } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';

// 检查必要的环境变量
const requiredEnvVars = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '96e3e63379c5091c564fd89aa9709515',
  SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
  SHOPIFY_APP_SCOPES: process.env.NEXT_PUBLIC_SHOPIFY_APP_SCOPES || process.env.SHOPIFY_APP_SCOPES || 'read_orders,read_customers',
  HOST: process.env.NEXT_PUBLIC_HOST || process.env.HOST || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
};

// 检查缺失的环境变量
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value && key !== 'SHOPIFY_API_KEY') // Skip SHOPIFY_API_KEY check as we have a default
  .map(([key]) => key);

// 打印所有环境变量的状态（不包含敏感值）
console.log('Environment Variables Status:', {
  SHOPIFY_API_KEY: '✓ Set (Default or Environment)',
  SHOPIFY_API_SECRET: requiredEnvVars.SHOPIFY_API_SECRET ? '✓ Set' : '✗ Missing',
  SHOPIFY_APP_SCOPES: requiredEnvVars.SHOPIFY_APP_SCOPES,
  HOST: requiredEnvVars.HOST,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
});

if (missingEnvVars.length > 0) {
  console.error('Critical environment variables are missing:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// 初始化 Shopify API
export const shopify = shopifyApi({
  apiKey: requiredEnvVars.SHOPIFY_API_KEY,
  apiSecretKey: requiredEnvVars.SHOPIFY_API_SECRET!,
  scopes: requiredEnvVars.SHOPIFY_APP_SCOPES.split(','),
  hostName: requiredEnvVars.HOST.replace(/https?:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: { 
    level: LogSeverity.Info,
    httpRequests: true,
    timestamps: true,
  },
});

console.log('Shopify API Configuration:', {
  hostName: requiredEnvVars.HOST.replace(/https?:\/\//, ''),
  scopes: requiredEnvVars.SHOPIFY_APP_SCOPES.split(','),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
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