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
const mockMenuItems: MenuItem[] = [
  // Appetizers
  { id: "1", name: "Crispy Calamari", price: "$9.99", calories: "450", description: "Tender calamari rings lightly breaded and fried", category: "Appetizers" },
  { id: "2", name: "Bruschetta", price: "$7.99", calories: "280", description: "Toasted bread with fresh tomatoes and basil", category: "Appetizers" },
  { id: "3", name: "Spinach Artichoke Dip", price: "$10.99", calories: "520", description: "Creamy dip with spinach and artichokes", category: "Appetizers" },
  { id: "4", name: "Buffalo Wings", price: "$12.99", calories: "850", description: "Crispy wings with spicy buffalo sauce", category: "Appetizers" },
  { id: "5", name: "Mozzarella Sticks", price: "$8.99", calories: "460", description: "Breaded mozzarella with marinara sauce", category: "Appetizers" },
  { id: "6", name: "Loaded Nachos", price: "$11.99", calories: "920", description: "Tortilla chips with cheese, jalapeños, and all the fixings", category: "Appetizers" },
  { id: "7", name: "Shrimp Cocktail", price: "$13.99", calories: "280", description: "Chilled jumbo shrimp with cocktail sauce", category: "Appetizers" },
  { id: "8", name: "Garlic Bread", price: "$5.99", calories: "320", description: "Toasted bread with garlic butter and herbs", category: "Appetizers" },
  { id: "9", name: "Stuffed Mushrooms", price: "$9.99", calories: "380", description: "Mushroom caps filled with herbs and cheese", category: "Appetizers" },
  { id: "10", name: "Spring Rolls", price: "$8.99", calories: "340", description: "Crispy rolls with vegetables and dipping sauce", category: "Appetizers" },
  { id: "11", name: "Onion Rings", price: "$7.99", calories: "420", description: "Beer-battered onion rings with ranch", category: "Appetizers" },
  { id: "12", name: "Hummus Plate", price: "$8.99", calories: "380", description: "Creamy hummus with pita and vegetables", category: "Appetizers" },
  // Main Course and other items remain the same...
];
export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        let data;
        // Check if we're in DEV mode
        if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
          console.log('Using mock menu items in DEV mode');
          data = mockMenuItems;
        } else {
          console.log('Fetching menu items from DynamoDB');
          data = await getAllMenuItems();
        }
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
