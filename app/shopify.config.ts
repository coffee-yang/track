import { LogSeverity } from '@shopify/shopify-api';

const shopifyConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: (process.env.SHOPIFY_APP_SCOPES || '').split(','),
  hostName: process.env.HOST?.replace(/https:\/\//, ''),
  apiVersion: '2024-01',
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Info,
  },
};

export default shopifyConfig;