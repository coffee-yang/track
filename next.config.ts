import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
    SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
    SHOPIFY_APP_SCOPES: process.env.SHOPIFY_APP_SCOPES,
    SHOP_DOMAIN: process.env.SHOP_DOMAIN,
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors https://*.myshopify.com https://admin.shopify.com;`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;