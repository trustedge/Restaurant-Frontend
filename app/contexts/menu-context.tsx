"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '@/app/types/menu';
export type { MenuItem };
import { getAllMenuItems } from '@/app/utils/dynamodb';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: string[];
  filterMenuItems: (category: string, searchTerm: string) => MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getAllMenuItems();
        setMenuItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch menu items. Please try again later.');
        console.error('Error fetching menu items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  const filterMenuItems = (category: string, searchTerm: string) => {
    return menuItems.filter(item => 
      (category === 'All' || item.category === category) &&
      (searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <MenuContext.Provider value={{ 
      menuItems, 
      setMenuItems, 
      categories, 
      filterMenuItems,
      isLoading,
      error 
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
