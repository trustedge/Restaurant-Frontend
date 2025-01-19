"use client";

import React, { useState } from 'react';
import { Menu, Users, Settings, Calendar, ClipboardList, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from './contexts/admin-context';
import { useSettings } from './contexts/settings-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, setIsAdmin } = useAdmin();
  const { settings } = useSettings();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigationItems = [
    { name: 'Orders', icon: ClipboardList, href: '/orders' },
    { name: 'Menu', icon: Menu, href: '/menu' },
    { name: 'Reservations', icon: Calendar, href: '/reservations' },
    ...(isAdmin ? [{ name: 'Settings', icon: Settings, href: '/settings' }] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-amber-50 to-white shadow-lg transition-all duration-300 border-r border-amber-100`}>
        <div className="flex h-20 items-center justify-between px-4 border-b border-amber-100">
          <Link href="/" className={`${isSidebarOpen ? 'block' : 'hidden'} group`}>
            <h1 className="text-xl font-bold text-amber-800 group-hover:text-amber-600 transition-colors">
              {settings.RESTAURANT_NAME}
            </h1>
            <p className="text-xs text-amber-600">{settings.RESTAURANT_HOURS}</p>
          </Link>
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
              className="flex items-center px-4 py-3 text-amber-900 hover:bg-amber-50 transition-colors duration-200"
            >
              <item.icon className="h-5 w-5" />
              {isSidebarOpen && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4 w-full px-4">
          <div className="flex justify-start">
            <button
              onClick={() => {
                if (!isAdmin) {
                  setPasswordDialogOpen(true);
                  setPassword('');
                  setError('');
                } else {
                  setIsAdmin(false);
                }
              }}
              className="flex items-center px-4 py-2 text-sm text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-200"
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-amber-50/30 to-white">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Admin Password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (password === '1234') {
                      setIsAdmin(true);
                      setPasswordDialogOpen(false);
                    } else {
                      setError('Incorrect password');
                    }
                  }
                }}
                className={error ? 'border-red-500' : ''}
              />
              <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (password === '1234') {
                  setIsAdmin(true);
                  setPasswordDialogOpen(false);
                } else {
                  setError('Incorrect password');
                }
              }}
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
