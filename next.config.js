/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    SHOPIFY_APP_SCOPES: process.env.SHOPIFY_APP_SCOPES || 'read_orders,read_customers',
    HOST: process.env.HOST || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  },
  serverRuntimeConfig: {
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
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