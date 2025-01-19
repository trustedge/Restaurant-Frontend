"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMenu } from '@/app/contexts/menu-context';
import { Plus, Check, X, Search, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface OrderItem {
  M: {
    Name: { S: string };
    Notes: { S: string };
  };
}

interface Customer {
  M: {
    Name: { S: string };
    PhoneNumber: { S: string };
  };
}

interface Order {
  OrderNumber: { S: string };
  timestamp: { S: string };
  Customer: Customer;
  Items: { L: OrderItem[] };
  Notes: { S: string };
  OrderDateTime: { S: string };
  OrderStatus: { S: string };
  UpdateDateTime: { S: string };
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number>(-1);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayedItems, setDisplayedItems] = useState<number>(40); // Increased initial load
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { menuItems, categories, filterMenuItems } = useMenu();
  const statusOptions = ['Placed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
  
  const statusColors = {
    'Placed': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-yellow-100 text-yellow-800',
    'Ready': 'bg-green-100 text-green-800',
    'Delivered': 'bg-gray-100 text-gray-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const [orders, setOrders] = useState<Order[]>([
    {
      OrderNumber: { S: "e0d0742c-579f" },
      timestamp: { S: "1729121765" },
      Customer: { M: { Name: { S: "Sam Wilson" }, PhoneNumber: { S: "123-456-7890" } } },
      Items: { L: [
        { M: { Name: { S: "Fried Chicken Platter" }, Notes: { S: "no cornbread" } } },
        { M: { Name: { S: "Coffee" }, Notes: { S: "decaf" } } }
      ]},
      Notes: { S: "Allergic to nuts" },
      OrderDateTime: { S: "2024-10-16T23:36:05.714Z" },
      OrderStatus: { S: "Preparing" },
      UpdateDateTime: { S: "2024-10-16T23:36:05.714Z" }
    },
    {
      OrderNumber: { S: "f1e8742d-680g" },
      timestamp: { S: "1729121766" },
      Customer: { M: { Name: { S: "Emily Chen" }, PhoneNumber: { S: "123-555-0123" } } },
      Items: { L: [
        { M: { Name: { S: "Caesar Salad" }, Notes: { S: "dressing on side" } } },
        { M: { Name: { S: "Grilled Salmon" }, Notes: { S: "well done" } } },
        { M: { Name: { S: "Sparkling Water" }, Notes: { S: "" } } }
      ]},
      Notes: { S: "Priority order" },
      OrderDateTime: { S: "2024-10-16T23:40:05.714Z" },
      OrderStatus: { S: "Placed" },
      UpdateDateTime: { S: "2024-10-16T23:40:05.714Z" }
    },
    {
      OrderNumber: { S: "g2f9853e-791h" },
      timestamp: { S: "1729121767" },
      Customer: { M: { Name: { S: "Michael Brown" }, PhoneNumber: { S: "123-777-8888" } } },
      Items: { L: [
        { M: { Name: { S: "Burger Deluxe" }, Notes: { S: "medium rare" } } },
        { M: { Name: { S: "Sweet Potato Fries" }, Notes: { S: "extra crispy" } } },
        { M: { Name: { S: "Chocolate Shake" }, Notes: { S: "" } } },
        { M: { Name: { S: "Apple Pie" }, Notes: { S: "warmed" } } }
      ]},
      Notes: { S: "Birthday celebration" },
      OrderDateTime: { S: "2024-10-16T23:42:05.714Z" },
      OrderStatus: { S: "Ready" },
      UpdateDateTime: { S: "2024-10-16T23:42:05.714Z" }
    }
  ]);

  // Get filtered menu items
  const filteredItems = filterMenuItems(selectedCategory, menuSearchTerm);

  // Scroll handler with improved loading logic
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollThreshold = 300; // Increased threshold for earlier loading

    if (!isLoadingMore && 
        scrollHeight - (scrollTop + clientHeight) < scrollThreshold && 
        displayedItems < filteredItems.length) {
      setIsLoadingMore(true);
      
      // Clear any existing timeout
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }

      // Add delay to prevent rapid firing
      loadMoreTimeoutRef.current = setTimeout(() => {
        setDisplayedItems(prev => Math.min(prev + 40, filteredItems.length)); // Load more items at once
        setIsLoadingMore(false);
      }, 300); // Reduced delay
    }
  };

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(40);
  }, [selectedCategory, menuSearchTerm]);

  // Update filter status when URL query parameter changes
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setFilterStatus(status);
    }
  }, [searchParams]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    return date.toLocaleTimeString();
  };

  const handleStatusChange = (orderIndex: number, newStatus: string) => {
    const updatedOrders = [...orders];
    updatedOrders[orderIndex].OrderStatus.S = newStatus;
    setOrders(updatedOrders);
  };

  const filterOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.OrderStatus.S === filterStatus;
    const matchesSearch = 
      order.Customer.M.Name.S.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.OrderNumber.S.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Items.L.some(item => item.M.Name.S.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with counters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.OrderStatus.S === 'Placed').length}
            </div>
            <div className="text-sm text-gray-600">New Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.OrderStatus.S === 'Preparing').length}
            </div>
            <div className="text-sm text-gray-600">Preparing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.OrderStatus.S === 'Ready').length}
            </div>
            <div className="text-sm text-gray-600">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {orders.filter(o => o.OrderStatus.S === 'Delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {orders.filter(o => o.OrderStatus.S === 'Cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search orders, customers, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <Button className="bg-blue-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-max">
        {filterOrders.map((order, orderIndex) => (
          <div key={order.OrderNumber.S} 
               className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                 order.OrderStatus.S === 'Placed' ? 'border-blue-500' :
                 order.OrderStatus.S === 'Preparing' ? 'border-yellow-500' :
                 order.OrderStatus.S === 'Ready' ? 'border-green-500' :
                 order.OrderStatus.S === 'Delivered' ? 'border-gray-500' :
                 'border-red-500'
               }`}
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">#{order.OrderNumber.S}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[order.OrderStatus.S as keyof typeof statusColors]}`}>
                    {order.OrderStatus.S}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(order.OrderDateTime.S)}
                </div>
              </div>
              <select
                value={order.OrderStatus.S}
                onChange={(e) => handleStatusChange(orderIndex, e.target.value)}
                className={`px-2 py-1 rounded-md text-sm ${statusColors[order.OrderStatus.S as keyof typeof statusColors]}`}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <div className="font-medium">{order.Customer.M.Name.S}</div>
              <div className="text-sm text-gray-600">{order.Customer.M.PhoneNumber.S}</div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Items</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentOrderIndex(orderIndex);
                    setSelectedItems(new Set());
                    setIsMenuDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Items
                </Button>
              </div>
              {order.Items.L.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{item.M.Name.S}</div>
                    <Input
                      type="text"
                      value={item.M.Notes.S}
                      placeholder="Add notes..."
                      className="text-sm w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500"
                      onChange={(e) => {
                        const updatedOrders = [...orders];
                        updatedOrders[orderIndex].Items.L[itemIndex].M.Notes.S = e.target.value;
                        setOrders(updatedOrders);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="mt-4">
              <Textarea
                value={order.Notes.S}
                onChange={(e) => {
                  const updatedOrders = [...orders];
                  updatedOrders[orderIndex].Notes.S = e.target.value;
                  setOrders(updatedOrders);
                }}
                placeholder="Add order notes..."
                className="w-full h-20 text-sm"
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <Check className="h-4 w-4 mr-1" />
                Complete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Selection Dialog */}
      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent className="w-[95vw] h-[90vh] p-0 flex flex-col">
          {/* Static Header */}
          <div className="flex-none">
            <div className="p-6 border-b bg-white">
              <div className="max-w-[1400px] mx-auto px-4">
                <DialogHeader>
                  <DialogTitle>Add Menu Items</DialogTitle>
                </DialogHeader>
              </div>
            </div>
            
            {/* Search and Categories */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="space-y-4 max-w-[1400px] mx-auto px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search menu items..."
                    className="pl-10"
                    value={menuSearchTerm}
                    onChange={(e) => {
                      setMenuSearchTerm(e.target.value);
                      setDisplayedItems(40);
                    }}
                  />
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2 min-w-0">
                  {['All', ...categories].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCategory(category);
                        setDisplayedItems(40);
                      }}
                      className="whitespace-nowrap"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Menu Items Grid */}
          <div className="flex-1 overflow-y-auto p-6" ref={scrollContainerRef} onScroll={handleScroll}>
            <div className="w-full max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.slice(0, displayedItems).map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors relative ${
                      selectedItems.has(item.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => {
                      const newSelectedItems = new Set(selectedItems);
                      if (selectedItems.has(item.id)) {
                        newSelectedItems.delete(item.id);
                      } else {
                        newSelectedItems.add(item.id);
                      }
                      setSelectedItems(newSelectedItems);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium truncate mr-2">{item.name}</div>
                      <div className="text-sm font-semibold whitespace-nowrap">{item.price}</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 truncate">{item.description}</div>
                    {selectedItems.has(item.id) && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Loading indicator */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}
          </div>

          {/* Static Footer */}
          <div className="flex-none p-4 border-t bg-white">
            <div className="max-w-[1400px] mx-auto px-4">
              <DialogFooter>
              <Button variant="outline" onClick={() => setIsMenuDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (currentOrderIndex >= 0) {
                    const updatedOrders = [...orders];
                    const newItems = Array.from(selectedItems).map(id => {
                      const menuItem = menuItems.find(item => item.id === id);
                      return {
                        M: {
                          Name: { S: menuItem?.name || '' },
                          Notes: { S: '' }
                        }
                      };
                    });
                    updatedOrders[currentOrderIndex].Items.L = [
                      ...updatedOrders[currentOrderIndex].Items.L,
                      ...newItems
                    ];
                    setOrders(updatedOrders);
                  }
                  setIsMenuDialogOpen(false);
                  setSelectedItems(new Set());
                }}
              >
                Add Selected Items ({selectedItems.size})
              </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
