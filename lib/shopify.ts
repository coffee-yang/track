import { shopifyApi, LATEST_API_VERSION, LogSeverity } from '@shopify/shopify-api';
import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

// 检查必要的环境变量
const requiredEnvVars = {
  SHOPIFY_API_KEY: publicRuntimeConfig.SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET: serverRuntimeConfig.SHOPIFY_API_SECRET,
  SHOPIFY_APP_SCOPES: publicRuntimeConfig.SHOPIFY_APP_SCOPES,
  HOST: publicRuntimeConfig.HOST,
};

// 检查缺失的环境变量
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

// 打印所有环境变量的状态（不包含敏感值）
console.log('Environment Variables Status:', {
  SHOPIFY_API_KEY: requiredEnvVars.SHOPIFY_API_KEY ? '✓ Set' : '✗ Missing',
  SHOPIFY_API_SECRET: requiredEnvVars.SHOPIFY_API_SECRET ? '✓ Set' : '✗ Missing',
  SHOPIFY_APP_SCOPES: requiredEnvVars.SHOPIFY_APP_SCOPES,
  HOST: requiredEnvVars.HOST,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
});

if (missingEnvVars.length > 0) {
  console.error('Critical environment variables are missing:', missingEnvVars);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

// 初始化 Shopify API
export const shopify = shopifyApi({
  apiKey: requiredEnvVars.SHOPIFY_API_KEY!,
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