'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  totalPrice: string;
  createdAt: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ordersCount: number;
  totalSpent: string;
}

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shop) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // 获取订单数据
        const ordersResponse = await fetch(`/api/orders?shop=${encodeURIComponent(shop)}`);
        if (!ordersResponse.ok) {
          const errorData = await ordersResponse.json();
          // 如果是认证错误，重定向到认证页面
          if (ordersResponse.status === 401) {
            console.log('Authentication required, redirecting to auth...');
            router.push(`/api/auth?shop=${encodeURIComponent(shop)}`);
            return;
          }
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);

        // 获取客户数据
        const customersResponse = await fetch(`/api/customers?shop=${encodeURIComponent(shop)}`);
        if (!customersResponse.ok) {
          const errorData = await customersResponse.json();
          if (customersResponse.status === 401) {
            console.log('Authentication required, redirecting to auth...');
            router.push(`/api/auth?shop=${encodeURIComponent(shop)}`);
            return;
          }
          throw new Error(errorData.error || 'Failed to fetch customers');
        }
        const customersData = await customersResponse.json();
        setCustomers(customersData.customers || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shop, router]);

  if (!shop) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard for {shop}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Switch Shop
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
            <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Customers</h2>
            <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-3xl font-bold text-blue-600">
              ${orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* 最近订单 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 顶级客户 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Top Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers
                  .sort((a, b) => parseFloat(b.totalSpent) - parseFloat(a.totalSpent))
                  .slice(0, 5)
                  .map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.ordersCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.totalSpent}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 