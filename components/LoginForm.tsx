'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shop, setShop] = useState(searchParams.get('shop') || '');
  const [error, setError] = useState('');

  // 检查是否已经认证
  const shopParam = searchParams.get('shop');
  if (shopParam) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-auto">
        <p className="text-gray-600 text-center mb-4">
          You are authenticated as:
        </p>
        <p className="text-lg font-semibold text-center mb-8">
          {shopParam}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push('/api/auth?shop=' + encodeURIComponent(shopParam))}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Re-authenticate
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Switch Shop
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
        setError('Please enter a valid Shopify store domain');
        return;
      }

      const response = await fetch(`/api/auth?shop=${encodeURIComponent(shop)}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Authentication failed');
      }

      const redirectUrl = response.url;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-auto">
      <p className="text-gray-600 text-center mb-8">
        Please enter your Shopify store domain to continue
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="shop" className="block text-sm font-medium text-gray-700 mb-1">
            Shop Domain
          </label>
          <input
            type="text"
            id="shop"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="your-store.myshopify.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
} 