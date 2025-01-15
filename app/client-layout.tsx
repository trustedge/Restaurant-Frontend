"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Users, Settings, Calendar, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Load admin state from localStorage on client-side only
  useEffect(() => {
    const saved = localStorage.getItem('isAdmin');
    if (saved !== null) {
      setIsAdmin(JSON.parse(saved));
    }
  }, []);

  // Save admin state changes to localStorage
  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { name: 'Orders', icon: ClipboardList, href: '/orders' },
    { name: 'Menu', icon: Menu, href: '/menu' },
    { name: 'Reservations', icon: Calendar, href: '/reservations' },
    ...(isAdmin ? [{ name: 'Settings', icon: Settings, href: '/settings' }] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold text-gray-800`}>
            Restaurant App
          </h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <item.icon className="h-5 w-5" />
              {isSidebarOpen && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Users className="h-5 w-5" />
            {isSidebarOpen && (
              <span className="ml-3">
                {isAdmin ? 'Switch to Employee' : 'Switch to Admin'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
