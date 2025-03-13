'use client';

import { useState, useEffect } from 'react';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

export default function Home() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');
  const [shop, setShop] = useState('');

  useEffect(() => {
    // 从 URL 获取商店域名
    const urlParams = new URLSearchParams(window.location.search);
    const shopParam = urlParams.get('shop');
    if (shopParam) {
      setShop(shopParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber, email, shop }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setTrackingNumber(data.trackingNumber);
        setError('');
      }
    } catch (_err) {
      setError('An error occurred while fetching the tracking number.');
    }
  };

  // 如果没有商店参数，显示错误信息
  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">Shop parameter is missing</p>
        </div>
      </div>
    );
  }

  return (
    <PolarisProvider i18n={enTranslations}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Track Your Order
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your order number and email to get tracking information
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                    Order Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="orderNumber"
                      name="orderNumber"
                      type="text"
                      required
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Track Order
                  </button>
                </div>
              </form>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {trackingNumber && (
            <div className="mt-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Tracking Number: {trackingNumber}</span>
            </div>
          )}
        </div>
      </div>
    </PolarisProvider>
  );
}