"use client";

import React, { useState, useEffect } from 'react';
import { DynamoOrder } from '@/app/types/orders';
import { MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useSettings } from './contexts/settings-context';

export default function HomePage() {
  const { settings } = useSettings();
  const [orders, setOrders] = useState<DynamoOrder[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
          const response = await fetch(`${apiUrl}/api/orders`);
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await response.json();
          console.log('getting order data in home page', data)
          setOrders(data);
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setIsOrdersLoading(false);
        }
      };

      fetchOrders();
    }, []);

  const orderStats = {
    'Placed': orders?.filter(o => o?.OrderStatus === 'Placed')?.length || 0,
    'Preparing': orders?.filter(o => o?.OrderStatus === 'Preparing')?.length || 0,
    'Ready': orders?.filter(o => o?.OrderStatus === 'Ready')?.length || 0,
    'Delivered': orders?.filter(o => o?.OrderStatus === 'Delivered')?.length || 0,
    'Cancelled': orders?.filter(o => o?.OrderStatus === 'Cancelled')?.length || 0
  };

  const statusColors = {
    'Placed': 'bg-blue-100 text-blue-800 border-blue-200',
    'Preparing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Ready': 'bg-green-100 text-green-800 border-green-200',
    'Delivered': 'bg-gray-100 text-gray-800 border-gray-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="space-y-8">
      {/* Restaurant Info Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">{settings.RESTAURANT_NAME}</h1>
          <p className="text-amber-800 text-lg">{settings.RESTAURANT_DESCRIPTION}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">Location</div>
              <div className="text-gray-900">{settings.RESTAURANT_ADDRESS}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">Hours</div>
              <div className="text-gray-900">{settings.RESTAURANT_HOURS}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">Phone</div>
              <div className="text-gray-900">{settings.RESTAURANT_SUPPORT_PHONE}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="text-gray-900">{settings.RESTAURANT_EMAIL}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Today's Orders</h2>
        {isOrdersLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => (
              <Card key={i} className="p-6 border-2 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(orderStats).map(([status, count]) => (
              <Link key={status} href={`/orders?status=${status}`}>
                <Card className={`p-6 border-2 ${statusColors[status as keyof typeof statusColors]} group hover:shadow-lg transition-all duration-200 cursor-pointer relative`}>
                  <div className="text-3xl font-bold mb-1">{count}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{status}</div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
