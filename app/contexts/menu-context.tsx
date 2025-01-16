"use client";

import React, { createContext, useContext, useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  calories: string;
  description: string;
  category: string;
}

interface MenuContextType {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Cheeseburger Deluxe",
      price: "$12.99",
      calories: "950",
      description: "1/3 lb beef patty with American cheese, lettuce, tomato, onion, pickles, and fries.",
      category: "Main Course"
    },
    {
      id: "2",
      name: "Crispy Calamari",
      price: "$9.99",
      calories: "450",
      description: "Tender calamari rings lightly breaded and fried, served with marinara sauce and lemon wedges.",
      category: "Appetizers"
    },
    {
      id: "3",
      name: "Chocolate Lava Cake",
      price: "$7.99",
      calories: "650",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream and raspberry sauce.",
      category: "Desserts"
    },
    {
      id: "4",
      name: "Caesar Salad",
      price: "$8.99",
      calories: "320",
      description: "Crisp romaine lettuce, parmesan cheese, croutons, and creamy Caesar dressing.",
      category: "Appetizers"
    },
    {
      id: "5",
      name: "Grilled Salmon",
      price: "$24.99",
      calories: "580",
      description: "Fresh Atlantic salmon fillet grilled to perfection, served with roasted vegetables and quinoa.",
      category: "Main Course"
    },
    {
      id: "6",
      name: "Craft Mojito",
      price: "$8.99",
      calories: "180",
      description: "Fresh mint, lime juice, simple syrup, rum, and club soda, garnished with mint leaves.",
      category: "Beverages"
    }
  ]);

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems }}>
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
