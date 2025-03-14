'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shop, setShop] = useState('');
  const [error, setError] = useState('');

  // 检查是否已经认证
  const shopParam = searchParams.get('shop');
  if (shopParam) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Welcome to Cheerful Track
          </h1>
          <p className="text-gray-600 text-center mb-8">
            You are authenticated as: {shopParam}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/api/auth?shop=' + shopParam)}
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
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shop) {
      setError('Please enter your shop domain');
      return;
    }

    // 验证商店域名格式
    if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      setError('Invalid shop domain. Please enter a valid Shopify domain (e.g., your-store.myshopify.com)');
      return;
    }

    // 开始认证流程
    router.push('/api/auth?shop=' + encodeURIComponent(shop));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Shopify Track App
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}