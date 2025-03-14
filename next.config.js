/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SHOPIFY_API_KEY: '96e3e63379c5091c564fd89aa9709515',
    NEXT_PUBLIC_SHOPIFY_API_KEY: '96e3e63379c5091c564fd89aa9709515',
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
    NEXT_PUBLIC_SHOPIFY_APP_SCOPES: process.env.NEXT_PUBLIC_SHOPIFY_APP_SCOPES || process.env.SHOPIFY_APP_SCOPES || 'read_orders,read_customers',
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST || process.env.HOST || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
          },
        ],
      },
    ];
  },
  optimizeFonts: true,
}

module.exports = nextConfig; 